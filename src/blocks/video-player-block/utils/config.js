import { controlsHandler, isYoutube, isVimeo } from "./functions";

/**
 * Self-hosted video with a caption track marked "Set as Default": captions start
 * on. Before, captions always started off for self-hosted video, so the toggle
 * did nothing a visitor could see.
 */
export const hasDefaultCaption = (attributes) =>
  !isYoutube(attributes?.source) &&
  !isVimeo(attributes?.source) &&
  Array.isArray(attributes?.captions) &&
  attributes.captions.some((cap) => cap?.src && cap.default);

export const plyrConfig = (attributes) => {
  const {
    source,
    controls,
    repeat,
    autoplay,
    muted,
    resetOnEnd,
    autoHideControl,
    ratio,
    youtubeCaptions,
    vimeoCaptions,
  } = attributes;

  const isYT = isYoutube(source);
  const isVM = isVimeo(source);

  const defaultControls = {
    "play-large": true,
    "restart": false,
    "rewind": true,
    "play": true,
    "fast-forward": true,
    "progress": true,
    "current-time": true,
    "duration": false,
    "mute": true,
    "volume": true,
    "pip": false,
    "airplay": false,
    "captions": false,
    "settings": true,
    "download": false,
    "fullscreen": true,
  };

  const activeControls = {
    ...defaultControls,
    ...(controls || {}),
  };
  if (isYT) {
    activeControls.captions = Boolean(youtubeCaptions);
  } else if (isVM) {
    activeControls.captions = Boolean(vimeoCaptions);
  }
  // The sidebar hides these for YouTube/Vimeo, so a value left on from a
  // self-hosted video (or a profile) could never be switched off again.
  // Download would only link to the YouTube/Vimeo page; PiP and AirPlay are
  // HTML5-only.
  if (isYT || isVM) {
    activeControls.download = false;
    activeControls.pip = false;
    activeControls.airplay = false;
  }

  // Start muted only mutes. Also setting the volume to 0 meant a visitor who
  // pressed unmute still heard nothing until they found the volume slider.
  const mutedProps = muted
    ? { storage: { enabled: false, key: "plyr" } }
    : {};

  // "Enable YouTube/Vimeo Captions" off means captions stay off, so the
  // Settings menu does not offer them either. It used to, and a visitor could
  // still switch Vimeo subtitles on (in a random language) from there.
  const providerCaptionsOff =
    (isYT && !youtubeCaptions) || (isVM && !vimeoCaptions);
  const ratioProps = ratio ? { ratio } : {};

  let currentOrigin = typeof window !== "undefined" ? window.location.origin : "*";
  if (currentOrigin === "null" || currentOrigin === "about:blank") {
    try {
      currentOrigin = window.top?.location?.origin || "*";
    } catch (e) {
      currentOrigin = "*";
    }
  }

  return {
    controls: controlsHandler(activeControls),
    clickToPlay: true,
    loop: { active: repeat },
    muted: Boolean(muted),
    autoplay: Boolean(autoplay),
    ...mutedProps,
    resetOnEnd: Boolean(resetOnEnd),
    hideControls: autoHideControl,
    playsinline: true,
    youtubeCaptions: Boolean(youtubeCaptions),
    vimeoCaptions: Boolean(vimeoCaptions),
    captions: {
      active: isYT ? Boolean(youtubeCaptions) : isVM ? Boolean(vimeoCaptions) : hasDefaultCaption(attributes),
      language: "auto",
      update: true,
    },
    ...ratioProps,
    ...(providerCaptionsOff ? { settings: ["quality", "speed"] } : {}),
    youtube: {
      noCookie: false,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      cc_load_policy: youtubeCaptions ? 1 : 0,
      origin: currentOrigin,
    },
    vimeo: {
      texttrack: vimeoCaptions ? "auto" : "",
    },
  };
};
