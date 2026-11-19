/**
 * SubRip (.srt) subtitles for self-hosted videos.
 *
 * Browsers only read WebVTT in a <track>, so an .srt file (which WordPress lets
 * you upload to the Media Library) showed nothing. The file is converted in the
 * browser, before the player starts, and handed to the <track> as a blob.
 * .vtt files are left alone.
 */

export const isSrt = (src) => /\.srt(?:[?#]|$)/i.test(src || "");

// SRT and VTT differ in the header and the millisecond separator (00:00:01,500
// vs 00:00:01.500). Cue numbers are valid VTT cue identifiers, so they stay.
export const srtToVtt = (srt) =>
  "WEBVTT\n\n" +
  String(srt)
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .replace(/(\d{1,2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2")
    .trim() +
  "\n";

export const convertSrtTracks = async (videoNode) => {
  if (!videoNode?.querySelectorAll) return;
  const tracks = [...videoNode.querySelectorAll("track")].filter((track) =>
    isSrt(track.getAttribute("src")),
  );

  await Promise.all(
    tracks.map(async (track) => {
      try {
        const response = await fetch(track.getAttribute("src"), {
          credentials: "same-origin",
        });
        if (!response.ok) return;
        const vtt = srtToVtt(await response.text());
        track.src = URL.createObjectURL(new Blob([vtt], { type: "text/vtt" }));
      } catch (error) {
        // Unreachable file or a host without CORS: the video still plays,
        // just without these subtitles, as before.
      }
    }),
  );
};
