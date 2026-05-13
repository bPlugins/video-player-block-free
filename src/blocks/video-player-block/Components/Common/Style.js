import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { width, radius } = attributes;

	return <style dangerouslySetInnerHTML={{
		__html: `
		#${id} .${prefix}{
			width: ${['0px', '0%', '0em'].includes(width) ? '100%' : width};
			border-radius: ${radius};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;