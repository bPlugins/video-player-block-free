import { prefix } from '../../utils/data';
import { posterFitCss } from '../../utils/posterFit';
import { sanitizeStyleTag } from '../../../../Components/Common/utils/sanitizeStyleTag';

const Style = ({ attributes, id }) => {
	const { width, radius, accentColor, posterFit, posterPosition } = attributes;

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