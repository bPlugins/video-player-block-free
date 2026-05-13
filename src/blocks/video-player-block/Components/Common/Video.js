import { useEffect, useRef } from 'react';
import { plyrConfig } from '../../utils/config';
import { getExtension } from '../../utils/functions';

const Video = ({ attributes }) => {
	const { source, poster, muted } = attributes;

	const videoEl = useRef(null);

	useEffect(() => {
		new Plyr(videoEl.current, plyrConfig(attributes));
	}, []);

	const mutedProps = muted ? { muted } : {};

	// eslint-disable-next-line react/no-unknown-property
	return <video controls playsinline data-poster={poster} preload='metadata' {...mutedProps} ref={videoEl}>
		Your browser does not support the video tag.
		<source src={source} type={`video/${getExtension(source) || 'mp4'}`} />
	</video>
}
export default Video;