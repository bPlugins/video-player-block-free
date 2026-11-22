import { __ } from "@wordpress/i18n";

/**
 * Poster Aspect Ratio: the shape of the poster image shown before play.
 * "" (Auto) fills the player; any other ratio is drawn centred,
 * as large as fits inside the player, the rest staying the player's black.
 * Shared by every player block that has a poster.
 */
export const posterRatioOptions = [
  { label: __("Auto", "video-player-block"), value: "" },
  { label: "16:9", value: "16:9" },
  { label: "4:3", value: "4:3" },
  { label: "21:9", value: "21:9" },
  { label: "1:1", value: "1:1" },
  { label: "9:16", value: "9:16" },
];

const parseRatio = (value) => {
  const m = /^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/.exec(value || "");
  return m && +m[1] > 0 && +m[2] > 0 ? [+m[1], +m[2]] : null;
};

/** True when the poster has a ratio of its own (not Auto). */
export const hasPosterRatio = (value) => !!parseRatio(value);

/**
 * CSS that sizes a poster layer to `posterRatio` inside a player of `boxRatio`
 * ("16:9" or "16/9"; empty when the player has a fixed height instead).
 *
 * @param {string} selector    The poster element(s).
 * @param {string} posterRatio "" or "w:h".
 * @param {string} boxRatio    The player's own ratio.
 * @return {string} CSS rule, or "" for Auto.
 */
export const posterRatioCss = (selector, posterRatio, boxRatio) => {
  const poster = parseRatio(posterRatio);
  if (!poster) return "";
  const box = parseRatio(boxRatio);
  // A poster wider than the player spans its width, a narrower one its height.
  const spansWidth = box ? poster[0] / poster[1] >= box[0] / box[1] : false;
  return `${selector} {
    position: absolute !important;
    inset: auto !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: ${spansWidth ? "100%" : "auto"} !important;
    height: ${spansWidth ? "auto" : "100%"} !important;
    aspect-ratio: ${poster[0]} / ${poster[1]} !important;
    object-fit: cover !important;
    background-size: cover !important;
    background-position: center !important;
  }`;
};

/**
 * Poster Ratio for the Plyr players: the poster rule, plus the media itself
 * hidden until play so it does not show around a poster narrower than the player
 * (Plyr marks the player `plyr__poster-enabled` while the poster is up).
 *
 * @param {string} scope       Selector prefix ("" inside the editor frame).
 * @param {string} posterRatio "" or "w:h".
 * @param {string} boxRatio    The player's own ratio.
 * @return {string} CSS, or "" for Auto.
 */
export const plyrPosterCss = (scope, posterRatio, boxRatio) =>
  hasPosterRatio(posterRatio)
    ? `${posterRatioCss(`${scope}.plyr .plyr__poster`, posterRatio, boxRatio)}
  ${scope}.plyr.plyr__poster-enabled iframe,
  ${scope}.plyr.plyr__poster-enabled video { opacity: 0; }`
    : "";
