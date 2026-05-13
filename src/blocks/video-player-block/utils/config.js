import { controlsHandler } from "./functions";

export const plyrConfig = (attributes) => {
  const { controls, repeat, autoplay, muted, resetOnEnd, autoHideControl } =
    attributes;

  const mutedProps = muted
    ? { storage: { enabled: false, key: "plyr" }, volume: 0 }
    : {};

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
  };
};
