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
	return url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
};

export const isVimeo = (url) => {
	if (!url) return null;
	return url.match(/^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/);
};

export const getYoutubeId = (url) => {
	if (!url) return null;
	// The id itself (not just its length) is constrained to YouTube's real
	// charset, so a crafted URL can't make this return a value containing
	// `"`/`<`/etc. if it is ever interpolated unescaped downstream.
	const regExp = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(regExp);
	return match ? match[1] : null;
};

export const getVimeoId = (url) => {
	if (!url) return null;
	const regExp = new RegExp('^.*(vimeo\\.com/)((channels/[^/]+/)|(groups/[^/]+/videos/)|(album/[^/]+/video/))?([0-9]+)');
	const match = url.match(regExp);
	return match ? match[6] : null;
};