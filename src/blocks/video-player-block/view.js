import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import { getExtension, isYoutube, isVimeo, getYoutubeId, getVimeoId } from './utils/functions';
import { plyrConfig } from './utils/config';
import { prefix } from './utils/data';
import { ensurePlyrSprite } from './utils/sprite';

document.addEventListener('DOMContentLoaded', () => {
	ensurePlyrSprite(document);
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
	const { source, poster, muted, autoplay, captions, lazyLoad, youtubeCaptions, vimeoCaptions } = attributes;

	const videoEl = useRef(null);
	const isYT = isYoutube(source);
	const isVM = isVimeo(source);

	useEffect(() => {
		const node = videoEl.current;
		if (!node) return;

		let player = null;
		let observer = null;

		const applyCaptions = () => {
			if (!player) return;
			try {
				if (isYT) {
					if (youtubeCaptions) {
						player.embed?.loadModule?.('captions');
					} else {
						player.embed?.unloadModule?.('captions');
						player.embed?.setOption?.('captions', 'track', {});
					}
				} else if (isVM) {
					if (vimeoCaptions) {
						player.embed?.getTextTracks?.().then?.((tracks) => {
							if (tracks && tracks.length > 0) {
								player.embed.enableTextTrack(tracks[0].language, tracks[0].kind || 'subtitles').catch(() => {});
							}
						}).catch?.(() => {});
					} else {
						player.embed?.disableTextTrack?.().catch?.(() => {});
					}
				}
			} catch (e) {
				/* ignore */
			}
		};

		const init = () => {
			ensurePlyrSprite(node.ownerDocument || document);
			player = new Plyr(node, plyrConfig(attributes));

			player.on('ready', () => {
				if (muted && autoplay) {
					player.play();
				}
				applyCaptions();
				setTimeout(applyCaptions, 500);
			});
			player.on('playing', applyCaptions);
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
	// Only request CORS when there are caption tracks (cross-origin <track> files
	// need it). Setting it unconditionally blocks cross-origin videos whose host
	// doesn't send CORS headers — the video fails to load and never plays.
	const crossOriginProps = captions?.length ? { crossOrigin: 'anonymous' } : {};

	return <div className={prefix}>
		<div className='videoWrapper'>
			{isYT || isVM ? (
				<div
					ref={videoEl}
					data-plyr-provider={isYT ? 'youtube' : 'vimeo'}
					data-plyr-embed-id={isYT ? getYoutubeId(source) : getVimeoId(source)}
					{...(poster ? { 'data-poster': poster } : {})}
				></div>
			) : (
				/* eslint-disable-next-line react/no-unknown-property */
				<video controls playsinline {...crossOriginProps} data-poster={poster} preload='metadata' {...autoplayProps} {...mutedProps} ref={videoEl}>
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