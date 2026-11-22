import { prefix } from '../../utils/data';
import { plyrPosterCss, posterRatioCss } from '../../utils/posterRatio';
import { sanitizeStyleTag } from '../../../../Components/Common/utils/sanitizeStyleTag';

const Style = ({ attributes, id }) => {
	const { width, radius, accentColor, ratio, posterRatio } = attributes;

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
		${plyrPosterCss(`#${id} .${prefix} `, posterRatio, ratio || '16:9')}
		${posterRatioCss(`#${id} .${prefix} .vpbProviderPlayer__poster-img`, posterRatio, ratio || '16:9')}
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