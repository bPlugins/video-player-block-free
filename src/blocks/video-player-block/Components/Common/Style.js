import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { width, radius, accentColor } = attributes;

	return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
		#${id} .${prefix}{
			width: ${["0px", "0%", "0em"].includes(width) ? "100%" : width};
			${accentColor ? `--plyr-color-main: ${accentColor};` : ""}
		}
		#${id} .${prefix} .plyr,
		#${id} .${prefix} .videoWrapper {
			border-radius: ${radius};
		}
		#${id} .${prefix} .plyr__video-wrapper {
			overflow: hidden !important;
			border-radius: ${radius};
		}
		`.replace(/\s+/g, " "),
      }}
    />
  );
}
export default Style;