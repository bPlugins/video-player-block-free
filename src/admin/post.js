import './post.scss';

window.copyBPlAdminShortcode = id => {
	var input = document.querySelector('#bPlAdminShortcode-' + id + ' input');
	var tooltip = document.querySelector('#bPlAdminShortcode-' + id + ' .tooltip');
	input.select();
	input.setSelectionRange(0, 30);
	document.execCommand('copy');
	tooltip.innerHTML = wp.i18n.__('Copied Successfully!', 'video-player-block');
	setTimeout(() => {
		tooltip.innerHTML = wp.i18n.__('Copy To Clipboard', 'video-player-block');
	}, 1500);
}