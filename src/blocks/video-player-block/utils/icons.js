const iconColor = "#136EF5";

// Outline, 2px stroke, sharp corners: same look as the Pro block icons.
// style repeats fill:none because core's ".components-button svg { fill:
// currentColor }" beats the fill attribute.
export const videoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    style={{ fill: "none" }}
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
    className="vpb-block-icon video-player-icon"
    aria-hidden="true">
    <rect x="2" y="6" width="13" height="12" />
    <polygon points="15,10.5 22,7 22,17 15,13.5" />
  </svg>
);

export const cameraIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill={iconColor}
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);
