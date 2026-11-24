export const controlsHandler = (controls) => {
	const newControls = [];
	Object.keys(controls).map(item => {
		if (controls[item]) {
			newControls.push(item);
		}
	});
	return newControls;
};

export const getExtension = (fileName) => fileName ? fileName.substring(fileName.lastIndexOf('.') + 1) : '';

export const isYoutube = (url) => {
	if (!url) return null;
	return url.match(/^(https?:\/\/)?([\w-]+\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/i);
};

// vimeo.com and the player.vimeo.com/video/ID embed link.
export const isVimeo = (url) => {
	if (!url) return null;
	return url.match(/^(https?:\/\/)?([\w-]+\.)?(vimeo\.com)\/.+$/i);
};

export const getYoutubeId = (url) => {
	if (!url) return null;
	// The id itself (not just its length) is constrained to YouTube's real
	// charset, so a crafted URL can't make this return a value containing
	// `"`/`<`/etc. if it is ever interpolated unescaped downstream.
	// /shorts/ID and /live/ID links used to give no id at all ("Invalid video id").
	const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:(?:shorts|live|v|e(?:mbed)?)\/|[^/\n\s]+\/\S+\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(regExp);
	return match ? match[1] : null;
};

// vimeo.com/ID, vimeo.com/ID/HASH, player.vimeo.com/video/ID, and the
// channels/, groups/.../videos/, album/.../video/ and showcase/.../video/ forms.
// Only digits can come back, so the id is still safe to interpolate.
export const getVimeoId = (url) => {
	if (!url) return null;
	// An explicit .../video/ID or .../videos/ID wins (album and showcase links
	// carry their own number first); otherwise the first all-digit segment.
	const match = url.match(/vimeo\.com\/(?:[^?#]*\/)?videos?\/(\d+)(?=[/?#]|$)/i) ||
		url.match(/vimeo\.com\/(?:[^?#]*?\/)?(\d+)(?=[/?#]|$)/i);
	return match ? match[1] : null;
};

// The privacy hash of an unlisted Vimeo video (vimeo.com/ID/HASH or ?h=HASH).
// Without it Vimeo refuses to play an unlisted video. Hex only.
export const getVimeoHash = (url) => {
	if (!url) return null;
	const match = url.match(/vimeo\.com\/(?:video\/)?\d+\/([0-9a-f]+)(?=[/?#]|$)/i) || url.match(/vimeo\.com\/.*[?&]h=([0-9a-f]+)/i);
	return match ? match[1] : null;
};

/**
 * Plyr draws Vimeo captions itself (from Vimeo's cuechange). Vimeo drew them
 * too, inside its iframe, so every line showed twice, and after "Disabled"
 * Vimeo's copy could stay frozen on screen. Every track switch (Plyr's and
 * ours) goes through enableTextTrack, so make it always ask Vimeo for a hidden
 * track: cuechange still fires and only Plyr's caption is shown.
 */
export const hideNativeVimeoCaptions = (player) => {
	const embed = player?.embed;
	if (!embed || typeof embed.enableTextTrack !== 'function' || embed.vpbHiddenTracks) return;
	const enableTextTrack = embed.enableTextTrack.bind(embed);
	embed.enableTextTrack = (language, kind) => enableTextTrack(language, kind, false);
	embed.vpbHiddenTracks = true;
};
/**
 * Best available YouTube thumbnail for a video id, picked in the same order as
 * Plyr (which draws the poster in the editor), so the editor and the front end
 * show the same image: maxresdefault, then sddefault, then hqdefault. YouTube
 * answers a missing size with a 120px placeholder, so that counts as missing.
 */
export const getYoutubePoster = (id) => new Promise((resolve) => {
	if (!id) return resolve('');
	const base = `https://i.ytimg.com/vi/${id}/`;
	const sizes = ['maxres', 'sd'];
	const next = () => {
		if (!sizes.length) return resolve(`${base}hqdefault.jpg`);
		const src = `${base}${sizes.shift()}default.jpg`;
		const img = new Image();
		img.onload = () => (img.naturalWidth > 120 ? resolve(src) : next());
		img.onerror = next;
		img.src = src;
	};
	next();
});
