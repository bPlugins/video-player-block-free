import { __ } from "@wordpress/i18n";
import { useState,useEffect,useRef } from "react";
import { withSelect, useDispatch } from "@wordpress/data";
import { useBlockProps } from "@wordpress/block-editor";
import { MediaPlaceholder } from "../../../../../../bpl-tools/Components";
import Settings from "./Settings/Settings";
import Style from "../Common/Style";
import {
  getExtension,
  isYoutube,
  isVimeo,
  getYoutubeId,
  getVimeoId,
  controlsHandler,
} from "../../utils/functions";
import { plyrConfig } from "../../utils/config";
import { cameraIcon } from "../../utils/icons";
import { prefix } from "../../utils/data";
import { FrontShortCode } from "../../../../Components/Common/FrontShortCode/FrontShortCode";

/**
 * Renders a Plyr-driven YouTube/Vimeo player via a React portal into the
 * parent (admin) window. The apiVersion 3 editor canvas runs in a blob:/srcdoc
 * iframe whose "null" origin causes YouTube Error 153 and breaks Plyr's
 * postMessage handshake. By portaling to the parent window we get a real HTTP
 * origin — Plyr initialises normally and its custom controls render correctly.
 */
// Ensure the Plyr SVG sprite is present in the parent document.
// Plyr's built-in loadSprite fetches from a CDN that may be blocked;
// we load it ourselves so the control icons render correctly.
const ensureSprite = (topDoc, PlyrConstructor) => {
  if (topDoc.getElementById("sprite-plyr")) return Promise.resolve();

  const spriteUrl = "https://cdn.plyr.io/3.7.8/plyr.svg";
  return fetch(spriteUrl)
    .then((r) => r.text())
    .then((svg) => {
      if (topDoc.getElementById("sprite-plyr")) return; // race guard
      const container = topDoc.createElement("div");
      container.setAttribute("hidden", "");
      container.setAttribute("id", "sprite-plyr");
      container.innerHTML = svg;
      topDoc.body.insertAdjacentElement("afterbegin", container);
    })
    .catch(() => {
      // Fallback: use Plyr's static helper (may also fail, but worth trying)
      if (PlyrConstructor?.loadSprite) {
        PlyrConstructor.loadSprite(spriteUrl, "sprite-plyr");
      }
    });
};

const EmbedPortal = ({ source, placeholderRef, attributes, onSelect }) => {
  const [rect, setRect] = useState(null);
  const overlayRoot = useRef(null);
  const portalRoot = useRef(null);
  const playerRef = useRef(null);
  const playerElRef = useRef(null);
  // Keep the latest onSelect without re-binding the listener every render.
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Create a container div in the TOP-LEVEL window's body to bypass iframe security.
  useEffect(() => {
    const topDoc = window.top?.document || window.document;

    // Outer overlay carries the `.wp-block-vpb-video` wrapper class so the
    // block's scoped CSS — including the responsive `@container` rules — matches
    // here, exactly as it does on the frontend. Without this wrapper the portal
    // sits bare on <body> and the mobile control layout never kicks in.
    const overlay = topDoc.createElement("div");
    overlay.className = "wp-block-vpb-video vpbp-portal-overlay";
    // z-index must stay BELOW WordPress modal layers (`.media-modal` is
    // 160000, Gutenberg `.components-modal__screen-overlay` is 100000) so an
    // open Media Library / modal naturally covers the embed instead of the
    // playing video painting over it. 10000 still sits above the canvas iframe
    // content; the clip-to-canvas logic below keeps it off the editor chrome.
    overlay.style.cssText = "position:fixed;z-index:10000;pointer-events:auto;";

    // This overlay lives in the TOP window, layered over the iframe canvas, so
    // clicks on it never reach Gutenberg's block-selection handling — the block
    // would stay unselected and its Inspector (controls panel) would never open.
    // Explicitly select the block on mousedown instead. `clickToPlay` is off, so
    // this won't trigger playback; Plyr's own control handlers still fire because
    // we neither stop propagation nor prevent default.
    const selectHandler = () => onSelectRef.current?.();
    overlay.addEventListener("mousedown", selectHandler, true);

    // Inner element is the actual Plyr host AND the size container that the
    // `@container (max-width: …)` queries measure against.
    const inner = topDoc.createElement("div");
    inner.className = "vpbpVideoPlayer";
    inner.style.cssText = "width:100%;height:100%;";
    overlay.appendChild(inner);

    topDoc.body.appendChild(overlay);
    overlayRoot.current = overlay;
    portalRoot.current = inner;

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (_) {
          /* ignore */
        }
        playerRef.current = null;
      }
      overlay.removeEventListener("mousedown", selectHandler, true);
      overlay.remove();
      overlayRoot.current = null;
      portalRoot.current = null;
    };
  }, []);

  // Round the embed in the portal. The block's per-instance Style.js radius rule
  // is scoped to `#blockId …`, but the portal lives in the top window OUTSIDE
  // that block wrapper, so that rule never matches here. Mirror it with a
  // top-window <style> targeting the portal's container (which already has
  // overflow:hidden via the synced block CSS) so it's clipped to one clean
  // rounded shape — rounding only the inner frame leaves the black player
  // background poking out of the square corners.
  useEffect(() => {
    const topDoc = window.top?.document || window.document;
    const styleId = "vpbp-portal-radius";
    let styleEl = topDoc.getElementById(styleId);
    if (!styleEl) {
      styleEl = topDoc.createElement("style");
      styleEl.id = styleId;
      topDoc.head.appendChild(styleEl);
    }
    const r = attributes?.radius || "0px";
    styleEl.innerHTML = `.vpbp-portal-overlay .vpbpVideoPlayer{border-radius:${r} !important;overflow:hidden !important;}`;

    return () => {
      const el = topDoc.getElementById(styleId);
      if (el) el.remove();
    };
  }, [attributes?.radius]);

  // Initialise Plyr on the portal element once it's mounted.
  useEffect(() => {
    if (!portalRoot.current || !attributes) return;

    const topWin = window.top || window;
    const topDoc = topWin.document || document;
    const PlyrConstructor =
      topWin.Plyr || (typeof Plyr !== "undefined" ? Plyr : null);
    if (!PlyrConstructor) return;

    // Build the provider div that Plyr expects.
    const provider = isYoutube(source) ? "youtube" : "vimeo";
    const embedId = isYoutube(source)
      ? getYoutubeId(source)
      : getVimeoId(source);

    // Create a wrapper to contain the Plyr player.
    const wrapper = topDoc.createElement("div");
    wrapper.className = "videoWrapper";
    wrapper.style.cssText = "width:100%;height:100%;";
    wrapper.innerHTML = `<div data-plyr-provider="${provider}" data-plyr-embed-id="${embedId}"></div>`;
    portalRoot.current.appendChild(wrapper);
    playerElRef.current = wrapper;

    ensureSprite(topDoc, PlyrConstructor).finally(() => {
      const config = {
        ...plyrConfig(attributes),
        loadSprite: false, // We handled it above
        iconUrl: "https://cdn.plyr.io/3.7.8/plyr.svg",
      };
      playerRef.current = new PlyrConstructor(
        wrapper.querySelector("[data-plyr-provider]"),
        config,
      );
    });

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (_) {
          /* ignore */
        }
        playerRef.current = null;
      }
      if (playerElRef.current) {
        playerElRef.current.remove();
        playerElRef.current = null;
      }
    };
  }, [source, attributes]);

  // Track the placeholder element's position so the portal overlay stays
  // aligned even as the user scrolls the editor canvas.
  useEffect(() => {
    if (!placeholderRef.current) return;

    const update = () => {
      const el = placeholderRef.current;
      if (!el) return;

      // Walk up through iframe boundaries to get the correct viewport-relative
      // rect in the top-level window.
      const local = el.getBoundingClientRect();

      // Visibility test: the embed lives in the top window above the whole
      // canvas, so when the placeholder is scrolled out of the canvas viewport
      // we must hide the overlay, otherwise the playing video paints over the
      // editor chrome. We use a pure rect/viewport check (NOT elementFromPoint
      // hit-testing) — the transient overlays Gutenberg paints at block
      // boundaries while editing would otherwise make this flip on/off every
      // frame, which is what made the player blink.
      const ownerDoc = el.ownerDocument;
      let visible = local.width > 0 && local.height > 0;
      if (visible) {
        const vw = ownerDoc.documentElement.clientWidth;
        const vh = ownerDoc.documentElement.clientHeight;
        // Hidden only once it's fully outside the canvas viewport (allow it to
        // straddle an edge — the clipPath below trims the off-canvas part).
        if (
          local.bottom <= 0 ||
          local.right <= 0 ||
          local.top >= vh ||
          local.left >= vw
        ) {
          visible = false;
        }
      }

      let box = {
        top: local.top,
        left: local.left,
        width: local.width,
        height: local.height,
      };
      let win = el.ownerDocument.defaultView;
      let clip = null;
      const topDoc = window.top?.document || window.document;

      // Sync block CSS from the editor iframe to the top-level window so our
      // portal player receives the responsive media queries and custom UI.
      if (
        el.ownerDocument !== topDoc &&
        !topDoc.querySelector("#vpbp-portal-styles")
      ) {
        const styles = Array.from(el.ownerDocument.querySelectorAll("style"));
        styles.forEach((style) => {
          if (style.innerHTML.includes(".vpbpVideoPlayer")) {
            const clone = topDoc.createElement("style");
            clone.id = "vpbp-portal-styles";
            clone.innerHTML = style.innerHTML;
            topDoc.head.appendChild(clone);
          }
        });
      }

      // The responsive `@container` rules live in the block's compiled
      // stylesheet (view.css), loaded as a <link> in the editor iframe but NOT
      // in the top document where this portal renders. Clone that link across so
      // the portal player's controls adapt on small screens (mobile preview).
      if (
        el.ownerDocument !== topDoc &&
        !topDoc.querySelector("#vpbp-portal-css")
      ) {
        const links = Array.from(
          el.ownerDocument.querySelectorAll('link[rel="stylesheet"]'),
        ).filter(
          (l) =>
            l.href &&
            l.href.includes("video-player-block") &&
            l.href.includes("view.css"),
        );
        links.forEach((l, i) => {
          const clone = topDoc.createElement("link");
          if (i === 0) clone.id = "vpbp-portal-css";
          clone.rel = "stylesheet";
          clone.href = l.href;
          topDoc.head.appendChild(clone);
        });
      }

      while (win && win !== window.top) {
        const frameEl = win.frameElement;
        if (!frameEl) break;
        const frameBox = frameEl.getBoundingClientRect();
        box = {
          top: box.top + frameBox.top,
          left: box.left + frameBox.left,
          width: box.width,
          height: box.height,
        };
        // Outermost frame (the editor canvas) is in top-window coordinates —
        // its rect is the visible bounds the overlay must stay clipped within
        // so it never overflows the editor header/sidebar.
        clip = {
          top: frameBox.top,
          left: frameBox.left,
          right: frameBox.right,
          bottom: frameBox.bottom,
        };
        win = frameEl.ownerDocument.defaultView;
      }

      const sameClip = (a, b) =>
        (!a && !b) ||
        (a &&
          b &&
          a.top === b.top &&
          a.left === b.left &&
          a.right === b.right &&
          a.bottom === b.bottom);

      setRect((prev) => {
        if (
          prev &&
          prev.top === box.top &&
          prev.left === box.left &&
          prev.width === box.width &&
          prev.height === box.height &&
          prev.visible === visible &&
          sameClip(prev.clip, clip)
        )
          return prev;
        return { ...box, visible, clip };
      });
    };

    // Coalesce bursts of scroll/resize events into one update per frame so the
    // overlay tracks the placeholder smoothly instead of lagging behind (the
    // old 200ms poll made the top-window video visibly trail and briefly
    // overflow the canvas while scrolling).
    const topWin = window.top || window;
    const iframeWin = placeholderRef.current.ownerDocument.defaultView;

    let raf = 0;
    const schedule = () => {
      topWin.cancelAnimationFrame(raf);
      raf = topWin.requestAnimationFrame(update);
    };

    update();

    // Capture-phase scroll catches inner scroll containers (the canvas scrolls
    // an inner element, not the window) in both the iframe and top realms.
    iframeWin?.addEventListener("scroll", schedule, true);
    iframeWin?.addEventListener("resize", schedule);
    if (topWin !== iframeWin) {
      topWin.addEventListener("scroll", schedule, true);
      topWin.addEventListener("resize", schedule);
    }

    // Fallback poll (slower) for layout shifts that fire no event — e.g.
    // toggling the settings sidebar, which reflows the canvas width.
    const id = topWin.setInterval(update, 300);

    return () => {
      topWin.cancelAnimationFrame(raf);
      topWin.clearInterval(id);
      iframeWin?.removeEventListener("scroll", schedule, true);
      iframeWin?.removeEventListener("resize", schedule);
      if (topWin !== iframeWin) {
        topWin.removeEventListener("scroll", schedule, true);
        topWin.removeEventListener("resize", schedule);
      }
    };
  }, [placeholderRef]);

  // Keep the portal overlay positioned over the block placeholder, clipped to
  // the editor canvas so it can't overflow the editor header/sidebar, and
  // hidden entirely when the placeholder is scrolled out of / occluded in the
  // canvas (e.g. another block scrolled over it).
  useEffect(() => {
    if (!overlayRoot.current || !rect) return;
    const s = overlayRoot.current.style;
    s.display = rect.visible ? "block" : "none";
    s.top = `${rect.top}px`;
    s.left = `${rect.left}px`;
    s.width = `${rect.width}px`;
    s.height = `${rect.height}px`;

    const clip = rect.clip;
    if (clip) {
      const top = Math.max(0, clip.top - rect.top);
      const left = Math.max(0, clip.left - rect.left);
      const bottom = Math.max(0, rect.top + rect.height - clip.bottom);
      const right = Math.max(0, rect.left + rect.width - clip.right);
      s.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
    } else {
      s.clipPath = "none";
    }
  }, [rect]);

  return null; // The DOM lives in the portal container, not in React's tree.
};

const Edit = (props) => {
  const {
    attributes,
    setAttributes,
    clientId,
    isSelected,
    currentPostId,
    currentPostType,
  } = props;
  const { selectBlock } = useDispatch("core/block-editor");
  const {
    source,
    poster,
    controls,
    captions,
    repeat,
    autoplay,
    muted,
    resetOnEnd,
    autoHideControl,
    ratio,
  } = attributes;

  const autoplayProps = autoplay ? { autoplay: true } : {};
  const mutedProps = muted ? { muted: true } : {};
  // Native <video controls> acts as the editor fallback: shown when any control
  // is enabled, it stays visible if Plyr fails to take over. When Plyr does
  // init (below) it replaces these with its own styled control bar.
  const hasControls = controlsHandler(controls).length > 0;
  // Editor: YouTube/Vimeo show a poster; clicking loads the embed via a portal
  // into the parent admin window (bypassing the null-origin canvas restriction).
  const [showEmbed, setShowEmbed] = useState(false);
  const embedPlaceholderRef = useRef(null);

  // The live YouTube/Vimeo embed renders in a top-window overlay (z-index above
  // the canvas). Keeping it mounted while the block is deselected makes it sit
  // on top of whatever block you select next — its toolbar/controls then render
  // *behind* the video. So tear the embed down on deselect: the static poster
  // (in the canvas) takes over, and re-selecting + clicking replays it.
  useEffect(() => {
    if (!isSelected) setShowEmbed(false);
  }, [isSelected]);

  /**
   * Self-hosted (HTML5) editor preview: drive Plyr on a native <video> inside
   * the iframe canvas so the editor shows the real, styled Plyr control bar
   * that reflects the per-control toggles. Unlike YouTube/Vimeo (third-party
   * iframes blocked by the Studio sandbox), a native <video> is same-origin, so
   * Plyr initialises fine here — provided its SVG icon sprite is loaded, which
   * we let Plyr fetch from its CDN (loadSprite default) so the icons render.
   *
   * `playerKey` is used both as the React key on .videoWrapper and in the
   * effect deps, so any settings change tears the wrapper down to a brand-new,
   * empty node before we rebuild Plyr — avoiding stale DOM / async-destroy
   * races that otherwise leave the control bar showing the previous config.
   */
  const wrapperRef = useRef(null);
  const playerKey = JSON.stringify({
    source,
    poster,
    controls,
    captions,
    repeat,
    autoplay,
    muted,
    resetOnEnd,
    autoHideControl,
    ratio,
  });

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element || !source) return;
    // YouTube/Vimeo are handled by the click-to-play portal façade, not here.
    if (isYoutube(source) || isVimeo(source)) return;

    const videoWrapper = element.querySelector(".videoWrapper");
    const videoTemplate = element.querySelector(".videoTemplate .media-source");
    if (!videoWrapper || !videoTemplate) return;

    // Always render the native <video> first (its `controls` attr already
    // reflects hasControls), so the preview is visible immediately and still
    // works if Plyr can't load. When all controls are off, we stop here and the
    // bare <video> shows no bar.
    videoWrapper.innerHTML = videoTemplate.outerHTML;
    if (!hasControls) return;

    let player = null;
    let destroyed = false;
    let initTimeout = null;
    let tries = 0;
    const maxTries = 100;
    const iframeWindow = element.ownerDocument.defaultView;

    const initPlayer = () => {
      if (destroyed) return;

      const isIframed = iframeWindow && iframeWindow !== window;
      const PlyrConstructor = isIframed
        ? iframeWindow.Plyr
        : typeof Plyr !== "undefined"
        ? Plyr
        : null;

      if (!PlyrConstructor) {
        tries++;
        if (tries < maxTries) initTimeout = setTimeout(initPlayer, 50);
        return;
      }

      // Let Plyr load its own icon sprite from the CDN into the iframe document
      // (the previous iconUrl:"" left every control icon invisible).
      const rawConfig = {
        ...plyrConfig(attributes),
        hideControls: autoHideControl,
        storage: { enabled: false },
      };

      // apiVersion-3 fix: the editor canvas is a separate iframe realm. A config
      // (and its `controls` array) built in the parent window fails the iframe
      // Plyr's cross-realm type checks, so Plyr discards it and renders its
      // DEFAULT controls — which is why toggles appear to do nothing in v3 but
      // work in v2 (same realm). Re-materialise the config inside the iframe
      // realm so Plyr recognises and honours it.
      const RealmJSON =
        isIframed && iframeWindow.JSON ? iframeWindow.JSON : JSON;
      const config = RealmJSON.parse(RealmJSON.stringify(rawConfig));

      player = new PlyrConstructor(videoWrapper.children[0], config);

      player.on("ready", () => {
        player.muted = muted;
        player.loop = repeat;
        if (autoplay) {
          player.play().catch(() => {});
        } else {
          player.pause();
        }
      });
    };

    initPlayer();

    return () => {
      destroyed = true;
      if (initTimeout) clearTimeout(initTimeout);
      if (player) {
        try {
          player.destroy();
        } catch (e) {
          /* ignore */
        }
      }
    };
    // playerKey already encodes every attribute the effect reads.
  }, [playerKey, hasControls]);

  const id = `${prefix}-${clientId}`;
  const blockProps = useBlockProps();
  const isPlayerPostType = ["video-player-block"].includes(currentPostType);

  // Poster for the YouTube/Vimeo editor façade: explicit poster wins, then the
  // YouTube thumbnail CDN (Vimeo has no static thumbnail URL, falls back to black).
  const editorPoster =
    poster ||
    (isYoutube(source)
      ? `https://i.ytimg.com/vi/${getYoutubeId(source)}/hqdefault.jpg`
      : "");

  // useEffect(() => {
  //   if (
  //     typeof vpbpPipecheck !== "undefined" &&
  //     !vpbpPipecheck &&
  //     isPlayerPostType &&
  //     !isSetup
  //   ) {
  //     setAttributes({ isSetup: true });
  //   }
  // }, [vpbpPipecheck, isPlayerPostType, isSetup]);

  // if (isPlayerPostType && !isSetup) {
  //   return (
  //     <div>
  //       <FrontShortCode
  //         postType={currentPostType}
  //         shortCode={`[video_player id=${currentPostId}]`}
  //       />
  //     </div>
  //   );
  // }

  return (
    <>
      <Settings attributes={attributes} setAttributes={setAttributes} id={id} />
      <div {...blockProps} id={id}>
        <Style attributes={attributes} id={id} />

        {source ? (
          <>
            {isPlayerPostType && (
              <FrontShortCode
                postType={currentPostType}
                shortCode={`[video_player id=${currentPostId}]`}
              />
            )}

            <div className={prefix} ref={wrapperRef}>
              {isYoutube(source) || isVimeo(source) ? (
                <div className="videoWrapper">
                  {/* Portal-based embed overlay (rendered in the parent admin
                      window so YouTube/Vimeo get a real origin). */}
                  {showEmbed && isSelected && (
                    <EmbedPortal
                      source={source}
                      placeholderRef={embedPlaceholderRef}
                      attributes={attributes}
                      onSelect={() => selectBlock(clientId)}
                    />
                  )}

                  <div
                    ref={embedPlaceholderRef}
                    role="button"
                    tabIndex={0}
                    onMouseDown={() => selectBlock(clientId)}
                    onClick={() => setShowEmbed(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setShowEmbed(true);
                    }}
                    aria-label="Play video preview"
                    style={{
                      position: "relative",
                      display: "block",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      border: 0,
                      padding: 0,
                      cursor: showEmbed ? "default" : "pointer",
                      background: editorPoster
                        ? `#000 center / cover no-repeat url(${editorPoster})`
                        : "#000",
                    }}>
                    {!showEmbed && (
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        <span
                          style={{
                            width: "68px",
                            height: "48px",
                            borderRadius: "12px",
                            background: "rgba(0,0,0,0.65)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          <span
                            style={{
                              width: 0,
                              height: 0,
                              borderTop: "10px solid transparent",
                              borderBottom: "10px solid transparent",
                              borderLeft: "16px solid #fff",
                              marginLeft: "4px",
                            }}
                          />
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* HTML5/self-hosted: a hidden <video> template is copied into
                   the React-empty .videoWrapper, where the effect above drives
                   Plyr (styled control bar reflecting the Controls toggles).
                   The template keeps native `controls` as a fallback in case
                   Plyr can't init in the canvas. */
                <>
                  <div className="videoWrapper" key={playerKey} />
                  <div className="videoTemplate" style={{ display: "none" }}>
                    {/* eslint-disable-next-line react/no-unknown-property */}
                    <video
                      className="media-source"
                      playsInline
                      {...(captions?.length
                        ? { crossOrigin: "anonymous" }
                        : {})}
                      controls={hasControls}
                      loop={repeat}
                      poster={poster}
                      preload="metadata"
                      style={{ width: "100%", display: "block" }}
                      {...autoplayProps}
                      {...mutedProps}>
                      Your browser does not support the video tag.
                      <source
                        src={source}
                        type={`video/${getExtension(source) || "mp4"}`}
                      />
                      {captions?.map((cap, index) =>
                        cap.src ? (
                          <track
                            key={index}
                            kind="captions"
                            src={cap.src}
                            label={cap.label}
                            srcLang={cap.srclang}
                            default={!!cap.default}
                          />
                        ) : null,
                      )}
                    </video>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <MediaPlaceholder
            type="video"
            placeholder={__("Upload or paste a video URL to get started", "video-player-block")}
            onChange={(val) => setAttributes({ source: val.url })}
            icon={cameraIcon}
          />
        )}
      </div>
    </>
  );
};

export default withSelect((select) => {
  const { getCurrentPostId, getCurrentPostType } = select("core/editor");
  return {
    currentPostId:
      getCurrentPostId() || select("core").getEditedPostAttribute("id"),
    currentPostType:
      getCurrentPostType() || select("core").getEditedPostAttribute("type"),
  };
})(Edit);
