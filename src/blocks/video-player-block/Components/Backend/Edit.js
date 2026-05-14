import { useState } from "react";
import { withSelect } from "@wordpress/data";
import { useBlockProps } from "@wordpress/block-editor";
import { useRefEffect } from "@wordpress/compose";
import { MediaPlaceholder } from "../../../../../../bpl-tools/Components";
import Settings from "./Settings/Settings";
import Style from "../Common/Style";
import { getExtension } from "../../utils/functions";
import { plyrConfig } from "../../utils/config";
import { cameraIcon } from "../../utils/icons";
import { prefix } from "../../utils/data";
import { FrontShortCode } from "../../../../Components/Common/FrontShortCode/FrontShortCode";

const Edit = (props) => {
  const {
    attributes,
    setAttributes,
    clientId,
    currentPostId,
    currentPostType,
  } = props;
  const {
    source,
    poster,
    controls,
    repeat,
    autoplay,
    muted,
    resetOnEnd,
    autoHideControl
  } = attributes;

  const [autoplayProps, setAutoplayProps] = useState(
    autoplay ? { autoplay } : {},
  );
  const [mutedProps, setMutedProps] = useState(muted ? { muted } : {});

  /**
   * apiVersion 3 iframe compatibility:
   * - Editor scripts (including Plyr from editorScript) run in the parent window
   * - DOM elements render inside the iframe
   * - Plyr is loaded via editorScript in the parent window
   * - We use parent window's Plyr but copy the SVG sprite into the iframe
   */
  const ref = useRefEffect(
    (element) => {
      if (!source) return;

      let player = null;
      let destroyed = false;

      const { ownerDocument } = element;

      // Use parent window's Plyr (loaded via editorScript, always available)
      // eslint-disable-next-line no-undef
      const PlyrConstructor = typeof Plyr !== "undefined" ? Plyr : null;

      if (!PlyrConstructor || destroyed) return;

      const videoWrapper = element.querySelector(".videoWrapper");
      const videoTemplate = element.querySelector(".videoTemplate video");

      if (!videoWrapper || !videoTemplate) return;

      videoWrapper.innerHTML = "";
      videoWrapper.innerHTML = videoTemplate.outerHTML;

      player = new PlyrConstructor(
        videoWrapper.children[0],
        plyrConfig(attributes),
      );

      // Fix cross-document SVG sprite issue for iframe editor:
      // Plyr loads its SVG sprite from CDN (async) and injects it into parent
      // document.body with id="sprite-plyr". Icon <use> references in the iframe
      // need the sprite in the iframe document to resolve.
      let spriteInterval = null;
      const copySprite = () => {
        const parentSprite = document.getElementById("sprite-plyr");
        if (parentSprite && !ownerDocument.getElementById("sprite-plyr")) {
          const cloned = ownerDocument.importNode(parentSprite, true);
          ownerDocument.body.insertAdjacentElement("afterbegin", cloned);
          return true;
        }
        return !!ownerDocument.getElementById("sprite-plyr");
      };

      player.on("ready", () => {
        // Try immediately, then poll until the async CDN sprite loads
        if (!copySprite()) {
          spriteInterval = setInterval(() => {
            if (copySprite()) {
              clearInterval(spriteInterval);
              spriteInterval = null;
            }
          }, 100);
        }
        if (muted && autoplay) {
          player.play();
        }
      });

      autoplay ? setAutoplayProps({ autoplay }) : {};
      muted ? setMutedProps({ muted }) : {};

      return () => {
        destroyed = true;
        if (spriteInterval) {
          clearInterval(spriteInterval);
        }
        if (player) {
          try {
            player.destroy();
          } catch (e) {
            /* ignore */
          }
        }
      };
    },
    [
      source,
      poster,
      controls,
      repeat,
      autoplay,
      muted,
      resetOnEnd,
      autoHideControl,
    ],
  );

  const id = `${prefix}-${clientId}`;
  const blockProps = useBlockProps({ ref });
  const isPlayerPostType = ["video-player-block"].includes(
    currentPostType,
  );

  return (
    <>
      <Settings attributes={attributes} setAttributes={setAttributes} id={id} />
      <div {...blockProps} id={id}>
        <Style attributes={attributes} id={id} />

        {source ? (
          <>
            {isPlayerPostType && (
              <FrontShortCode
                postType={currentPostType}
                shortCode={`[video_player id=${currentPostId}]`}
              />
            )}

            <div className={prefix}>
              <div className="videoWrapper"></div>

              <div className="videoTemplate" style={{ display: "none" }}>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <video
                  controls
                  playsInline
                  data-poster={poster}
                  preload="metadata"
                  {...autoplayProps}
                  {...mutedProps}>
                  Your browser does not support the video tag.
                  <source
                    src={source}
                    type={`video/${getExtension(source) || "mp4"}`}
                  />
                </video>
              </div>
            </div>
          </>
        ) : (
          <MediaPlaceholder
            type="video"
            onChange={(val) => setAttributes({ source: val.url })}
            icon={cameraIcon}
          />
        )}
      </div>
    </>
  );
};

export default withSelect((select) => {
  const { getCurrentPostId, getCurrentPostType } = select("core/editor");
  return {
    currentPostId:
      getCurrentPostId() || select("core").getEditedPostAttribute("id"),
    currentPostType:
      getCurrentPostType() || select("core").getEditedPostAttribute("type"),
  };
})(Edit);
