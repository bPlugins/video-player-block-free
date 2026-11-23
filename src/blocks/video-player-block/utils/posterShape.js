import { useEffect, useState } from "@wordpress/element";

/** "16:9" or "16/9" -> 1.777..., anything else (Auto, "custom") -> null. */
export const parseRatio = (value) => {
  const m = String(value ?? "").match(/^\s*(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)\s*$/);
  return m ? Number(m[1]) / Number(m[2]) : null;
};

/** The poster's own width / height once the image has loaded, else null. */
export const usePosterRatio = (url) => {
  const [ratio, setRatio] = useState(null);

  useEffect(() => {
    setRatio(null);
    if (!url) return undefined;
    let live = true;
    const img = new window.Image();
    img.onload = () => live && img.naturalHeight && setRatio(img.naturalWidth / img.naturalHeight);
    img.src = url;
    return () => {
      live = false;
    };
  }, [url]);

  return ratio;
};

/**
 * True when the poster is the same shape as the player (within 2%), so Cover
 * crops nothing and Poster Position would change nothing. Unknown shapes (the
 * image still loading, or an Auto player) count as different: the control stays.
 */
export const posterFitsPlayer = (posterRatio, playerRatio) => {
  const player = parseRatio(playerRatio);
  return Boolean(posterRatio && player && Math.abs(posterRatio / player - 1) < 0.02);
};
