import { cssAspectRatio } from "./providerPlayer";

/**
 * Lazy Load placeholder: the box a lazy player keeps until it loads, so the page
 * doesn't jump when it does. Aspect Ratio setting (16:9 for Auto), black, with
 * the poster when one is set.
 *
 * @param {string} ratio  The block's Aspect Ratio ("16:9", "" for Auto...).
 * @param {string} poster Poster image URL, optional.
 * @return {Object} Inline style for the .videoWrapper.
 */
export const lazyPlaceholderStyle = (ratio, poster) => ({
  aspectRatio: cssAspectRatio(ratio),
  backgroundColor: "#000",
  ...(poster
    ? {
        backgroundImage: `url("${String(poster).replace(/["\\\n\r]/g, "")}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {}),
});

/**
 * Called when a lazy player starts loading: removes the placeholder box (the
 * player sizes itself from here on) and lets a self-hosted file load.
 *
 * @param {Element} node The player element (<video> or the provider <div>).
 */
export const releaseLazyPlaceholder = (node) => {
  const wrapper = node?.closest?.(".videoWrapper");
  if (wrapper) {
    ["aspect-ratio", "background-color", "background-image", "background-size", "background-position"].forEach(
      (prop) => wrapper.style.removeProperty(prop),
    );
  }
  if (node?.tagName === "VIDEO" && node.getAttribute("preload") === "none") {
    node.setAttribute("preload", "metadata");
  }
};
