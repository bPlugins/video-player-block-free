import { prefix } from '../../utils/data';
import { videoFitCss } from '../../utils/videoFit';
import { posterFitCss } from '../../utils/posterFit';
import { sanitizeStyleTag } from '../../../../Components/Common/utils/sanitizeStyleTag';
import { cssSafeAttributes } from '../../../../Components/Common/utils/cssSafeAttributes';

const Style = ({ attributes: rawAttributes, id }) => {
	const attributes = cssSafeAttributes(rawAttributes);
	const { width, radius, accentColor, posterFit, posterPosition, videoFit } = attributes;

	return (
    <style
      dangerouslySetInnerHTML={{
        __html: sanitizeStyleTag(`
		#${id} .${prefix}{
			width: ${["0px", "0%", "0em"].includes(width) ? "100%" : width};
			${accentColor ? `--plyr-color-main: ${accentColor};` : ""}
			border-radius: ${radius};
			overflow: hidden;
		}
		#${id} .${prefix} .plyr,
		#${id} .${prefix} .videoWrapper {
			border-radius: ${radius};
		}
		${videoFitCss(`#${id} .${prefix} `, videoFit)}
		${posterFitCss(`#${id} .${prefix} .plyr__poster, #${id} .${prefix} .vpbProviderPlayer__poster-img`, posterFit, posterPosition)}
		#${id} .${prefix} .plyr__video-wrapper {
			overflow: hidden !important;
			border-radius: ${radius};
		}
		`.replace(/\s+/g, " ")),
      }}
    />
  );
}
export default Style;