import { __, sprintf } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
  TabPanel,
  PanelBody,
  ToggleControl,
  SelectControl,
  Button,
  __experimentalUnitControl as UnitControl,
} from "@wordpress/components";

import {
  HelpPanel,
  InlineMediaUpload,
  ColorControl,
} from "../../../../../../../bpl-tools/Components";
import {
  pxUnit,
  perUnit,
  emUnit,
} from "../../../../../../../bpl-tools/utils/options";
import { AdvertiseCard } from "../../../../../../../bpl-tools/ProControls";
import { pricingUrl } from "../../../utils/data";
import { isYoutube, isVimeo } from "../../../utils/functions";
import { CONTROL_PRESETS, activeControlPreset } from "../../../utils/controlPresets";
import Captions from "./Captions";

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
    accentColor,
    repeat,
    autoplay,
    muted,
    resetOnEnd,
    autoHideControl,
    lazyLoad,
    providerPlayer,
  } = attributes;

  const isYT = isYoutube(source);
  const isVM = isVimeo(source);
  const isEmbed = isYT || isVM;
  // "Use YouTube's / Vimeo's own player": the provider draws its own controls,
  // so the settings that only style this plugin's player are hidden.
  const nativePlayer = isEmbed && Boolean(providerPlayer);
  const providerName = isYT ? "YouTube" : "Vimeo";
  const hasCaptions = Array.isArray(captionTracks) && captionTracks.length > 0;
  const {
    restart,
    rewind,
    play,
    progress,
    duration,
    mute,
    volume,
    pip,
    airplay,
    settings,
    download,
    fullscreen,
  } = controls || {};

  const updateControls = (type, val) => {
    const newControls = { ...(controls || {}) };
    newControls[type] = val;

    setAttributes({ controls: newControls });
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
                <PanelBody
                  className="bPlPanelBody"
                  initialOpen={true}
                  title={__("Settings", "video-player-block")}>
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
                      setAttributes={setAttributes}
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
              <PanelBody
                className="bPlPanelBody"
                initialOpen={true}
                title={__("Player Controls", "video-player-block")}>
                {/* One click sets the whole control bar; the toggles below fine-tune it. */}
                <div className="vpb-control-presets" role="group" aria-label={__("Control presets", "video-player-block")}>
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
                <p className="vpb-control-presets__note">
                  {activePreset
                    ? __("Pick a set, or switch single buttons below.", "video-player-block")
                    : __("Custom set. Pick one above to start over.", "video-player-block")}
                </p>

                <div className="vpb-subhead">{__("Playback", "video-player-block")}</div>
                <ToggleControl
                  label={__("Play Large", "video-player-block")}
                  checked={controls["play-large"]}
                  onChange={(val) => updateControls("play-large", val)}
                />
                <ToggleControl
                  label={__("Play", "video-player-block")}
                  checked={play}
                  onChange={(val) => updateControls("play", val)}
                />
                <ToggleControl
                  label={__("Restart", "video-player-block")}
                  checked={restart}
                  onChange={(val) => updateControls("restart", val)}
                />
                <ToggleControl
                  label={__("Rewind", "video-player-block")}
                  checked={rewind}
                  onChange={(val) => updateControls("rewind", val)}
                />
                <ToggleControl
                  label={__("Fast Forward", "video-player-block")}
                  checked={controls["fast-forward"]}
                  onChange={(val) => updateControls("fast-forward", val)}
                />

                <div className="vpb-subhead">{__("Timeline", "video-player-block")}</div>
                <ToggleControl
                  label={__("Progress Bar", "video-player-block")}
                  checked={progress}
                  onChange={(val) => updateControls("progress", val)}
                />
                <ToggleControl
                  label={__("Current Time", "video-player-block")}
                  checked={controls["current-time"]}
                  onChange={(val) => updateControls("current-time", val)}
                />
                <ToggleControl
                  label={__("Duration", "video-player-block")}
                  checked={duration}
                  onChange={(val) => updateControls("duration", val)}
                />

                <div className="vpb-subhead">{__("Audio & Display", "video-player-block")}</div>
                <ToggleControl
                  label={__("Volume Slider", "video-player-block")}
                  checked={volume}
                  onChange={(val) => updateControls("volume", val)}
                />
                <ToggleControl
                  label={__("Mute Button", "video-player-block")}
                  checked={mute}
                  onChange={(val) => updateControls("mute", val)}
                />
                <ToggleControl
                  label={__("Fullscreen", "video-player-block")}
                  checked={fullscreen}
                  onChange={(val) => updateControls("fullscreen", val)}
                />
                {!isEmbed && (
                  <ToggleControl
                    label={__("PIP (Picture-in-Picture)", "video-player-block")}
                    checked={pip}
                    onChange={(val) => updateControls("pip", val)}
                  />
                )}
                {!isEmbed && (
                  <ToggleControl
                    label={__("Airplay", "video-player-block")}
                    checked={airplay}
                    onChange={(val) => updateControls("airplay", val)}
                    help={__("Safari on Apple devices only.", "video-player-block")}
                  />
                )}

                <div className="vpb-subhead">{__("Features", "video-player-block")}</div>
                {!isEmbed && hasCaptions && (
                  <ToggleControl
                    label={__("Captions Button (CC)", "video-player-block")}
                    checked={controls["captions"]}
                    onChange={(val) => updateControls("captions", val)}
                  />
                )}
                <ToggleControl
                  label={__("Settings Menu", "video-player-block")}
                  checked={settings}
                  onChange={(val) => updateControls("settings", val)}
                />
                {!isEmbed && (
                  <ToggleControl
                    label={__("Download Button", "video-player-block")}
                    checked={download}
                    onChange={(val) => updateControls("download", val)}
                  />
                )}
              </PanelBody>
            )}

            {"style" === tab.name && (
              <PanelBody
                className="bPlPanelBody"
                initialOpen={true}
                title={__("Player Style", "video-player-block")}>
                <UnitControl
                  label={__("Width:", "video-player-block")}
                  labelPosition="left"
                  value={width}
                  onChange={(val) => setAttributes({ width: val })}
                  units={[pxUnit(), emUnit(), perUnit()]}
                />

                <SelectControl
                  label={__("Aspect Ratio:", "video-player-block")}
                  labelPosition="left"
                  value={ratio}
                  options={[
                    { label: __("Auto", "video-player-block"), value: "" },
                    { label: "16:9", value: "16:9" },
                    { label: "4:3", value: "4:3" },
                    { label: "1:1", value: "1:1" },
                    { label: "9:16 (Vertical)", value: "9:16" },
                    { label: "21:9", value: "21:9" },
                  ]}
                  onChange={(val) => setAttributes({ ratio: val })}
                />

                <UnitControl
                  label={__("Round Corner:", "video-player-block")}
                  labelPosition="left"
                  value={radius}
                  onChange={(val) => setAttributes({ radius: val })}
                  units={[pxUnit()]}
                />

                {!nativePlayer && (
                  <ColorControl
                    label={__("Accent Color:", "video-player-block")}
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

      <AdvertiseCard planLink={pricingUrl} />
    </InspectorControls>
  );
};
export default Settings;
