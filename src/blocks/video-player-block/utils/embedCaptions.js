/**
 * Captions On / Off for a plain YouTube/Vimeo embed (the editor preview's
 * fallback when Plyr is slow to load), so it follows the block's Captions
 * setting like the Plyr player does. Same as Pro's _shared/media/embedCaptions.
 */
const browserLanguage = () =>
  (typeof navigator !== "undefined" && (navigator.language || "").split("-")[0]) || "en";

/**
 * Extra embed URL params. Off and On both need YouTube's JS API (the player
 * is told over postMessage, see applyEmbedCaptions); On also asks for captions.
 *
 * @param {"youtube"|"vimeo"} type
 * @param {string}            mode "auto" | "on" | "off"
 * @return {Object} Params to add to the embed URL.
 */
export const embedCaptionParams = (type, mode) => {
  if (mode !== "on" && mode !== "off") return {};
  if (type === "youtube") return { enablejsapi: "1", ...(mode === "on" ? { cc_load_policy: "1" } : {}) };
  if (type === "vimeo" && mode === "on") return { texttrack: browserLanguage() };
  return {};
};

/**
 * Sets captions on/off on a YouTube/Vimeo provider <iframe>. Sent now and again
 * a few times (the player ignores commands until it is ready), when the frame
 * loads, on the provider's ready message, and each time playback starts: a
 * visitor's YouTube that remembers "captions on" switches them on only then.
 *
 * @param {HTMLIFrameElement} iframe The provider iframe.
 * @param {string}            type   "youtube" | "vimeo".
 * @param {string}            mode   "auto" | "on" | "off" (auto does nothing).
 * @return {Function} Stops it.
 */
export const applyEmbedCaptions = (iframe, type, mode) => {
  if (!iframe || (mode !== "on" && mode !== "off") || (type !== "youtube" && type !== "vimeo")) {
    return () => {};
  }
  // The iframe's address may not be set yet (Vidstack sets it a moment after
  // the provider is created), so the origin is worked out at send time.
  const originOf = () => {
    try {
      return new URL(iframe.src).origin;
    } catch {
      return "";
    }
  };
  const post = (msg) => {
    const origin = originOf();
    if (!origin) return;
    try {
      iframe.contentWindow?.postMessage(JSON.stringify(msg), origin);
    } catch {
      /* frame gone */
    }
  };
  const apply = () => {
    if (type === "youtube") {
      post({ event: "listening", id: "vpb-cc", channel: "widget" });
      post({ event: "command", func: "addEventListener", args: ["onStateChange"] });
      if (mode === "on") {
        post({ event: "command", func: "loadModule", args: ["captions"] });
      } else {
        post({ event: "command", func: "unloadModule", args: ["captions"] });
        post({ event: "command", func: "setOption", args: ["captions", "track", {}] });
      }
    } else {
      post({ method: "addEventListener", value: "play" });
      if (mode === "on") {
        post({ method: "enableTextTrack", value: { language: browserLanguage(), kind: "captions" } });
      } else {
        post({ method: "disableTextTrack" });
      }
    }
  };
  // YouTube: onStateChange 1 (or infoDelivery playerState 1) = playing.
  let playing = false;
  const startsPlaying = (data) => {
    const state =
      data.event === "onStateChange" ? data.info : data.event === "infoDelivery" ? data.info?.playerState : undefined;
    if (state === undefined) return data.event === "play";
    const started = state === 1 && !playing;
    playing = state === 1;
    return started;
  };
  const onMessage = (event) => {
    if (event.origin !== originOf()) return;
    let data = event.data;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return;
      }
    }
    if (data && (data.event === "ready" || data.event === "onReady" || startsPlaying(data))) apply();
  };

  const wins = [...new Set([window, iframe.ownerDocument?.defaultView].filter(Boolean))];
  wins.forEach((w) => w.addEventListener("message", onMessage));
  iframe.addEventListener("load", apply);
  const timers = [600, 1800, 4000].map((ms) => setTimeout(apply, ms));
  apply();

  return () => {
    wins.forEach((w) => w.removeEventListener("message", onMessage));
    iframe.removeEventListener("load", apply);
    timers.forEach(clearTimeout);
  };
};
