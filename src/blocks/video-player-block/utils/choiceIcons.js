/**
 * Small schematic icons for VisualChoiceControl (same design as the Pro
 * plugin). Each shape is [x, y, width, height, tone, radius] on a 48 x 32 board
 * (or [path, tone]). Tone: 1 = solid, 0 = faint.
 */
const fill = (tone) => ({ fill: "currentColor", opacity: tone ? 1 : 0.3 });

const make = (shapes) => (
  <svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true" focusable="false">
    {shapes.map((s, i) =>
      typeof s[0] === "string" ? (
        <path key={i} d={s[0]} {...fill(s[1])} />
      ) : (
        <rect key={i} x={s[0]} y={s[1]} width={s[2]} height={s[3]} rx={s[5] || 0} {...fill(s[4])} />
      ),
    )}
  </svg>
);

export const choiceIcons = {
  // The picture's shape: a 16:9 frame is wide, 9:16 is tall. "" is Auto.
  aspect: {
    "": make([[6, 5, 36, 22, 0], ["M10 24 L19 14 L25 21 L30 16 L38 24 Z", 1]]),
    "16:9": make([[4, 4.75, 40, 22.5, 1]]),
    "4:3": make([[6.6, 3, 34.8, 26, 1]]),
    "1:1": make([[11, 3, 26, 26, 1]]),
    "9:16": make([[16, 2, 15.8, 28, 1]]),
    "21:9": make([[3, 7, 42, 18, 1]]),
  },

  // Video Fit / Poster Fit: Fit (contain) shows the whole picture inside the
  // frame (bars show), Fill (cover) fills the frame and the edges are cropped.
  fit: {
    contain: make([[6, 3, 36, 26, 0], [6, 9.5, 36, 13, 1]]),
    cover: make([[6, 3, 36, 26, 1], [1, 8, 5, 16, 0], [42, 8, 5, 16, 0]]),
  },

  // Poster Position: the solid band is the part of the image that stays in view.
  position: {
    top: make([[6, 3, 36, 26, 0], [6, 3, 36, 10, 1]]),
    center: make([[6, 3, 36, 26, 0], [6, 11, 36, 10, 1]]),
    bottom: make([[6, 3, 36, 26, 0], [6, 19, 36, 10, 1]]),
  },
};
