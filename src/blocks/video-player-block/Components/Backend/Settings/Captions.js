import { __ } from "@wordpress/i18n";
import { Button, TextControl, ToggleControl } from "@wordpress/components";

import { InlineMediaUpload } from "../../../../../../../bpl-tools/Components";

/**
 * Captions repeater — manages an array of subtitle tracks.
 * Each track: { src, label, srclang, default }
 * Plyr picks up the rendered <track> elements automatically.
 * Only applies to self-hosted videos (YouTube/Vimeo supply their own captions).
 */
const Captions = ({ captions = [], setAttributes }) => {
  const update = (index, key, val) => {
    const next = captions.map((cap, i) =>
      i === index ? { ...cap, [key]: val } : cap,
    );
    // Only one track can be the default.
    if (key === "default" && val) {
      next.forEach((cap, i) => {
        if (i !== index) cap.default = false;
      });
    }
    setAttributes({ captions: next });
  };

  const add = () => {
    setAttributes({
      captions: [
        ...captions,
        { src: "", label: "", srclang: "", default: captions.length === 0 },
      ],
    });
  };

  const remove = (index) => {
    setAttributes({ captions: captions.filter((_, i) => i !== index) });
  };

  return (
    <div className="vpbCaptions">
      {captions.length === 0 && (
        <div style={{ padding: "10px 0 15px", color: "#757575", fontStyle: "italic", fontSize: "13px" }}>
          {__("No caption tracks added yet. Click below to add a subtitle track (.vtt).", "video-player-block")}
        </div>
      )}

      {captions.map((cap, index) => (
        <div
          key={index}
          className="vpbCaptionItem"
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "15px",
            backgroundColor: "#fafafa"
          }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #eaeaea" }}>
            <strong style={{ fontSize: "11px", textTransform: "uppercase", color: "#1e1e1e", letterSpacing: "0.5px" }}>
              {__("Track", "video-player-block")} {index + 1}
            </strong>
            <Button
              isDestructive
              size="small"
              variant="link"
              style={{ textDecoration: "none", padding: 0 }}
              onClick={() => remove(index)}>
              {__("Remove", "video-player-block")}
            </Button>
          </div>

          <InlineMediaUpload
            label={__("Caption file (.vtt)", "video-player-block")}
            value={cap.src}
            types={["text"]}
            onChange={(val) => update(index, "src", val)}
            placeholder={__("https://…/captions.vtt", "video-player-block")}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "15px" }}>
            <TextControl
              label={__("Label", "video-player-block")}
              value={cap.label}
              placeholder={__("English", "video-player-block")}
              onChange={(val) => update(index, "label", val)}
            />

            <TextControl
              label={__("Lang Code", "video-player-block")}
              value={cap.srclang}
              placeholder={__("en", "video-player-block")}
              onChange={(val) => update(index, "srclang", val)}
            />
          </div>

          <ToggleControl
            className="mt10"
            label={__("Set as Default", "video-player-block")}
            checked={!!cap.default}
            onChange={(val) => update(index, "default", val)}
          />
        </div>
      ))}

      <Button variant="secondary" style={{ width: "100%", justifyContent: "center" }} onClick={add}>
        {__("+ Add Caption Track", "video-player-block")}
      </Button>
    </div>
  );
};

export default Captions;
