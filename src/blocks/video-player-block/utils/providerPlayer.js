import {
  isYoutube,
  isVimeo,
  getYoutubeId,
  getVimeoId,
  getVimeoHash,
} from "./functions";

/**
 * "Use YouTube's / Vimeo's own player": the provider's player is shown as it
 * is, with its own controls, quality, captions and speed menus, instead of
 * this plugin's Plyr skin. Off by default; only for YouTube and Vimeo.
 */
export const usesProviderPlayer = (attributes = {}) =>
  Boolean(attributes.providerPlayer) &&
  (isYoutube(attributes.source) || isVimeo(attributes.source));

/** The visitor's language ("en"), for Vimeo's caption language. */
const browserLanguage = () => {
  const nav = typeof navigator !== "undefined" ? navigator : {};
  const lang = (nav.languages && nav.languages[0]) || nav.language || "";
  return String(lang).toLowerCase().split("-")[0];
};

/**
 * Provider embed URL built from the block settings that still apply to the
 * provider's own player: Autoplay, Start Muted, Loop and Captions.
 *
 * @param {Object}  attributes      Block attributes.
 * @param {Object}  [opts]
 * @param {boolean} [opts.autoplay] Start playing (e.g. after a poster click).
 * @return {string} Embed URL, or "" when the source is not YouTube/Vimeo.
 */
export const getProviderEmbedUrl = (attributes = {}, opts = {}) => {
  const { source, autoplay, muted, repeat, youtubeCaptions, vimeoCaptions } =
    attributes;
  const play = Boolean(opts.autoplay || autoplay);

  if (isYoutube(source)) {
    const id = getYoutubeId(source);
    if (!id) return "";
    const params = new URLSearchParams({ rel: "0", playsinline: "1" });
    if (play) params.set("autoplay", "1");
    if (muted) params.set("mute", "1");
    if (repeat) {
      // YouTube only loops a single video when it is also its own playlist.
      params.set("loop", "1");
      params.set("playlist", id);
    }
    if (youtubeCaptions) params.set("cc_load_policy", "1");
    return `https://www.youtube.com/embed/${encodeURIComponent(id)}?${params}`;
  }

  if (isVimeo(source)) {
    const id = getVimeoId(source);
    if (!id) return "";
    const params = new URLSearchParams({ dnt: "1", playsinline: "1" });
    const hash = getVimeoHash(source);
    if (hash) params.set("h", hash);
    if (play) params.set("autoplay", "1");
    if (muted) params.set("muted", "1");
    if (repeat) params.set("loop", "1");
    if (vimeoCaptions && browserLanguage()) {
      params.set("texttrack", browserLanguage());
    }
    return `https://player.vimeo.com/video/${encodeURIComponent(id)}?${params}`;
  }

  return "";
};

/** Permissions the provider iframe needs (autoplay, fullscreen, PiP...). */
export const PROVIDER_IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share";

/** "16:9" -> "16 / 9" for CSS aspect-ratio; "Auto" falls back to 16:9. */
export const cssAspectRatio = (ratio) =>
  /^\d+\s*:\s*\d+$/.test(ratio || "") ? ratio.replace(":", " / ") : "16 / 9";
