import { DEFAULT_CONTROLS } from "./config";

const allOff = Object.keys(DEFAULT_CONTROLS).reduce(
  (acc, key) => ({ ...acc, [key]: false }),
  {},
);

/**
 * One-click control sets for the Controls tab. Each one is a full controls
 * object, so picking it replaces every toggle at once.
 * Full leaves Download off: it hands out the video file, so it stays a
 * deliberate choice.
 */
export const CONTROL_PRESETS = [
  {
    key: "minimal",
    controls: {
      ...allOff,
      "play-large": true,
      play: true,
      progress: true,
      mute: true,
      fullscreen: true,
    },
  },
  { key: "standard", controls: { ...DEFAULT_CONTROLS } },
  {
    key: "full",
    controls: {
      ...Object.keys(DEFAULT_CONTROLS).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      ),
      download: false,
    },
  },
];

/**
 * The preset the current controls match, or "" when they were changed by hand.
 * Only the keys a player can show for this source are compared (the hidden
 * ones, like PiP on YouTube, don't count).
 */
export const activeControlPreset = (controls, ignoreKeys = []) => {
  const current = { ...DEFAULT_CONTROLS, ...(controls || {}) };
  const keys = Object.keys(DEFAULT_CONTROLS).filter(
    (key) => !ignoreKeys.includes(key),
  );
  const match = CONTROL_PRESETS.find((preset) =>
    keys.every((key) => Boolean(preset.controls[key]) === Boolean(current[key])),
  );
  return match ? match.key : "";
};
