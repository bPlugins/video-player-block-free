import { useState } from "react";
import { withSelect } from "@wordpress/data";
import { useBlockProps } from "@wordpress/block-editor";
import { useRefEffect } from "@wordpress/compose";
import { MediaPlaceholder } from "../../../../../../bpl-tools/Components";
import Settings from "./Settings/Settings";
import Style from "../Common/Style";
import {
  getExtension,
  isYoutube,
  isVimeo,
  getYoutubeId,
  getVimeoId,
} from "../../utils/functions";
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
    autoHideControl,
  } = attributes;

  const [autoplayProps, setAutoplayProps] = useState(
    autoplay ? { autoplay } : {},
  );
  const [mutedProps, setMutedProps] = useState(muted ? { muted } : {});

  const ref = useRefEffect(
    (element) => {
      if (!source) return;

      let player = null;
      let destroyed = false;
      let pollTimer = null;
      let spriteInterval = null;

      const { ownerDocument } = element;
      const iframeWindow = ownerDocument?.defaultView;

      const initPlyr = () => {
        if (destroyed) return;

        // CRITICAL: Only use the iframe window's Plyr constructor.
        // The parent window's Plyr has `document` closured to the parent
        // document, so controls/events would be created in the wrong
        // document context — they render but clicks don't work.
        const PlyrConstructor = iframeWindow?.Plyr;
        if (!PlyrConstructor) {
          // iframe-init.js hasn't executed yet, poll until ready
          pollTimer = setTimeout(initPlyr, 50);
          return;
        }

        const videoWrapper = element.querySelector(".videoWrapper");
        const videoTemplate = element.querySelector(
          ".videoTemplate .media-source",
        );

        if (!videoWrapper || !videoTemplate) return;

        videoWrapper.innerHTML = "";
        videoWrapper.innerHTML = videoTemplate.outerHTML;

        player = new PlyrConstructor(
          videoWrapper.children[0],
          // CRITICAL: Re-create config in the iframe's object space.
          // Plyr's extend() uses `is.object()` which checks `input.constructor === Object`.
          // Objects created in the parent frame have parent's Object constructor,
          // not the iframe's — so Plyr silently ignores the config and uses defaults.
          // JSON round-trip via the iframe's JSON creates objects with the correct constructor.
          iframeWindow.JSON.parse(
            iframeWindow.JSON.stringify(plyrConfig(attributes)),
          ),
        );

        // Copy SVG sprite from iframe document (where Plyr injected it)
        // or from parent document as fallback
        const copySprite = () => {
          if (ownerDocument.getElementById("sprite-plyr")) return true;
          // Check both iframe and parent for the sprite
          const sprite =
            ownerDocument.getElementById("sprite-plyr") ||
            document.getElementById("sprite-plyr");
          if (sprite && !ownerDocument.getElementById("sprite-plyr")) {
            const cloned = ownerDocument.importNode(sprite, true);
            ownerDocument.body.insertAdjacentElement("afterbegin", cloned);
            return true;
          }
          return false;
        };

        player.on("ready", () => {
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
      };

      // Start initialization (may poll if iframe Plyr isn't ready yet)
      initPlyr();

      autoplay ? setAutoplayProps({ autoplay }) : {};
      muted ? setMutedProps({ muted }) : {};

      return () => {
        destroyed = true;
        if (pollTimer) {
          clearTimeout(pollTimer);
        }
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
  const isPlayerPostType = ["video-player-block"].includes(currentPostType);

  // useEffect(() => {
  //   if (
  //     typeof vpbpPipecheck !== "undefined" &&
  //     !vpbpPipecheck &&
  //     isPlayerPostType &&
  //     !isSetup
  //   ) {
  //     setAttributes({ isSetup: true });
  //   }
  // }, [vpbpPipecheck, isPlayerPostType, isSetup]);

  // if (isPlayerPostType && !isSetup) {
  //   return (
  //     <div>
  //       <FrontShortCode
  //         postType={currentPostType}
  //         shortCode={`[video_player id=${currentPostId}]`}
  //       />
  //     </div>
  //   );
  // }

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
                {isYoutube(source) || isVimeo(source) ? (
                  <div
                    className="media-source"
                    data-plyr-provider={isYoutube(source) ? "youtube" : "vimeo"}
                    data-plyr-embed-id={
                      isYoutube(source)
                        ? getYoutubeId(source)
                        : getVimeoId(source)
                    }></div>
                ) : (
                  /* eslint-disable-next-line react/no-unknown-property */
                  <video
                    className="media-source"
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
                )}
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
