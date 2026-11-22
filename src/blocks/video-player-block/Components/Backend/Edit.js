import { __ } from "@wordpress/i18n";
import { useEffect, useRef } from "react";
import { withSelect } from "@wordpress/data";
import { useBlockProps } from "@wordpress/block-editor";
import { MediaPlaceholder } from "../../../../../../bpl-tools/Components/MediaControl/MediaControl";
import Settings from "./Settings/Settings";
import Style from "../Common/Style";
import { posterFitCss } from "../../utils/posterFit";
import {
  getExtension,
  isYoutube,
  isVimeo,
  getYoutubeId,
  getVimeoId,
  controlsHandler,
  hideNativeVimeoCaptions,
} from "../../utils/functions";
import { plyrConfig, applyLivePlayback } from "../../utils/config";
import {
  usesProviderPlayer,
  getProviderEmbedUrl,
  cssAspectRatio,
} from "../../utils/providerPlayer";
import CanvasEmbedFrame from "./CanvasEmbedFrame";
import { setupVimeoQuality } from "../../utils/vimeoQuality";
import { cameraIcon } from "../../utils/icons";
import { prefix } from "../../utils/data";
import { FrontShortCode } from "../../../../Components/Common/FrontShortCode/FrontShortCode";


/**
 * Plyr options for the editor's YouTube/Vimeo preview. The preview frame fills
 * the block edge to edge, which undoes Plyr's crop that hides Vimeo's own
 * buttons, so Vimeo is asked not to draw them (same options Pro sends).
 */
const editorEmbedConfig = (attributes) => {
  const config = plyrConfig(attributes);
  return {
    ...config,
    vimeo: {
      ...(config.vimeo || {}),
      byline: false,
      portrait: false,
      title: false,
      controls: false,
      sidedock: false,
      pip: false,
      dnt: true,
      premium: true,
    },
  };
};

/**
 * Captions for the YouTube/Vimeo editor preview (same rules as view.js): on in
 * the visitor's language when the setting is on, kept off when it is off, and
 * the editor user's own pick in the CC button / Captions menu always wins.
 */
const setupEditorCaptions = (player, attributes) => {
  const source = attributes?.source;
  let userTouched = false;
  player.elements?.container?.addEventListener(
    "click",
    (e) => {
      if (e.target?.closest?.('[data-plyr="captions"], [data-plyr="language"]')) userTouched = true;
    },
    true,
  );
  const pickTrack = (tracks) => {
    const nav = typeof navigator !== "undefined" ? navigator : {};
    const langs = (nav.languages && nav.languages.length ? nav.languages : [nav.language || ""])
      .map((l) => String(l).toLowerCase().split("-")[0])
      .filter(Boolean);
    for (const lang of langs) {
      const match = tracks.find((t) => String(t?.language || "").toLowerCase().split("-")[0] === lang);
      if (match) return match;
    }
    return tracks[0];
  };
  const apply = () => {
    if (userTouched) return;
    try {
      if (isYoutube(source)) {
        if (attributes.youtubeCaptions) {
          player.embed?.loadModule?.("captions");
        } else {
          player.embed?.unloadModule?.("captions");
          player.embed?.setOption?.("captions", "track", {});
        }
      } else if (isVimeo(source)) {
        if (attributes.vimeoCaptions) {
          player.embed?.getTextTracks?.().then?.((tracks) => {
            if (tracks && tracks.length > 0) {
              const track = pickTrack(tracks);
              player.embed.enableTextTrack(track.language, track.kind || "subtitles").catch(() => {});
            }
          }).catch?.(() => {});
        } else {
          player.embed?.disableTextTrack?.().catch?.(() => {});
        }
      }
    } catch (e) {
      /* ignore */
    }
  };
  if (isVimeo(source)) hideNativeVimeoCaptions(player);
  apply();
  setTimeout(apply, 500);
  player.on("playing", apply);

  // Vimeo quality picker in the settings menu, same as the front end.
  if (isVimeo(source)) {
    setupVimeoQuality(player);
    setTimeout(() => setupVimeoQuality(player), 1000);
    player.on("playing", () => setupVimeoQuality(player));
  }
};

const Edit = (props) => {
  const {
    attributes,
    setAttributes,
    clientId,
    currentPostId,
    currentPostType,
  } = props;
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
  // Editor YouTube/Vimeo preview: the real Plyr player INSIDE the canvas
  // (CanvasEmbedFrame), with poster and control bar before any click, same as
  // the front end. It scrolls with the page and needs no click to appear.
  // The frame is its own document: the poster's fit rule goes in with it.
  const posterCss = posterFitCss(".plyr .plyr__poster", attributes.posterFit);
  const embedRebuildKey = JSON.stringify({
    source,
    posterCss,
    controls,
    youtubeCaptions: attributes.youtubeCaptions,
    vimeoCaptions: attributes.vimeoCaptions,
  });

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
  const html5PlayerRef = useRef(null);
  // Playback toggles (Autoplay, Start Muted, Loop, Reset On End, Auto-Hide) are
  // not part of the key: they apply to the running player below, at once and
  // without restarting the video.
  const playerKey = JSON.stringify({
    source,
    poster,
    controls,
    captions,
    youtubeCaptions: attributes.youtubeCaptions,
    vimeoCaptions: attributes.vimeoCaptions,
    ratio,
  });

  useEffect(() => {
    applyLivePlayback(html5PlayerRef.current, { muted, repeat, autoHideControl, resetOnEnd });
  }, [muted, repeat, autoHideControl, resetOnEnd]);

  useEffect(() => {
    const player = html5PlayerRef.current;
    if (!player) return;
    try {
      if (autoplay) {
        player.play()?.catch?.(() => {});
      } else {
        player.pause();
      }
    } catch (e) {
      /* ignore */
    }
  }, [autoplay]);

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
      html5PlayerRef.current = player;

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
      html5PlayerRef.current = null;
    };
    // playerKey encodes what needs a rebuild; Playback toggles apply live above.
  }, [playerKey, hasControls]);

  const id = `${prefix}-${clientId}`;
  const blockProps = useBlockProps();
  const isPlayerPostType = ["video-player-block"].includes(currentPostType);


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
                  {/* The frame is absolutely positioned, so this box carries
                      the player size (Aspect Ratio and Round Corner apply). */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: cssAspectRatio(ratio),
                      borderRadius: attributes.radius,
                      overflow: "hidden",
                      background: "#000",
                    }}>
                    <CanvasEmbedFrame
                      // A fresh frame when switching between this plugin's
                      // player and the provider's own player.
                      key={usesProviderPlayer(attributes) ? "provider" : "plyr"}
                      provider={isYoutube(source) ? "youtube" : "vimeo"}
                      embedId={isYoutube(source) ? getYoutubeId(source) : getVimeoId(source)}
                      config={editorEmbedConfig(attributes)}
                      accentColor={attributes.accentColor}
                      fallbackSrc={
                        isYoutube(source)
                          ? `https://www.youtube.com/embed/${getYoutubeId(source)}?rel=0&modestbranding=1`
                          : `https://player.vimeo.com/video/${getVimeoId(source)}?title=0&byline=0&portrait=0&dnt=1`
                      }
                      rebuildKey={embedRebuildKey}
                      nativeSrc={usesProviderPlayer(attributes) ? getProviderEmbedUrl(attributes) : ""}
                      poster={poster}
                      posterCss={posterCss}
                      onPlayerReady={(player) => setupEditorCaptions(player, attributes)}
                    />
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
            onChange={(val) => setAttributes({ source: val?.url })}
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
