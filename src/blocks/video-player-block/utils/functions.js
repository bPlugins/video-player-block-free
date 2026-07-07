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
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);
	return (match && match[2].length === 11) ? match[2] : null;
};

export const getVimeoId = (url) => {
	if (!url) return null;
	const regExp = new RegExp('^.*(vimeo\\.com/)((channels/[^/]+/)|(groups/[^/]+/videos/)|(album/[^/]+/video/))?([0-9]+)');
	const match = url.match(regExp);
	return match ? match[6] : null;
};