import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
  TabPanel,
  PanelBody,
  ToggleControl,
  SelectControl,
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
import Captions from "./Captions";

const Settings = ({ attributes, setAttributes }) => {
  const {
    source,
    poster,
    controls,
    captions: captionTracks,
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
  } = attributes;
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
  } = controls;

  const updateControls = (type, val) => {
    const newControls = { ...controls };
    newControls[type] = val;

    setAttributes({ controls: newControls });
  };

  return (
    <InspectorControls>
      <TabPanel
        className="bPlTabPanel"
        activeClass="activeTab"
        tabs={[
          { name: "settings", title: __("Settings", "video-player-block") },
          { name: "controls", title: __("Controls", "video-player-block") },
          { name: "style", title: __("Style", "video-player-block") },
        ]}>
        {(tab) => (
          <>
            {"settings" === tab.name && (
              <>
                <HelpPanel
                  slug="video-player-block"
                  docsLink="https://bblockswp.com/docs/video-player-block"
                />

                <PanelBody
                  className="bPlPanelBody"
                  title={__("Settings", "video-player-block")}>
                  
                  <h4 style={{ margin: "10px 0", borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>{__("Media Source", "video-player-block")}</h4>
                  <InlineMediaUpload
                    value={source}
                    types={["video"]}
                    onChange={(val) => setAttributes({ source: val })}
                    placeholder={__("Video url", "video-player-block")}
                  />

                  <InlineMediaUpload
                    value={poster}
                    types={["image"]}
                    onChange={(val) => setAttributes({ poster: val })}
                    placeholder={__("Poster url", "video-player-block")}
                  />

                  <h4 style={{ margin: "25px 0 10px", borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>{__("Playback Behavior", "video-player-block")}</h4>
                  <ToggleControl
                    label={__("Autoplay", "video-player-block")}
                    checked={autoplay}
                    onChange={(val) => setAttributes({ autoplay: val })}
                  />
                  <small>
                    {__(
                      "Autoplay might require muting based on the browser.",
                      "video-player-block",
                    )}
                  </small>

                  <ToggleControl
                    className="mt20"
                    label={__("Loop / Repeat", "video-player-block")}
                    checked={repeat}
                    onChange={(val) => setAttributes({ repeat: val })}
                  />

                  <ToggleControl
                    className="mt20"
                    label={__("Reset On End", "video-player-block")}
                    checked={resetOnEnd}
                    onChange={(val) => setAttributes({ resetOnEnd: val })}
                  />

                  <h4 style={{ margin: "25px 0 10px", borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>{__("Player Options", "video-player-block")}</h4>
                  <ToggleControl
                    label={__("Start Muted", "video-player-block")}
                    checked={muted}
                    onChange={(val) => setAttributes({ muted: val })}
                  />

                  <ToggleControl
                    className="mt20"
                    label={__("Auto-Hide Controls", "video-player-block")}
                    checked={autoHideControl}
                    onChange={(val) => setAttributes({ autoHideControl: val })}
                  />

                  <ToggleControl
                    className="mt20"
                    label={__("Lazy Load Player", "video-player-block")}
                    checked={lazyLoad}
                    onChange={(val) => setAttributes({ lazyLoad: val })}
                  />
                  <small>
                    {__(
                      "Defer loading the player until it scrolls into view.",
                      "video-player-block",
                    )}
                  </small>
                </PanelBody>

                <PanelBody
                  className="bPlPanelBody"
                  initialOpen={false}
                  title={__("Captions / Subtitles", "video-player-block")}>
                  <Captions
                    captions={captionTracks}
                    setAttributes={setAttributes}
                  />
                  <small>
                    {__(
                      "Captions apply to self-hosted videos. YouTube and Vimeo use their own.",
                      "video-player-block",
                    )}
                  </small>
                </PanelBody>
              </>
            )}

            {"controls" === tab.name && (
              <PanelBody className="bPlPanelBody">
                <h4 style={{ margin: "10px 0", borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>{__("Playback", "video-player-block")}</h4>
                <ToggleControl
                  label={__("Play Large", "video-player-block")}
                  checked={controls["play-large"]}
                  onChange={(val) => updateControls("play-large", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("Play", "video-player-block")}
                  checked={play}
                  onChange={(val) => updateControls("play", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("Restart", "video-player-block")}
                  checked={restart}
                  onChange={(val) => updateControls("restart", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("Rewind", "video-player-block")}
                  checked={rewind}
                  onChange={(val) => updateControls("rewind", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("Fast Forward", "video-player-block")}
                  checked={controls["fast-forward"]}
                  onChange={(val) => updateControls("fast-forward", val)}
                />

                <h4 style={{ margin: "25px 0 10px", borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>{__("Timeline", "video-player-block")}</h4>
                <ToggleControl
                  label={__("Progress Bar", "video-player-block")}
                  checked={progress}
                  onChange={(val) => updateControls("progress", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("Current Time", "video-player-block")}
                  checked={controls["current-time"]}
                  onChange={(val) => updateControls("current-time", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("Duration", "video-player-block")}
                  checked={duration}
                  onChange={(val) => updateControls("duration", val)}
                />

                <h4 style={{ margin: "25px 0 10px", borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>{__("Audio & Display", "video-player-block")}</h4>
                <ToggleControl
                  label={__("Volume Slider", "video-player-block")}
                  checked={volume}
                  onChange={(val) => updateControls("volume", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("Mute Button", "video-player-block")}
                  checked={mute}
                  onChange={(val) => updateControls("mute", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("Fullscreen", "video-player-block")}
                  checked={fullscreen}
                  onChange={(val) => updateControls("fullscreen", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("PIP (Picture-in-Picture)", "video-player-block")}
                  checked={pip}
                  onChange={(val) => updateControls("pip", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("Airplay", "video-player-block")}
                  checked={airplay}
                  onChange={(val) => updateControls("airplay", val)}
                />

                <h4 style={{ margin: "25px 0 10px", borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>{__("Features", "video-player-block")}</h4>
                <ToggleControl
                  label={__("Captions Toggle", "video-player-block")}
                  checked={controls["captions"]}
                  onChange={(val) => updateControls("captions", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("Settings Menu", "video-player-block")}
                  checked={settings}
                  onChange={(val) => updateControls("settings", val)}
                />
                <ToggleControl
                  className="mt20"
                  label={__("Download Button", "video-player-block")}
                  checked={download}
                  onChange={(val) => updateControls("download", val)}
                />
              </PanelBody>
            )}

            {"style" === tab.name && (
              <PanelBody className="bPlPanelBody">
                <UnitControl
                  label={__("Width:", "video-player-block")}
                  labelPosition="left"
                  value={width}
                  onChange={(val) => setAttributes({ width: val })}
                  units={[pxUnit(), emUnit(), perUnit()]}
                />

                <SelectControl
                  className="mt20"
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
                  className="mt20"
                  label={__("Round Corner:", "video-player-block")}
                  labelPosition="left"
                  value={radius}
                  onChange={(val) => setAttributes({ radius: val })}
                  units={[pxUnit()]}
                />

                <ColorControl
                  className="mt20"
                  label={__("Accent Color:", "video-player-block")}
                  value={accentColor}
                  onChange={(val) => setAttributes({ accentColor: val })}
                />
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
