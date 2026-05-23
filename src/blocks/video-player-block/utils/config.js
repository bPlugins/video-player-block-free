import { controlsHandler } from "./functions";

export const plyrConfig = (attributes) => {
  const { controls, repeat, autoplay, muted, resetOnEnd, autoHideControl } =
    attributes;

  const mutedProps = muted
    ? { storage: { enabled: false, key: "plyr" }, volume: 0 }
    : {};

  let currentOrigin = typeof window !== "undefined" ? window.location.origin : "*";
  if (currentOrigin === "null" || currentOrigin === "about:blank") {
    try {
      currentOrigin = window.top?.location?.origin || "*";
    } catch (e) {
      currentOrigin = "*";
    }
  }

  return {
    controls: controlsHandler(controls),
    clickToPlay: false,
    loop: { active: repeat },
    muted,
    autoplay,
    ...mutedProps,
    resetOnEnd,
    hideControls: autoHideControl,
    playsinline: true,
    youtube: {
      noCookie: false,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      origin: currentOrigin,
    },
  };
};
