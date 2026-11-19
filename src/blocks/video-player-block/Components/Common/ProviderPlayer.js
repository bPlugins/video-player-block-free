import { useState } from "react";
import { isYoutube } from "../../utils/functions";
import {
  getProviderEmbedUrl,
  PROVIDER_IFRAME_ALLOW,
  cssAspectRatio,
} from "../../utils/providerPlayer";

/**
 * Front end for "Use YouTube's / Vimeo's own player": the provider's iframe,
 * sized by the block's Aspect Ratio. With a custom poster (and no autoplay)
 * the poster shows first and the video loads, playing, on the first click.
 */
const ProviderPlayer = ({ attributes }) => {
  const { source, poster, autoplay, lazyLoad, ratio } = attributes;
  const showPosterFirst = Boolean(poster) && !autoplay;
  const [started, setStarted] = useState(!showPosterFirst);
  const label = isYoutube(source) ? "YouTube video" : "Vimeo video";

  const src = getProviderEmbedUrl(attributes, { autoplay: showPosterFirst });
  if (!src) return null;

  return (
    <div
      className="vpbProviderPlayer"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: cssAspectRatio(ratio),
        background: "#000",
        overflow: "hidden",
      }}>
      {started ? (
        <iframe
          src={src}
          title={label}
          allow={PROVIDER_IFRAME_ALLOW}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          {...(lazyLoad && !autoplay ? { loading: "lazy" } : {})}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            maxWidth: "none",
            border: 0,
            display: "block",
          }}
        />
      ) : (
        <button
          type="button"
          className="vpbProviderPlayer__poster"
          aria-label={`Play ${label}`}
          onClick={() => setStarted(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            padding: 0,
            border: 0,
            cursor: "pointer",
            background: `#000 center / cover no-repeat url("${String(poster).replace(/"/g, "%22")}")`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <span
            aria-hidden="true"
            style={{
              width: "68px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <span
              style={{
                width: 0,
                height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderLeft: "16px solid #fff",
                marginLeft: "4px",
              }}
            />
          </span>
        </button>
      )}
    </div>
  );
};

export default ProviderPlayer;
