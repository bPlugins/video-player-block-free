import { __, sprintf } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
  TabPanel,
  PanelBody,
  ToggleControl,
  Button,
} from "@wordpress/components";

import HelpPanel from "../../../../../../../bpl-tools/Components/HelpPanel/HelpPanel";
import { InlineMediaUpload } from "../../../../../../../bpl-tools/Components/MediaControl/MediaControl";
import { ColorControl } from "../../../../../../../bpl-tools/Components/ColorControl/ColorControl";
import {
  pxUnit,
  perUnit,
  emUnit,
} from "../../../../../../../bpl-tools/utils/options";
import { AdvertiseCard } from "../../../../../../../bpl-tools/ProControls";
import { pricingUrl } from "../../../utils/data";
import { isYoutube, isVimeo } from "../../../utils/functions";
import { CONTROL_PRESETS, activeControlPreset } from "../../../utils/controlPresets";
import { Fragment } from "@wordpress/element";
import Captions from "./Captions";
import VisualChoiceControl from "../VisualChoiceControl";
import { choiceIcons } from "../../../utils/choiceIcons";
import { videoFitOptions } from "../../../utils/videoFit";
import { usesProviderPlayer } from "../../../utils/providerPlayer";
import { posterFitOptions, posterPositionOptions } from "../../../utils/posterFit";
import { posterFitsPlayer, usePosterRatio } from "../../../utils/posterShape";
import { SizeControl } from "../SizeControl";

// Plyr's own accent colour, shown (and restored by Reset) when none is set.
const PLYR_ACCENT = "#00b3ff";

const PRESET_LABELS = {
  minimal: __("Minimal", "video-player-block"),
  standard: __("Standard", "video-player-block"),
  full: __("Full", "video-player-block"),
};

const Settings = ({ attributes, setAttributes }) => {
  const {
    source,
    poster,
    controls,
    captions: captionTracks,
    youtubeCaptions,
    vimeoCaptions,
    width,
    radius,
    ratio,
    posterFit,
    videoFit,
    posterPosition,
    accentColor,
    repeat,
    autoplay,
    muted,
    resetOnEnd,
    autoHideControl,
    lazyLoad,
    providerPlayer,
  } = attributes;

  // A poster the same shape as the player has nothing to crop: no Position.
  const posterSameShape = posterFitsPlayer(usePosterRatio(poster), ratio);

  const isYT = isYoutube(source);
  const isVM = isVimeo(source);
  const isEmbed = isYT || isVM;
  // "Use YouTube's / Vimeo's own player": the provider draws its own controls,
  // so the settings that only style this plugin's player are hidden.
  const nativePlayer = isEmbed && Boolean(providerPlayer);
  const providerName = isYT ? "YouTube" : "Vimeo";
  const hasCaptions = Array.isArray(captionTracks) && captionTracks.length > 0;
  // Controls tab, grouped. Items a source can't show are left out (false).
  const controlGroups = [
    {
      title: __("Playback", "video-player-block"),
      items: [
        { key: "play-large", label: __("Play Large", "video-player-block") },
        { key: "play", label: __("Play", "video-player-block") },
        { key: "restart", label: __("Restart", "video-player-block") },
        { key: "rewind", label: __("Rewind", "video-player-block") },
        { key: "fast-forward", label: __("Fast Forward", "video-player-block") },
      ],
    },
    {
      title: __("Timeline", "video-player-block"),
      items: [
        { key: "progress", label: __("Progress Bar", "video-player-block") },
        { key: "current-time", label: __("Current Time", "video-player-block") },
        { key: "duration", label: __("Duration", "video-player-block") },
      ],
    },
    {
      title: __("Audio & Screen", "video-player-block"),
      items: [
        { key: "volume", label: __("Volume", "video-player-block") },
        { key: "mute", label: __("Mute", "video-player-block") },
        { key: "fullscreen", label: __("Fullscreen", "video-player-block") },
        !isEmbed && { key: "pip", label: __("PiP", "video-player-block") },
        !isEmbed && { key: "airplay", label: __("AirPlay", "video-player-block") },
      ],
      note: !isEmbed ? __("AirPlay shows in Safari on Apple devices only.", "video-player-block") : "",
    },
    {
      title: __("Menus & Extras", "video-player-block"),
      items: [
        !isEmbed && hasCaptions && { key: "captions", label: __("CC Button", "video-player-block") },
        { key: "settings", label: __("Settings", "video-player-block") },
        !isEmbed && { key: "download", label: __("Download", "video-player-block") },
      ],
    },
  ];

  const updateControls = (type, val) => {
    const newControls = { ...(controls || {}) };
    newControls[type] = val;

    setAttributes({ controls: newControls });
  };

  // Adding the first caption file also turns the CC button on, so the captions
  // can be used straight away. Only that first file does it: once tracks exist,
  // the CC toggle stays as the user left it.
  const setCaptionAttributes = (attrs) => {
    const hadFile = (captionTracks || []).some((t) => t?.src);
    const hasFile = (attrs.captions || []).some((t) => t?.src);
    setAttributes(
      !hadFile && hasFile && !controls?.captions
        ? { ...attrs, controls: { ...(controls || {}), captions: true } }
        : attrs,
    );
  };

  // Controls a player can't show for this source don't decide which preset is active.
  const ignoredKeys = [
    ...(isEmbed ? ["pip", "airplay", "download", "captions"] : []),
    ...(!isEmbed && !hasCaptions ? ["captions"] : []),
  ];
  const activePreset = activeControlPreset(controls, ignoredKeys);

  return (
    <InspectorControls>
      <TabPanel
        className="bPlTabPanel vpb-inspector"
        activeClass="activeTab"
        tabs={[
          { name: "settings", title: __("Settings", "video-player-block") },
          ...(nativePlayer
            ? []
            : [{ name: "controls", title: __("Controls", "video-player-block") }]),
          { name: "style", title: __("Style", "video-player-block") },
        ]}>
        {(tab) => (
          <>
            {"settings" === tab.name && (
              <>
                {/* No panel title: the tab already says "Settings". */}
                <PanelBody className="bPlPanelBody vpb-main-panel">
                  {/* The video first: it is what every player starts with. */}
                  <div className="vpb-subhead">{__("Video", "video-player-block")}</div>
                  <InlineMediaUpload
                    value={source}
                    types={["video"]}
                    onChange={(val) => setAttributes({ source: val })}
                    placeholder={__("Video url (YouTube, Vimeo or file)", "video-player-block")}
                  />

                  <InlineMediaUpload
                    value={poster}
                    types={["image"]}
                    onChange={(val) => setAttributes({ poster: val })}
                    placeholder={__("Poster image url (optional)", "video-player-block")}
                  />

                  {isEmbed && (
                    <ToggleControl
                      label={sprintf(
                        /* translators: %s: YouTube or Vimeo */
                        __("Use %s's own player", "video-player-block"),
                        providerName,
                      )}
                      checked={Boolean(providerPlayer)}
                      onChange={(val) => setAttributes({ providerPlayer: val })}
                      help={sprintf(
                        /* translators: %s: YouTube or Vimeo */
                        __("%s's controls, quality and captions menus.", "video-player-block"),
                        providerName,
                      )}
                    />
                  )}

                  <div className="vpb-subhead">{__("Playback", "video-player-block")}</div>
                  <ToggleControl
                    label={__("Autoplay", "video-player-block")}
                    checked={autoplay}
                    onChange={(val) => {
                      const next = val;
                      setAttributes({ autoplay: next });
                      if (next && !muted) {
                        setAttributes({ muted: true });
                      }
                    }}
                    help={
                      autoplay && !muted
                        ? __("Browsers block autoplay unless Start Muted is on.", "video-player-block")
                        : undefined
                    }
                  />

                  <ToggleControl
                    label={__("Start Muted", "video-player-block")}
                    checked={muted}
                    onChange={(val) => setAttributes({ muted: val })}
                  />

                  <ToggleControl
                    label={__("Loop / Repeat", "video-player-block")}
                    checked={repeat}
                    onChange={(val) => setAttributes({ repeat: val })}
                  />

                  {!repeat && !nativePlayer && (
                    <ToggleControl
                      label={__("Reset On End", "video-player-block")}
                      checked={resetOnEnd}
                      onChange={(val) => setAttributes({ resetOnEnd: val })}
                      help={__("Back to the start and the poster when the video ends.", "video-player-block")}
                    />
                  )}

                  <div className="vpb-subhead">{__("Display & Loading", "video-player-block")}</div>
                  {!nativePlayer && (
                    <ToggleControl
                      label={__("Auto-Hide Controls", "video-player-block")}
                      checked={autoHideControl}
                      onChange={(val) => setAttributes({ autoHideControl: val })}
                    />
                  )}

                  <ToggleControl
                    label={__("Lazy Load Player", "video-player-block")}
                    checked={lazyLoad}
                    onChange={(val) => setAttributes({ lazyLoad: val })}
                    help={__("Loads the player when it scrolls into view.", "video-player-block")}
                  />

                  {/* Captions sit in the same panel: one click, no panel to open first. */}
                  <div className="vpb-subhead">{__("Captions / Subtitles", "video-player-block")}</div>
                  {isYT ? (
                    <ToggleControl
                      label={__("Show YouTube Captions", "video-player-block")}
                      checked={youtubeCaptions}
                      onChange={(val) => setAttributes({ youtubeCaptions: val })}
                      help={
                        youtubeCaptions
                          ? __("Visitors can switch them off in the player.", "video-player-block")
                          : __("Off: YouTube's captions are kept off.", "video-player-block")
                      }
                    />
                  ) : isVM ? (
                    <ToggleControl
                      label={__("Show Vimeo Captions", "video-player-block")}
                      checked={vimeoCaptions}
                      onChange={(val) => setAttributes({ vimeoCaptions: val })}
                      help={
                        vimeoCaptions
                          ? __("In the visitor's language when the video has it.", "video-player-block")
                          : __("Off: Vimeo's captions are kept off.", "video-player-block")
                      }
                    />
                  ) : (
                    <Captions
                      captions={captionTracks}
                      setAttributes={setCaptionAttributes}
                    />
                  )}
                </PanelBody>

                <HelpPanel
                  slug="video-player-block"
                  docsLink="https://bblockswp.com/docs/video-player-block"
                />
              </>
            )}

            {"controls" === tab.name && (
              <PanelBody className="bPlPanelBody vpb-main-panel">
                {/* One click sets the whole control bar; the toggles below fine-tune it. */}
                <div className="vpb-control-presets" role="group" aria-label={__("Control Presets", "video-player-block")}>
                  {CONTROL_PRESETS.map((preset) => (
                    <Button
                      key={preset.key}
                      variant={activePreset === preset.key ? "primary" : "secondary"}
                      isPressed={activePreset === preset.key}
                      onClick={() => setAttributes({ controls: { ...preset.controls } })}>
                      {PRESET_LABELS[preset.key]}
                    </Button>
                  ))}
                </div>
                <p className="vpb-note">
                  {activePreset
                    ? __("Pick a set, or switch single buttons below.", "video-player-block")
                    : __("Custom set. Pick one above to start over.", "video-player-block")}
                </p>

                {/* Two-column grid per group: half the length of a single
                    column, and each group reads as one block. */}
                {controlGroups.map((group) => (
                  <Fragment key={group.title}>
                    <div className="vpb-subhead">{group.title}</div>
                    <div className="vpb-toggle-grid">
                      {group.items.filter(Boolean).map((item) => (
                        <ToggleControl
                          key={item.key}
                          label={item.label}
                          checked={Boolean(controls?.[item.key])}
                          onChange={(val) => updateControls(item.key, val)}
                        />
                      ))}
                    </div>
                    {group.note && <p className="vpb-note">{group.note}</p>}
                  </Fragment>
                ))}
              </PanelBody>
            )}

            {"style" === tab.name && (
              <PanelBody className="bPlPanelBody vpb-main-panel">
                <div className="vpb-subhead">{__("Size", "video-player-block")}</div>
                <SizeControl
                  label={__("Width", "video-player-block")}
                  labelPosition="left"
                  value={width}
                  onChange={(val) => setAttributes({ width: val })}
                  units={[pxUnit(), emUnit(), perUnit()]}
                />

                <VisualChoiceControl
                  label={__("Aspect Ratio", "video-player-block")}
                  value={ratio || ""}
                  icons={choiceIcons.aspect}
                  options={[
                    { label: __("Auto", "video-player-block"), value: "" },
                    { label: "16:9", value: "16:9" },
                    { label: "4:3", value: "4:3" },
                    { label: "1:1", value: "1:1" },
                    { label: "9:16", value: "9:16" },
                    { label: "21:9", value: "21:9" },
                  ]}
                  onChange={(val) => setAttributes({ ratio: val })}
                />
                {!usesProviderPlayer(attributes) ? (
                  <VisualChoiceControl
                    label={__("Video Fit", "video-player-block")}
                    value={videoFit || "contain"}
                    icons={choiceIcons.fit}
                    options={videoFitOptions}
                    onChange={(val) => setAttributes({ videoFit: val })}
                    help={__("Fit shows the whole video; Fill covers the player and crops the edges.", "video-player-block")}
                  />
                ) : null}
                {poster && (
                  <VisualChoiceControl
                    label={__("Poster Fit", "video-player-block")}
                    value={posterFit || "cover"}
                    icons={choiceIcons.fit}
                    options={posterFitOptions}
                    onChange={(val) => setAttributes({ posterFit: val })}
                    help={__("Cover fills the player; Contain shows the whole image.", "video-player-block")}
                  />
                )}
                {poster && (posterFit || "cover") === "cover" &&
                  (posterSameShape ? (
                    <p className="vpb-note">
                      {__("The poster is the same shape as the player, so there is nothing to move. Poster Position shows for a poster of another shape.", "video-player-block")}
                    </p>
                  ) : (
                    <VisualChoiceControl
                      label={__("Poster Position", "video-player-block")}
                      value={posterPosition || "center"}
                      icons={choiceIcons.position}
                      options={posterPositionOptions}
                      onChange={(val) => setAttributes({ posterPosition: val })}
                    />
                  ))}

                <div className="vpb-subhead">{__("Look", "video-player-block")}</div>
                <SizeControl
                  label={__("Round Corner", "video-player-block")}
                  labelPosition="left"
                  value={radius}
                  onChange={(val) => setAttributes({ radius: val })}
                  units={[pxUnit()]}
                />

                {!nativePlayer && (
                  <ColorControl
                    label={__("Accent Color", "video-player-block")}
                    value={accentColor || PLYR_ACCENT}
                    defaultColor={PLYR_ACCENT}
                    onChange={(val) =>
                      setAttributes({ accentColor: val === PLYR_ACCENT ? "" : val })
                    }
                  />
                )}
              </PanelBody>
            )}
          </>
        )}
      </TabPanel>

      <AdvertiseCard className="vpb-advertise" planLink={pricingUrl} />
    </InspectorControls>
  );
};
export default Settings;
