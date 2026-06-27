import { useEffect, useRef } from 'react';
import { plyrConfig } from '../../utils/config';
import { getExtension } from '../../utils/functions';

const Video = ({ attributes }) => {
	const { source, poster, muted, captions } = attributes;

	const videoEl = useRef(null);



	useEffect(() => {

		new Plyr(videoEl.current, plyrConfig(attributes));
	}, []);

	const mutedProps = muted ? { muted } : {};

	// eslint-disable-next-line react/no-unknown-property
	return <video controls playsinline crossOrigin='anonymous' data-poster={poster} preload='metadata' {...mutedProps} ref={videoEl}>
		Your browser does not support the video tag.
		<source src={source} type={`video/${getExtension(source) || 'mp4'}`} />
		{captions?.map((cap, index) => cap.src ? (
			<track key={index} kind='captions' src={cap.src} label={cap.label} srcLang={cap.srclang} default={!!cap.default} />
		) : null)}
	</video>
}
export default Video;