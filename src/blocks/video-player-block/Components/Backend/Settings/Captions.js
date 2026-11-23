import { __, sprintf } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { TextControl, ToggleControl } from "@wordpress/components";

import { InlineMediaUpload } from "../../../../../../../bpl-tools/Components/MediaControl/MediaControl";
import ItemsPanel from "../../../../../../../bpl-tools/Components/ItemsPanel/ItemsPanel";

/**
 * One track's fields, rendered by bpl-tools ItemsPanel inside each sortable row
 * (it passes value / onChange and the row index).
 */
const ItemSettings = ({ value: tracks, onChange, index }) => {
  const track = tracks[index] || {};
  const update = (patch) =>
    onChange(
      tracks.map((t, i) => {
        if (i === index) return { ...t, ...patch };
        // Only one track can be the default.
        if (patch.default) return { ...t, default: false };
        return t;
      }),
    );

  return (
    <>
      <InlineMediaUpload
        label={__("Caption File (.vtt or .srt)", "video-player-block")}
        value={track.src}
        types={["text"]}
        onChange={(src) => update({ src })}
        placeholder={__("https://…/captions.vtt", "video-player-block")}
      />

      <div className="vpb-grid-2">
        <TextControl
          label={__("Label", "video-player-block")}
          value={track.label || ""}
          placeholder={__("English", "video-player-block")}
          onChange={(label) => update({ label })}
        />
        <TextControl
          label={__("Language", "video-player-block")}
          value={track.srclang || ""}
          placeholder={__("en", "video-player-block")}
          onChange={(srclang) => update({ srclang })}
        />
      </div>

      <ToggleControl
        label={__("Default Track", "video-player-block")}
        checked={!!track.default}
        onChange={(value) => update({ default: value })}
      />
    </>
  );
};

/**
 * Captions list: an array of subtitle tracks { src, label, srclang, default },
 * a sortable bpl-tools ItemsPanel (drag, copy, delete). Plyr picks up the
 * rendered <track> elements. Self-hosted videos only (YouTube/Vimeo supply
 * their own captions). Every change builds new objects so Undo works.
 */
const Captions = ({ captions = [], setAttributes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // The row title is worked out here and stripped again before saving.
  const titled = captions.map((c, i) => ({
    ...c,
    title: c.label || c.srclang || sprintf(__("Track %d", "video-player-block"), i + 1),
  }));
  const save = (next) =>
    setAttributes({
      captions: next.map((c) => Object.fromEntries(Object.entries(c).filter(([key]) => key !== "title"))),
    });

  const copy = (index) => {
    const next = [...captions];
    next.splice(index + 1, 0, { ...captions[index], default: false });
    setAttributes({ captions: next });
  };

  return (
    <div className="vpb-captions">
      {captions.length === 0 && (
        <p className="vpb-note">
          {__("No caption tracks yet. Add a .vtt or .srt file.", "video-player-block")}
        </p>
      )}
      <ItemsPanel
        design="sortable"
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        value={titled}
        onChange={save}
        arrKey="captions"
        title="title"
        itemLabel={__("Track", "video-player-block")}
        minItem={0}
        newItem={{ src: "", label: "", srclang: "", default: false }}
        handleCopy={copy}
        ItemSettings={ItemSettings}
      />
    </div>
  );
};

export default Captions;
