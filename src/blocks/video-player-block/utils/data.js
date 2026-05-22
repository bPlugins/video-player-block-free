export const prefix = "vpbpVideoPlayer";

// Build the pricing URL in JS — no PHP injection needed.
// wpApiSettings.root is always available in the block editor and gives us the site root.
const _adminBase =
  typeof window !== "undefined" && window.wpApiSettings?.root
    ? window.wpApiSettings.root.replace( /\/wp-json\/?$/, "" ) + "/wp-admin/"
    : "/wp-admin/";
export const pricingUrl =
  _adminBase +
  "edit.php?post_type=video-player-block&page=vpbp-help-demo#/pricing";