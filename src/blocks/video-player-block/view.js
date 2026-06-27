import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import { getExtension, isYoutube, isVimeo, getYoutubeId, getVimeoId } from './utils/functions';
import { plyrConfig } from './utils/config';
import { prefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const videoEls = document.querySelectorAll(
    ".wp-block-vpb-video",
  );
	videoEls.forEach(videoEl => {
		const attributes = JSON.parse(videoEl.dataset.attributes);

		createRoot(videoEl).render(<>
			<Style attributes={attributes} id={videoEl.id} />

			<RenderVideo attributes={attributes} />
		</>);

		videoEl?.removeAttribute('data-attributes')
	});
});

const RenderVideo = ({ attributes }) => {
	const { source, poster, muted, autoplay, captions, lazyLoad } = attributes;

	const videoEl = useRef(null);

	useEffect(() => {
		const node = videoEl.current;
		if (!node) return;

		let player = null;
		let observer = null;

		const init = () => {
			player = new Plyr(node, plyrConfig(attributes));

			player.on('ready', () => {
				if (muted && autoplay) {
					player.play();
				}
			});
		};

		if (lazyLoad && typeof IntersectionObserver !== 'undefined') {
			observer = new IntersectionObserver((entries, obs) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						init();
						obs.disconnect();
					}
				});
			}, { rootMargin: '200px' });
			observer.observe(node);
		} else {
			init();
		}

		return () => {
			if (observer) observer.disconnect();
			if (player) {
				try {
					player.destroy();
				} catch (e) {
					/* ignore */
				}
			}
		};
	}, []);

	const autoplayProps = autoplay ? { autoplay } : {};
	const mutedProps = muted ? { muted } : {};

	const isYT = isYoutube(source);
	const isVM = isVimeo(source);

	return <div className={prefix}>
		<div className='videoWrapper'>
			{isYT || isVM ? (
				<div
					ref={videoEl}
					data-plyr-provider={isYT ? 'youtube' : 'vimeo'}
					data-plyr-embed-id={isYT ? getYoutubeId(source) : getVimeoId(source)}
				></div>
			) : (
				/* eslint-disable-next-line react/no-unknown-property */
				<video controls playsinline crossOrigin='anonymous' data-poster={poster} preload='metadata' {...autoplayProps} {...mutedProps} ref={videoEl}>
					Your browser does not support the video tag.
					<source src={source} type={`video/${getExtension(source) || 'mp4'}`} />
					{captions?.map((cap, index) => cap.src ? (
						<track key={index} kind='captions' src={cap.src} label={cap.label} srcLang={cap.srclang} default={!!cap.default} />
					) : null)}
				</video>
			)}
		</div>
	</div>
}