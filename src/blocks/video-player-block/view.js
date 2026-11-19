import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import { getExtension, isYoutube, isVimeo, getYoutubeId, getVimeoId, getVimeoHash, getYoutubePoster, hideNativeVimeoCaptions } from './utils/functions';
import { plyrConfig } from './utils/config';
import { prefix } from './utils/data';
import { ensurePlyrSprite } from './utils/sprite';
import { convertSrtTracks } from './utils/srt';
import ProviderPlayer from './Components/Common/ProviderPlayer';
import { usesProviderPlayer } from './utils/providerPlayer';

const mountPlayers = () => {
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
};

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
		let cancelled = false;
		// Once the visitor uses the CC button or the Captions menu, their choice wins:
		// the "playing" hook below used to switch Vimeo back on, in the first
		// language of the list, every time the video started again.
		let userTouched = false;

		// The track in the visitor's browser language, else the first one. Always
		// taking the first gave e.g. German subtitles on an English site.
		const pickTrack = (tracks) => {
			const nav = typeof navigator !== 'undefined' ? navigator : {};
			const langs = (nav.languages && nav.languages.length ? nav.languages : [nav.language || ''])
				.map((l) => String(l).toLowerCase().split('-')[0])
				.filter(Boolean);
			for (const lang of langs) {
				const match = tracks.find((t) => String(t?.language || '').toLowerCase().split('-')[0] === lang);
				if (match) return match;
			}
			return tracks[0];
		};

		const applyCaptions = () => {
			if (!player || userTouched) return;
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
								const track = pickTrack(tracks);
								player.embed.enableTextTrack(track.language, track.kind || 'subtitles').catch(() => {});
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

		const init = async () => {
			ensurePlyrSprite(node.ownerDocument || document);
			// No custom poster: pin the current YouTube thumbnail (same as the
			// editor) instead of leaving it to the embed, which can show a stale frame.
			if (isYT && !poster) {
				const ytPoster = await getYoutubePoster(getYoutubeId(source));
				if (cancelled) return;
				if (ytPoster) node.setAttribute('data-poster', ytPoster);
			}
			if (!isYT && !isVM && captions?.length) {
				await convertSrtTracks(node);
				if (cancelled) return;
			}
			player = new Plyr(node, plyrConfig(attributes));

			player.elements?.container?.addEventListener('click', (e) => {
				if (e.target?.closest?.('[data-plyr="captions"], [data-plyr="language"]')) userTouched = true;
			}, true);

			player.on('ready', () => {
				if (isVM) hideNativeVimeoCaptions(player);
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
			cancelled = true;
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

	// "Use YouTube's / Vimeo's own player": no Plyr, the provider's player as is.
	// (The effect above finds no node and does nothing.)
	if (usesProviderPlayer(attributes)) {
		return <div className={prefix}>
			<div className='videoWrapper'>
				<ProviderPlayer attributes={attributes} />
			</div>
		</div>;
	}

	return <div className={prefix}>
		<div className='videoWrapper'>
			{isYT || isVM ? (
				<div
					ref={videoEl}
					data-plyr-provider={isYT ? 'youtube' : 'vimeo'}
					data-plyr-embed-id={isYT ? getYoutubeId(source) : getVimeoId(source)}
					{...(isVM && getVimeoHash(source) ? { 'data-plyr-embed-hash': getVimeoHash(source) } : {})}
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

/*
 * Performance plugins that delay JavaScript (WP Rocket, LiteSpeed, Perfmatters)
 * can run this after DOMContentLoaded has already fired; listening for it alone
 * left the player empty on those sites. Kept at the end of the file so
 * RenderVideo above is defined when this runs straight away.
 */
if ('loading' === document.readyState) {
	document.addEventListener('DOMContentLoaded', mountPlayers);
} else {
	mountPlayers();
}
