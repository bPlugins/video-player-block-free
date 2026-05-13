import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { BBlocksAds, HelpPanel, InlineMediaUpload } from '../../../../../../../bpl-tools/Components';
import { pxUnit, perUnit, emUnit } from '../../../../../../../bpl-tools/utils/options';

const Settings = ({ attributes, setAttributes }) => {
	const { source, poster, controls, width, radius, repeat, autoplay, muted, resetOnEnd, autoHideControl } = attributes;
	const { restart, rewind, play, progress, duration, mute, volume, pip, airplay, settings, download, fullscreen } = controls;

	const updateControls = (type, val) => {
		const newControls = { ...controls };
		newControls[type] = val;

		setAttributes({ controls: newControls });
	}

	return <InspectorControls>
		<div className='bPlInspectorInfo'>
			<BBlocksAds />
		</div>

		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={[
			{ name: 'settings', title: __('Settings', 'video-player') },
			{ name: 'controls', title: __('Controls', 'video-player') },
			{ name: 'style', title: __('Style', 'video-player') }
		]}>
			{tab => <>
				{'settings' === tab.name && <>
					<HelpPanel slug='video-player-block' docsLink='https://bblockswp.com/docs/video-player-block' />


					<PanelBody className='bPlPanelBody' title={__('Settings', 'video-player')}>
						<InlineMediaUpload value={source} types={['video']} onChange={val => setAttributes({ source: val })} placeholder={__('Video url', 'video-player')} />

						<InlineMediaUpload value={poster} types={['image']} onChange={val => setAttributes({ poster: val })} placeholder={__('Poster url', 'video-player')} />

						<ToggleControl className='mt20' label={__('Repeat', 'video-player')} checked={repeat} onChange={val => setAttributes({ repeat: val })} />

						<ToggleControl className='mt20' label={__('Autoplay', 'video-player')} checked={autoplay} onChange={val => setAttributes({ autoplay: val })} />
						<small>{__('Autoplay might require muting based on the browser.', 'video-player')}</small>

						<ToggleControl className='mt20' label={__('Muted', 'video-player')} checked={muted} onChange={val => setAttributes({ muted: val })} />

						<ToggleControl className='mt20' label={__('Reset On End', 'video-player')} checked={resetOnEnd} onChange={val => setAttributes({ resetOnEnd: val })} />

						<ToggleControl className='mt20' label={__('Auto Hide Control', 'video-player')} checked={autoHideControl} onChange={val => setAttributes({ autoHideControl: val })} />
					</PanelBody>
				</>}


				{'controls' === tab.name && <PanelBody className='bPlPanelBody'>
					<ToggleControl label={__('Play Large', 'video-player')} checked={controls['play-large']} onChange={val => updateControls('play-large', val)} />

					<ToggleControl className='mt20' label={__('Restart', 'video-player')} checked={restart} onChange={val => updateControls('restart', val)} />

					<ToggleControl className='mt20' label={__('Rewind', 'video-player')} checked={rewind} onChange={val => updateControls('rewind', val)} />

					<ToggleControl className='mt20' label={__('Play', 'video-player')} checked={play} onChange={val => updateControls('play', val)} />

					<ToggleControl className='mt20' label={__('Fast Forward', 'video-player')} checked={controls['fast-forward']} onChange={val => updateControls('fast-forward', val)} />

					<ToggleControl className='mt20' label={__('Progress', 'video-player')} checked={progress} onChange={val => updateControls('progress', val)} />

					<ToggleControl className='mt20' label={__('Current Time', 'video-player')} checked={controls['current-time']} onChange={val => updateControls('current-time', val)} />

					<ToggleControl className='mt20' label={__('Duration', 'video-player')} checked={duration} onChange={val => updateControls('duration', val)} />

					<ToggleControl className='mt20' label={__('Mute', 'video-player')} checked={mute} onChange={val => updateControls('mute', val)} />

					<ToggleControl className='mt20' label={__('Volume', 'video-player')} checked={volume} onChange={val => updateControls('volume', val)} />

					<ToggleControl className='mt20' label={__('PIP', 'video-player')} checked={pip} onChange={val => updateControls('pip', val)} />

					<ToggleControl className='mt20' label={__('Airplay', 'video-player')} checked={airplay} onChange={val => updateControls('airplay', val)} />

					<ToggleControl className='mt20' label={__('Settings', 'video-player')} checked={settings} onChange={val => updateControls('settings', val)} />

					<ToggleControl className='mt20' label={__('Download', 'video-player')} checked={download} onChange={val => updateControls('download', val)} />

					<ToggleControl className='mt20' label={__('Fullscreen', 'video-player')} checked={fullscreen} onChange={val => updateControls('fullscreen', val)} />
				</PanelBody>}


				{'style' === tab.name && <PanelBody className='bPlPanelBody'>
					<UnitControl label={__('Width:', 'video-player')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), emUnit(), perUnit()]} />

					<UnitControl className='mt20' label={__('Round Corner:', 'video-player')} labelPosition='left' value={radius} onChange={val => setAttributes({ radius: val })} units={[pxUnit()]} />
				</PanelBody>}
			</>}
		</TabPanel>
	</InspectorControls>;
};
export default Settings;