// Dashboard (Blocks and Demos pages) icons: the same outline icons the Pro
// blocks use in the editor, so Free and Pro dashboards match.
// Copied from video-player-block-pro src/blocks/*/utils/icons.js.

// One look for every block icon in this plugin: 24px outline, 2px stroke,
// sharp corners, brand blue. Small solid accents (play triangles) spread
// `solid` onto themselves.
//
// `style` repeats fill:none because core's ".components-button svg { fill:
// currentColor }" beats the fill attribute and turned outlines into dark boxes.

const BLOCK_ICON_COLOR = "#136EF5";

const solid = { fill: BLOCK_ICON_COLOR, stroke: "none" };

const outlineIcon = (className, children) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    style={{ fill: "none" }}
    stroke={BLOCK_ICON_COLOR}
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={`vpb-block-icon ${className}`}
    aria-hidden="true">
    {children}
  </svg>
);

export const videoPlayerIcon = outlineIcon("video-player-icon", <>
    <rect x="2" y="6" width="13" height="12" />
    <polygon points="15,10.5 22,7 22,17 15,13.5" />
  </>);

export const reactVideoPlayerIcon = outlineIcon("react-video-player-icon", <>
    <rect x="2" y="3" width="20" height="18" />
    <line x1="2" y1="8" x2="22" y2="8" />
    <polygon points="10,11.5 10,17.5 15,14.5" {...solid} />
  </>);

export const videojsPlayerIcon = outlineIcon("videojs-player-icon", <>
    <circle cx="12" cy="12" r="10" />
    <polygon points="10,8 10,16 16,12" {...solid} />
  </>);

export const vidstackPlayerIcon = outlineIcon("vidstack-icon", <>
    <rect x="2" y="4" width="20" height="16" />
    <polygon points="10,7.5 10,12.5 14,10" {...solid} />
    <line x1="5" y1="16" x2="19" y2="16" />
  </>);

export const videoGalleryIcon = outlineIcon("video-gallery-icon", <>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <polygon points="6,5.5 6,7.5 7.5,6.5" {...solid} />
    <polygon points="17,16.5 17,18.5 18.5,17.5" {...solid} />
  </>);

export const videoLightboxIcon = outlineIcon("video-lightbox-icon", <>
    <rect x="2" y="4" width="20" height="16" />
    <circle cx="12" cy="12" r="5" {...solid} />
    <polygon points="11,10 11,14 14,12" fill="#ffffff" stroke="none" />
  </>);

export const videoComparisonIcon = outlineIcon("video-comparison-icon", <>
    <rect x="2" y="4" width="20" height="16" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <polyline points="9,9 6,12 9,15" />
    <polyline points="15,9 18,12 15,15" />
  </>);

export const videoTestimonialIcon = outlineIcon("video-testimonial-icon", <>
    <rect x="2" y="3" width="20" height="14" />
    <polygon points="10,7 10,13 15,10" {...solid} />
    <circle cx="6" cy="20" r="1.5" {...solid} />
    <line x1="10" y1="20" x2="22" y2="20" strokeWidth="1.5" />
  </>);

export const videoPlaylistIcon = outlineIcon("video-playlist-icon", <>
    <rect x="2" y="4" width="13" height="14" />
    <polygon points="7,8 7,14 12,11" {...solid} />
    <line x1="18" y1="6" x2="22" y2="6" />
    <line x1="18" y1="10" x2="22" y2="10" />
    <line x1="18" y1="14" x2="22" y2="14" />
    <line x1="18" y1="18" x2="20" y2="18" />
  </>);

export const videoReelsIcon = outlineIcon("video-reels-icon", <>
    <rect x="7" y="2" width="10" height="20" />
    <polygon points="10,8 10,16 15,12" {...solid} />
    <line x1="3" y1="8" x2="4" y2="8" />
    <line x1="3" y1="12" x2="4" y2="12" />
    <line x1="3" y1="16" x2="4" y2="16" />
    <line x1="20" y1="8" x2="21" y2="8" />
    <line x1="20" y1="12" x2="21" y2="12" />
    <line x1="20" y1="16" x2="21" y2="16" />
  </>);

export const videoTranscriptIcon = outlineIcon("video-transcript-icon", <>
    <rect x="2" y="3" width="9" height="14" />
    <polygon points="5.5,7.5 5.5,12.5 9,10" {...solid} />
    <line x1="14" y1="5" x2="22" y2="5" />
    <line x1="14" y1="9" x2="22" y2="9" />
    <line x1="14" y1="13" x2="22" y2="13" />
    <line x1="14" y1="17" x2="19" y2="17" />
    <line x1="2" y1="21" x2="22" y2="21" strokeWidth="1" opacity="0.4" />
  </>);
