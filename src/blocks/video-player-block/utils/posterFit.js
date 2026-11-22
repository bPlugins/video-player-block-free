import { __ } from "@wordpress/i18n";

/**
 * Poster Fit: how the poster image sits in the player when its shape differs
 * from the player's. Cover fills the player (crops); Contain shows the whole
 * image (black bars). Same words as Vidstack's own Poster Fit.
 * Poster Position: with Cover, which part of the image stays in view.
 */
export const posterFitOptions = [
  { label: __("Cover", "video-player-block"), value: "cover" },
  { label: __("Contain", "video-player-block"), value: "contain" },
];

export const posterPositionOptions = [
  { label: __("Top", "video-player-block"), value: "top" },
  { label: __("Center", "video-player-block"), value: "center" },
  { label: __("Bottom", "video-player-block"), value: "bottom" },
];

const POSITIONS = { top: "center top", center: "center", bottom: "center bottom" };

/** The CSS object-position / background-position for a position name. */
export const posterPositionValue = (position) => POSITIONS[position] || "center";

/** CSS for a poster element(s): <img> (object-fit) or background-image div. */
export const posterFitCss = (selector, fit, position = "center") =>
  fit === "cover" || fit === "contain"
    ? `${selector} {
    object-fit: ${fit} !important;
    object-position: ${posterPositionValue(position)} !important;
    background-size: ${fit} !important;
    background-position: ${posterPositionValue(position)} !important;
    background-repeat: no-repeat !important;
    --media-object-fit: ${fit};
    --media-object-position: ${posterPositionValue(position)};
  }`
    : "";
