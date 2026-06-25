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
      {captions.map((cap, index) => (
        <div
          key={index}
          className="vpbCaptionItem"
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            padding: "12px",
            marginBottom: "12px",
          }}>
          <InlineMediaUpload
            value={cap.src}
            onChange={(val) => update(index, "src", val)}
            placeholder={__(".vtt file url", "video-player-block")}
          />

          <TextControl
            className="mt20"
            label={__("Label", "video-player-block")}
            value={cap.label}
            placeholder={__("English", "video-player-block")}
            onChange={(val) => update(index, "label", val)}
          />

          <TextControl
            label={__("Language code", "video-player-block")}
            value={cap.srclang}
            placeholder={__("en", "video-player-block")}
            onChange={(val) => update(index, "srclang", val)}
          />

          <ToggleControl
            label={__("Default", "video-player-block")}
            checked={!!cap.default}
            onChange={(val) => update(index, "default", val)}
          />

          <Button
            isDestructive
            variant="secondary"
            onClick={() => remove(index)}>
            {__("Remove", "video-player-block")}
          </Button>
        </div>
      ))}

      <Button variant="primary" onClick={add}>
        {__("Add Caption", "video-player-block")}
      </Button>
    </div>
  );
};

export default Captions;
