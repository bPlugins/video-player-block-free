import { controlsHandler, isYoutube, isVimeo } from "./functions";

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

  const mutedProps = muted
    ? { storage: { enabled: false, key: "plyr" }, volume: 0 }
    : {};

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
      active: isYT ? Boolean(youtubeCaptions) : isVM ? Boolean(vimeoCaptions) : false,
      language: "auto",
      update: true,
    },
    ...ratioProps,
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
