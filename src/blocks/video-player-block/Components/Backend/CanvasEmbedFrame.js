import { useEffect, useRef } from "react";
import { PLYR_SPRITE } from "../../utils/sprite";
import { applyLivePlayback } from "../../utils/config";

/*
 * Free copy of the Pro plugin's _shared/media/CanvasEmbedFrame.js. The only
 * difference: captions are set up through the onPlayerReady callback (Free's
 * own caption code) instead of Pro's caption handler and Vimeo quality menu.
 */

/**
 * A Plyr-skinned YouTube/Vimeo player that plays INSIDE the editor canvas.
 *
 * Why not a plain <iframe> in the canvas: the apiVersion-3 canvas document is a
 * `blob:` URL with an opaque origin, so it sends no Referer — and YouTube
 * answers a referrer-less embed with Error 153.
 *
 * Why not the top-window portal (EditorReactPortal): that works, but it is
 * `position: fixed` in the admin window and has to chase the block's rect on
 * every scroll. The canvas paints its new scroll position first and the overlay
 * catches up a frame later, so the video visibly slides against the page while
 * you scroll. Coalescing into one rAF narrows the gap but cannot close it.
 *
 * What this does instead — the trick @wordpress/components `SandBox` uses
 * internally: an iframe with NO `src` is about:blank and inherits the admin
 * origin, and a document *written* into it with `document.write` behaves like
 * one fetched over the network. That hands the provider a real referrer, and
 * `sandbox="… allow-same-origin …"` keeps the written document on the admin
 * origin so we can still reach into it. Being a real element in the canvas, it
 * scrolls with the content — there is nothing to chase.
 *
 * Plyr is loaded inside that written document rather than skipped, so the editor
 * shows the same control bar as the frontend. If Plyr does not turn up within
 * 5s the provider's own iframe is left in place: native controls, but still
 * in-canvas and still scrolling correctly.
 *
 * Editor-only. On the frontend the document's origin is already real, so a
 * plain inline player is correct and one frame cheaper.
 */

/** Permissions the written frame needs. `allow-same-origin` is the point of it. */
const FRAME_SANDBOX =
  "allow-scripts allow-same-origin allow-presentation allow-popups";

const EMBED_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

const PLYR_VERSION_FALLBACK = "https://cdn.plyr.io/3.7.8";

/**
 * Escapes a value for use inside a double-quoted HTML attribute in the raw
 * markup strings this component writes via frameDoc.write()/innerHTML below.
 *
 * `embedId` comes from getYoutubeId()/getVimeoId(), which only validate the
 * extracted id's length, not its character set - a crafted `source` URL can
 * make them return a string containing a literal `"`, which would otherwise
 * close the attribute early and let the rest of the value inject new
 * attributes or markup into this frame's document (written on the admin
 * origin - see the allow-same-origin note above). `fallbackSrc` is built
 * from the same id, so the same risk applies there.
 */
const escapeHtmlAttr = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * URL of the plyr.js/plyr.css already enqueued on this page, so the written
 * document loads the same build the rest of the plugin uses. Falls back to the
 * CDN when the tag can't be found.
 */
const findAssetUrl = (selector, test, fallback) => {
  if (typeof document === "undefined") return fallback;
  const docs = [document];
  if (
    typeof window !== "undefined" &&
    window.top &&
    window.top.document &&
    window.top.document !== document
  ) {
    try {
      docs.push(window.top.document);
    } catch (e) {
      /* cross-origin top guard */
    }
  }
  for (const doc of docs) {
    try {
      const tag = Array.from(doc.querySelectorAll(selector)).find((el) =>
        test(el.src || el.href || ""),
      );
      if (tag) return tag.src || tag.href;
    } catch (e) {
      /* ignore */
    }
  }
  return fallback;
};

// One value per editor session: a fresh frame still runs the script, but the
// browser can reuse the copy it already has. A new value on every rebuild made
// each switch re-download plyr.js, which on a slow site took longer than the
// 5s wait above.
const PLYR_SCRIPT_TOKEN = Date.now();

const getPlyrScriptUrl = () => {
  const url = findAssetUrl(
    "script[src]",
    (u) => /\/plyr(\.min)?\.js/.test(u),
    `${PLYR_VERSION_FALLBACK}/plyr.js`,
  );
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}t=${PLYR_SCRIPT_TOKEN}`;
};

const getPlyrCssUrl = () =>
  findAssetUrl(
    'link[rel="stylesheet"]',
    (url) => url.includes("plyr"),
    `${PLYR_VERSION_FALLBACK}/plyr.css`,
  );

const getViewCssUrl = () =>
  findAssetUrl(
    'link[rel="stylesheet"]',
    (url) => url.includes("video-player-block") && url.includes("view.css"),
    "",
  );

/**
 * Plyr's `<use href="#plyr-play">` icons only resolve against symbols in its
 * OWN document, and its built-in sprite fetch runs in that document's realm
 * (where a CDN request may be blocked). So fetch the sprite out here, where the
 * origin is real, and inject it into the frame's document.
 */
const injectSprite = (frameDoc) => {
  if (!frameDoc || frameDoc.getElementById("sprite-plyr")) {
    return Promise.resolve();
  }
  const spriteUrl = `${PLYR_VERSION_FALLBACK}/plyr.svg`;
  return fetch(spriteUrl)
    .then((r) => r.text())
    .then((svg) => {
      if (frameDoc.getElementById("sprite-plyr")) return; // race guard
      const container = frameDoc.createElement("div");
      container.setAttribute("hidden", "");
      container.setAttribute("id", "sprite-plyr");
      // Drop the XML prolog/doctype — an HTML parser has no use for them.
      const start = svg.indexOf("<svg");
      container.innerHTML = start > -1 ? svg.slice(start) : svg;
      frameDoc.body.insertAdjacentElement("afterbegin", container);
    })
    .catch(() => {
      /* no sprite: Plyr still works, the icons just fall back */
    });
};

/**
 * @param {Object} props
 * @param {"youtube"|"vimeo"} props.provider
 * @param {string}  props.embedId      Provider video id.
 * @param {Object}  props.config       Plyr options (this block's plyrConfig()).
 * @param {string}  [props.fallbackSrc] Provider embed URL for the no-Plyr fallback.
 * @param {string}  [props.accentColor] Becomes `--plyr-color-main` inside the frame.
 * @param {string}  [props.title]
 * @param {string}  [props.rebuildKey] Change it to rebuild the document + player.
 * @param {boolean} [props.isSelected] Whether the owning block is selected in Gutenberg.
 * @param {Function} [props.onSelect]   Callback when the embed is clicked.
 * @param {Function} [props.onPlayerReady] Called once with the Plyr player when the provider embed is ready (captions setup).
 */
const CanvasEmbedFrame = ({
  provider,
  embedId,
  config,
  fallbackSrc = "",
  accentColor = "",
  title = "Video",
  rebuildKey = "",
  isSelected = true,
  onSelect,
  nativeSrc = "",
  poster = "",
  onPlayerReady,
}) => {
  const frameRef = useRef(null);
  const playerRef = useRef(null);
  const onPlayerReadyRef = useRef(onPlayerReady);
  onPlayerReadyRef.current = onPlayerReady;
  // Latest config, read by the build effect without being one of its deps —
  // `rebuildKey` is what decides when a rebuild is actually warranted.
  const configRef = useRef(config);
  configRef.current = config;

  // Live playback properties without recreating player: Start Muted, Loop,
  // Auto-Hide Controls and Reset On End apply the moment they are switched.
  useEffect(() => {
    applyLivePlayback(playerRef.current, {
      muted: config?.muted,
      repeat: config?.loop?.active,
      autoHideControl: config?.hideControls,
      resetOnEnd: config?.resetOnEnd,
    });
  }, [config?.muted, config?.loop?.active, config?.hideControls, config?.resetOnEnd]);

  // Live autoplay toggle
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    try {
      if (config?.autoplay) {
        player.play()?.catch?.(() => {});
      } else {
        player.pause();
      }
    } catch (e) {
      /* ignore */
    }
  }, [config?.autoplay]);

  useEffect(() => {
    const iframe = frameRef.current;
    if (!iframe || !embedId) return undefined;

    let frameDoc;
    try {
      frameDoc = iframe.contentDocument;
    } catch (e) {
      frameDoc = null;
    }
    if (!frameDoc) return undefined;

    // "Use YouTube's / Vimeo's own player": the provider's player as is, no
    // Plyr. Written into this same about:blank frame so it still gets a real
    // referrer (YouTube refuses referrer-less embeds).
    if (nativeSrc) {
      frameDoc.open();
      frameDoc.write(
        "<!DOCTYPE html><html><head><meta charset='utf-8'>" +
          "<style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#000;}" +
          "iframe{position:absolute;inset:0;width:100%;height:100%;border:0;}</style></head><body>" +
          `<iframe src="${escapeHtmlAttr(
            nativeSrc,
          )}" allow="${EMBED_ALLOW}; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>` +
          "</body></html>",
      );
      frameDoc.close();
      return undefined;
    }

    let cancelled = false;
    let timer = 0;

    const css = [
      "html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#000;box-sizing:border-box;}",
      // The written document has no theme font, so captions fell back to serif.
      "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}",
      "*,*:before,*:after{box-sizing:border-box;}",
      ".wp-block-vpb-video{width:100%;height:100%;position:relative;overflow:visible!important;}",
      ".vpbVideoPlayer{container-type:inline-size;width:100%;height:100%;position:relative;overflow:hidden;margin:0 auto;max-width:100%;}",
      ".vpbVideoPlayer .videoWrapper{width:100%;height:100%;position:relative;overflow:visible!important;}",
      `#vpb-stage{position:relative;width:100%;height:100%;overflow:hidden;${
        accentColor ? `--plyr-color-main:${accentColor};` : ""
      }}`,
      "#vpb-stage .plyr,#vpb-stage .plyr__video-wrapper,#vpb-stage .plyr__video-embed,#vpb-stage .plyr__video-embed__container{position:absolute;inset:0;width:100%!important;min-width:0!important;height:100%!important;padding:0!important;transform:none!important;}",
      "#vpb-stage iframe{border:0;position:absolute;inset:0;width:100%;height:100%;}",
      ".plyr.plyr--vimeo iframe,#vpb-stage .plyr--vimeo iframe{pointer-events:none!important;}",
      ".plyr{overflow:visible!important;position:relative!important;z-index:20!important;pointer-events:all!important;}",
      ".plyr .plyr__poster{background-size:cover!important;background-position:center!important;}",
      ".plyr .plyr__controls{position:absolute!important;bottom:0!important;left:0!important;right:0!important;z-index:10!important;pointer-events:all!important;}",
      ".plyr .plyr__control--overlaid{z-index:3!important;pointer-events:all!important;}",
      ".plyr.plyr--menu-open .plyr__control--overlaid{opacity:0!important;visibility:hidden!important;pointer-events:none!important;}",
      ".plyr:not(.plyr--captions-active) .plyr__captions,.plyr:not(.plyr--captions-active) .plyr__caption{display:none!important;visibility:hidden!important;opacity:0!important;}",
      ".plyr .plyr__menu__container{z-index:20!important;padding:clamp(2px,0.5vw,5px) clamp(3px,0.8vw,7px)!important;background:rgba(28,28,30,0.85)!important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);border-radius:8px!important;box-shadow:0 8px 24px rgba(0,0,0,0.5)!important;color:#ffffff!important;}",
      ".plyr .plyr__menu__container>div{overflow:visible!important;background:transparent!important;}",
      ".plyr .plyr__menu__container [role='menu']{padding:0!important;background:transparent!important;border:none!important;}",
      ".plyr .plyr__menu__container [role='menuitemradio'],.plyr .plyr__menu__container [role='menuitem']{padding:clamp(2px,0.4vw,4px) clamp(16px,4vw,24px) clamp(2px,0.4vw,4px) clamp(5px,1vw,8px)!important;font-size:clamp(11px,2.5vw,13px)!important;color:#eeeeee!important;border-radius:4px!important;transition:all 0.2s ease;background:transparent!important;}",
      ".plyr .plyr__menu__container [role='menuitemradio']:hover,.plyr .plyr__menu__container [role='menuitemradio'][aria-checked='true'],.plyr .plyr__menu__container [role='menuitem']:hover,.plyr .plyr__menu__container [role='menuitem'][aria-checked='true']{background:rgba(255,255,255,0.15)!important;color:#ffffff!important;}",
      ".plyr .plyr__menu__container .plyr__menu__value{font-size:clamp(9px,2vw,11px)!important;margin-left:auto!important;padding-right:5px;color:rgba(255,255,255,0.7)!important;}",
      ".plyr .plyr__volume{position:relative;width:auto!important;min-width:0!important;max-width:none!important;}",
      ".plyr .plyr__volume input[type='range']{position:absolute!important;bottom:calc(100% - 18px);left:50%;transform:rotate(-90deg);transform-origin:left center;width:100px!important;height:36px!important;background-color:rgba(0,0,0,0.7)!important;border-radius:6px;padding:0 8px!important;margin:0!important;opacity:0;pointer-events:none;transition:opacity 0.2s ease;writing-mode:horizontal-tb;direction:ltr;}",
      ".plyr .plyr__volume:hover input[type='range']{opacity:1;pointer-events:all;}",
      "@container (max-width: 480px){" +
        ".plyr .plyr__controls{padding:6px 8px!important;display:flex!important;flex-wrap:wrap;align-items:center;justify-content:space-between!important;row-gap:4px;column-gap:3px;width:100%!important;}" +
        ".plyr .plyr__controls>*{margin:0!important;flex-shrink:0;}" +
        ".plyr .plyr__controls .plyr__control{padding:4px 5px!important;}" +
        ".plyr .plyr__controls .plyr__control svg{width:14px;height:14px;}" +
        ".plyr .plyr__controls .plyr__progress__container{flex:1 1 100%!important;order:-1;margin:0 0 2px!important;width:100%!important;}" +
        ".plyr .plyr__controls .plyr__menu__container{padding:4px;overflow:hidden!important;max-height:calc(56cqw - 52px)!important;}" +
        ".plyr .plyr__controls .plyr__menu__container [role='menu']{max-height:calc(56cqw - 112px)!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:rgba(0,0,0,0.3) transparent;}" +
        ".plyr .plyr__controls .plyr__menu__container [role='menu']::-webkit-scrollbar{width:4px;}" +
        ".plyr .plyr__controls .plyr__menu__container [role='menu']::-webkit-scrollbar-track{background:transparent;}" +
        ".plyr .plyr__controls .plyr__menu__container [role='menu']::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.25);border-radius:4px;}" +
        ".plyr .plyr__controls .plyr__menu__container [role='menu']::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.4);}" +
        ".plyr .plyr__controls .plyr__menu__container .plyr__control{font-size:12px;padding:4px 24px 4px 8px!important;}" +
        ".plyr .plyr__controls .plyr__menu__container .plyr__control::after{transform:translateY(-50%) scale(0.8)!important;right:8px!important;}" +
        ".plyr .plyr__controls .plyr__menu__container .plyr__menu__value{font-size:10px;}" +
        ".plyr .plyr__time{font-size:11px!important;padding:0 4px!important;display:inline-block!important;color:#fff!important;}" +
        ".plyr .plyr__time+.plyr__time{display:inline-block!important;padding-left:0!important;}" +
        "}",
      "@container (max-width: 360px){" +
        ".plyr .plyr__controls{padding:4px 4px!important;row-gap:3px!important;column-gap:2px!important;}" +
        ".plyr .plyr__controls .plyr__control{padding:3px 4px!important;}" +
        ".plyr .plyr__controls .plyr__control svg{width:13px!important;height:13px!important;}" +
        ".plyr .plyr__time{font-size:10px!important;padding:0 2px!important;}" +
        "}",
      "@media (max-width: 480px){" +
        ".plyr .plyr__controls{padding:6px 8px!important;display:flex!important;flex-wrap:wrap;align-items:center;justify-content:space-between!important;row-gap:4px;column-gap:3px;width:100%!important;}" +
        ".plyr .plyr__controls>*{margin:0!important;flex-shrink:0;}" +
        ".plyr .plyr__controls .plyr__control{padding:4px 5px!important;}" +
        ".plyr .plyr__controls .plyr__control svg{width:14px;height:14px;}" +
        ".plyr .plyr__controls .plyr__progress__container{flex:1 1 100%!important;order:-1;margin:0 0 2px!important;width:100%!important;}" +
        ".plyr .plyr__controls .plyr__menu__container{padding:4px;overflow:hidden!important;max-height:calc(56vw - 52px)!important;}" +
        ".plyr .plyr__controls .plyr__menu__container [role='menu']{max-height:calc(56vw - 112px)!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:rgba(0,0,0,0.3) transparent;}" +
        ".plyr .plyr__controls .plyr__menu__container [role='menu']::-webkit-scrollbar{width:4px;}" +
        ".plyr .plyr__controls .plyr__menu__container [role='menu']::-webkit-scrollbar-track{background:transparent;}" +
        ".plyr .plyr__controls .plyr__menu__container [role='menu']::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.25);border-radius:4px;}" +
        ".plyr .plyr__controls .plyr__menu__container [role='menu']::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.4);}" +
        ".plyr .plyr__controls .plyr__menu__container .plyr__control{font-size:12px;padding:4px 24px 4px 8px!important;}" +
        ".plyr .plyr__controls .plyr__menu__container .plyr__control::after{transform:translateY(-50%) scale(0.8)!important;right:8px!important;}" +
        ".plyr .plyr__controls .plyr__menu__container .plyr__menu__value{font-size:10px;}" +
        ".plyr .plyr__time{font-size:11px!important;padding:0 4px!important;display:inline-block!important;color:#fff!important;}" +
        ".plyr .plyr__time+.plyr__time{display:inline-block!important;padding-left:0!important;}" +
        "}",
      "@media (max-width: 360px){" +
        ".plyr .plyr__controls{padding:4px 4px!important;row-gap:3px!important;column-gap:2px!important;}" +
        ".plyr .plyr__controls .plyr__control{padding:3px 4px!important;}" +
        ".plyr .plyr__controls .plyr__control svg{width:13px!important;height:13px!important;}" +
        ".plyr .plyr__time{font-size:10px!important;padding:0 2px!important;}" +
        "}",
    ].join("");

    let stage = frameDoc.getElementById("vpb-stage");
    const isDocReady = Boolean(stage && iframe.contentWindow?.Plyr);

    if (!isDocReady) {
      const viewCssUrl = getViewCssUrl();
      frameDoc.open();
      frameDoc.write(
        "<!DOCTYPE html><html><head><meta charset='utf-8'>" +
          `<link rel="stylesheet" href="${getPlyrCssUrl()}">` +
          (viewCssUrl ? `<link rel="stylesheet" href="${viewCssUrl}">` : "") +
          `<style>${css}</style></head><body>` +
          `<div id="sprite-plyr" hidden style="display:none">${PLYR_SPRITE}</div>` +
          `<div class="wp-block-vpb-video" style="width:100%;height:100%;position:relative;overflow:visible!important;"><div class="vpbVideoPlayer" style="width:100%;height:100%;container-type:inline-size;position:relative;overflow:hidden;"><div class="videoWrapper" style="width:100%;height:100%;position:relative;"><div id="vpb-stage" style="position:relative;width:100%;height:100%;overflow:hidden;${
            accentColor ? `--plyr-color-main:${accentColor};` : ""
          }"><div id="vpb-target" data-plyr-provider="${escapeHtmlAttr(
            provider,
          )}" data-plyr-embed-id="${escapeHtmlAttr(
            embedId,
          )}"></div></div></div></div></div>` +
          `<script src="${getPlyrScriptUrl()}"></script>` +
          "</body></html>",
      );
      frameDoc.close();
      stage = frameDoc.getElementById("vpb-stage");
    }

    const handleFrameMouseDown = () => {
      if (!isSelected) {
        onSelect?.();
      }
    };
    frameDoc.removeEventListener("mousedown", handleFrameMouseDown, true);
    frameDoc.addEventListener("mousedown", handleFrameMouseDown, true);

    const start = () => {
      if (cancelled) return;
      const frameWin = iframe.contentWindow;
      const PlyrCtor = frameWin?.Plyr;
      if (!PlyrCtor || !stage) return;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          /* ignore */
        }
        playerRef.current = null;
      }

      // Custom poster (Settings > Poster / Thumbnail url), same as the front end.
      const posterAttr = poster
        ? ` data-poster="${escapeHtmlAttr(poster)}"`
        : "";
      stage.innerHTML = `<div id="vpb-target" data-plyr-provider="${escapeHtmlAttr(
        provider,
      )}" data-plyr-embed-id="${escapeHtmlAttr(embedId)}"${posterAttr}></div>`;
      const target = frameDoc.getElementById("vpb-target");
      if (!target) return;

      // Re-materialise the config inside the FRAME's realm.
      const RealmJSON = frameWin.JSON || JSON;
      let frameConfig;
      try {
        frameConfig = RealmJSON.parse(
          RealmJSON.stringify({
            ...configRef.current,
            loadSprite: false, // injectSprite handled it
            storage: { enabled: false },
          }),
        );
      } catch (e) {
        frameConfig = undefined;
      }

      try {
        const player = new PlyrCtor(target, frameConfig);
        playerRef.current = player;

        // Reset On End (Plyr only does it for self-hosted video). Reads the
        // latest settings, so switching it on/off works without a rebuild.
        player.on("ended", () => {
          const latest = configRef.current;
          if (latest?.resetOnEnd && !latest?.loop?.active) {
            try {
              player.stop();
            } catch (e) {
              /* ignore */
            }
          }
        });

        // Set up captions/quality once the provider embed exists. The frame
        // loads the first plyr.js on the page, which can be another plugin's
        // stock build, and there Plyr's "ready" never reached us for Vimeo: the
        // caption handler was never set up, so Disabled in the menu did nothing
        // and Vimeo drew a second copy of every caption. So also try on
        // "playing" and by polling, whichever comes first.
        let attached = false;
        const attach = () => {
          if (attached || cancelled || playerRef.current !== player) return;
          const embed = player.embed;
          const embedReady =
            provider === "vimeo"
              ? typeof embed?.getTextTracks === "function"
              : Boolean(embed);
          if (!embedReady || !player.elements?.container) return;
          attached = true;
          try {
            onPlayerReadyRef.current?.(player);
          } catch (e) {
            /* captions are optional */
          }
          if (configRef.current?.autoplay) {
            player.play()?.catch?.(() => {});
          }
        };
        let polls = 0;
        const poll = () => {
          if (
            attached ||
            cancelled ||
            playerRef.current !== player ||
            polls++ > 80
          )
            return;
          attach();
          if (!attached) setTimeout(poll, 250);
        };

        player.on("ready", attach);
        poll();
        player.on("playing", attach);
      } catch (e) {
        // Fallback
      }
    };

    if (isDocReady) {
      start();
    } else {
      // After 5s without Plyr, show the provider's own iframe so the editor is
      // not empty, but keep waiting: when plyr.js does arrive (a slow site can
      // take longer), start() replaces the fallback with the real Plyr player.
      // It used to give up for good, so the preview stayed on the plain embed.
      let waited = 0;
      let fellBack = false;
      const tick = () => {
        if (cancelled) return;
        if (iframe.contentWindow?.Plyr) {
          injectSprite(frameDoc).finally(start);
          return;
        }
        waited += 100;
        if (waited > 5000 && !fellBack) {
          fellBack = true;
          if (stage && fallbackSrc) {
            stage.innerHTML = `<iframe src="${escapeHtmlAttr(
              fallbackSrc,
            )}" allow="${EMBED_ALLOW}" allowfullscreen></iframe>`;
          }
        }
        if (waited > 60000) return;
        timer = window.setTimeout(tick, fellBack ? 500 : 100);
      };
      tick();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      try {
        frameDoc?.removeEventListener("mousedown", handleFrameMouseDown, true);
      } catch (e) {
        /* ignore */
      }
      try {
        playerRef.current?.destroy();
      } catch (e) {
        /* the frame may already be gone */
      }
      playerRef.current = null;
    };
  }, [
    provider,
    embedId,
    accentColor,
    fallbackSrc,
    rebuildKey,
    nativeSrc,
    poster,
  ]);

  return (
    <iframe
      ref={frameRef}
      title={title}
      className="vpb-canvas-embed"
      // No `src`: that is what makes it about:blank on the admin origin. With
      // allow-same-origin the written document keeps that origin, which is what
      // gives the provider a usable referrer and lets us reach Plyr inside.
      sandbox={FRAME_SANDBOX}
      allow={EMBED_ALLOW}
      allowFullScreen
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        border: 0,
        display: "block",
        pointerEvents: isSelected ? "auto" : "none",
      }}
    />
  );
};

export default CanvasEmbedFrame;
