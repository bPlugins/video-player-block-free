import { __, sprintf } from "@wordpress/i18n";
import { Button, TextControl, ToggleControl } from "@wordpress/components";

import { InlineMediaUpload } from "../../../../../../../bpl-tools/Components";

/**
 * Captions repeater: an array of subtitle tracks { src, label, srclang, default }.
 * Plyr picks up the rendered <track> elements. Self-hosted videos only
 * (YouTube/Vimeo supply their own captions). Styles: inspector.scss.
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

  // No confirm: the editor's Undo brings a removed track back.
  const remove = (index) => {
    setAttributes({ captions: captions.filter((_, i) => i !== index) });
  };

  return (
    <div className="vpb-captions">
      {captions.length === 0 && (
        <p className="vpb-note">
          {__("No caption tracks yet. Add a .vtt or .srt file.", "video-player-block")}
        </p>
      )}

      {captions.map((cap, index) => (
        <div key={index} className="vpb-caption-item">
          <div className="vpb-caption-head">
            {sprintf(
              /* translators: %d: track number */
              __("Track %d", "video-player-block"),
              index + 1,
            )}
            {/* Rare and destructive: a quiet icon, not a loud button. */}
            <Button
              icon="trash"
              size="small"
              isDestructive
              label={__("Remove track", "video-player-block")}
              showTooltip
              onClick={() => remove(index)}
            />
          </div>

          <InlineMediaUpload
            label={__("Caption file (.vtt or .srt)", "video-player-block")}
            value={cap.src}
            types={["text"]}
            onChange={(val) => update(index, "src", val)}
            placeholder={__("https://…/captions.vtt", "video-player-block")}
          />

          <div className="vpb-grid-2">
            <TextControl
              label={__("Label", "video-player-block")}
              value={cap.label}
              placeholder={__("English", "video-player-block")}
              onChange={(val) => update(index, "label", val)}
            />

            <TextControl
              label={__("Language", "video-player-block")}
              value={cap.srclang}
              placeholder={__("en", "video-player-block")}
              onChange={(val) => update(index, "srclang", val)}
            />
          </div>

          <ToggleControl
            label={__("Default Track", "video-player-block")}
            checked={!!cap.default}
            onChange={(val) => update(index, "default", val)}
          />
        </div>
      ))}

      <Button variant="secondary" className="vpb-captions-add" onClick={add}>
        {__("+ Add Caption Track", "video-player-block")}
      </Button>
    </div>
  );
};

export default Captions;
