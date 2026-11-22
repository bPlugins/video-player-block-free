import { __ } from "@wordpress/i18n";

/**
 * Poster Fit: how the poster image sits in the player when its shape differs
 * from the player's. Cover fills the player (crops); Contain shows the whole
 * image (black bars). Same words as Vidstack's own Poster Fit.
 */
export const posterFitOptions = [
  { label: __("Cover", "video-player-block"), value: "cover" },
  { label: __("Contain", "video-player-block"), value: "contain" },
];

/** CSS for a poster element(s): <img> (object-fit) or background-image div. */
export const posterFitCss = (selector, fit) =>
  fit === "cover" || fit === "contain"
    ? `${selector} {
    object-fit: ${fit} !important;
    background-size: ${fit} !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    --media-object-fit: ${fit};
  }`
    : "";
