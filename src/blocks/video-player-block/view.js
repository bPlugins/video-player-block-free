import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import { getExtension, isYoutube, isVimeo, getYoutubeId, getVimeoId } from './utils/functions';
import { plyrConfig } from './utils/config';
import { prefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const videoEls = document.querySelectorAll(".wp-block-vpbp-video-player-block");
	videoEls.forEach(videoEl => {
		// Safely parse data-attributes; malformed JSON must not crash other players.
		let attributes = {};
		try {
			attributes = JSON.parse( videoEl.dataset.attributes || '{}' );
		} catch ( e ) {
			// eslint-disable-next-line no-console
			console.warn( '[vpbp] Could not parse block attributes', e );
			return;
		}

		createRoot(videoEl).render(<>
			<Style attributes={attributes} id={videoEl.id} />
			<RenderVideo attributes={attributes} />
		</>);

		videoEl?.removeAttribute('data-attributes');
	});
});

const RenderVideo = ({ attributes }) => {
	const { source, poster, muted, autoplay } = attributes;

	const videoEl = useRef(null);

	useEffect(() => {
		// Guard against Plyr not being loaded (CDN failure, ad-blocker, etc.).
		if ( typeof Plyr === 'undefined' ) { // eslint-disable-line no-undef
			// eslint-disable-next-line no-console
			console.warn( '[vpbp] Plyr library not loaded.' );
			return;
		}

		// eslint-disable-next-line no-undef
		const player = new Plyr(videoEl.current, plyrConfig(attributes));

		player.on('ready', () => {
			if (muted && autoplay) {
				player.play();
			}
		});

		return () => {
			try {
				player.destroy();
			} catch (e) {
				/* ignore */
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
				<video controls playsinline data-poster={poster} preload='metadata' {...autoplayProps} {...mutedProps} ref={videoEl}>
					Your browser does not support the video tag.
					<source src={source} type={`video/${getExtension(source) || 'mp4'}`} />
				</video>
			)}
		</div>
	</div>
}