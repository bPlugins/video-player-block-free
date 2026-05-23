// Loaded via block.json "script" field.
// With apiVersion 3, "script" executes inside the editor's iframe canvas,
// so window.Plyr here is the iframe's window.Plyr — Edit.js reads it via
// ownerDocument.defaultView.Plyr, which is exactly this iframe window.
import Plyr from "plyr";
window.Plyr = Plyr;
