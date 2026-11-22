import { __ } from "@wordpress/i18n";

/**
 * Video Fit: what the video does when its shape differs from the player box
 * (Aspect Ratio). Fit shows the whole video (black bars); Fill covers the box
 * (crops the edges), like Poster Fit's Cover.
 */
export const videoFitOptions = [
  { label: __("Fit", "video-player-block"), value: "contain" },
  { label: __("Fill", "video-player-block"), value: "cover" },
];

/** Self-hosted <video> fill: object-fit only (Fit is the default look). */
export const videoObjectFitCss = (selector, fit) =>
  fit === "cover" ? `${selector} { object-fit: cover !important; }` : "";

/**
 * CSS for Plyr players. Self-hosted video takes object-fit; a YouTube/Vimeo
 * iframe is scaled up (16:9, centred, at least the box) and clipped by the
 * player. Only Fill needs rules: Fit is how every player already behaves.
 */
export const videoFitCss = (scope, fit) =>
  fit === "cover"
    ? `${videoObjectFitCss(`${scope}.plyr video`, fit)}
  ${scope}.plyr--youtube .plyr__video-embed iframe,
  ${scope}.plyr--vimeo .plyr__video-embed iframe {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    width: auto !important;
    height: auto !important;
    min-width: 100% !important;
    min-height: 100% !important;
    aspect-ratio: 16 / 9 !important;
    transform: translate(-50%, -50%) !important;
  }`
    : "";
