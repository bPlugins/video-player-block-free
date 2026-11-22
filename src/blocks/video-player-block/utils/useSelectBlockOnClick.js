import { useEffect } from "react";
import { useDispatch } from "@wordpress/data";

/**
 * One click on a player frame (EditorEmbedPortal / EditorReactPortal) both
 * operates the video and selects its block.
 *
 * A click inside the frame, or inside the YouTube/Vimeo iframe nested in it,
 * never reaches the editor. It does move focus there, so the editor window (or
 * the canvas window) blurs and the frame becomes the active element: that is
 * the signal to select the block. `enabled: false` leaves clicks alone.
 */
const useSelectBlockOnClick = (frameRef, enabled = true) => {
  const { selectBlock } = useDispatch("core/block-editor");

  useEffect(() => {
    const frame = frameRef.current;
    const clientId = frame?.closest("[data-block]")?.dataset.block;
    if (!enabled || !clientId) return undefined;

    const wins = [...new Set([window, frame.ownerDocument.defaultView])];
    const onBlur = () =>
      setTimeout(() => {
        if (frame.ownerDocument.activeElement === frame) selectBlock(clientId);
      }, 0);
    wins.forEach((w) => w.addEventListener("blur", onBlur));
    return () => wins.forEach((w) => w.removeEventListener("blur", onBlur));
  }, [frameRef, enabled, selectBlock]);
};

export default useSelectBlockOnClick;
