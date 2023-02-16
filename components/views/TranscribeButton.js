import React from 'react';

import config from './../../../scripts/config.js';

import { getPlaceString } from './../utils/helpers.js';

// Main CSS: /ui-components/feedback-buttons.less";
export default class TranscribeButton extends React.Component {
	constructor(props) {
		super(props);

		this.transcribeButtonClick = this.transcribeButtonClick.bind(this);
	}

	transcribeButtonClick() {
		if (window.eventBus) {
			if (this.props.random) {
				window.eventBus.dispatch('overlay.transcribe', {
					random: true,
				});
			}
			else {
				window.eventBus.dispatch('overlay.transcribe', {
					url: config.siteUrl + '#/records/' + this.props.recordId,
					id: this.props.recordId,
					archiveId: this.props.archiveId,
					title: this.props.title,
					type: this.props.type,
					images: this.props.images,
					transcriptionType: this.props.transcriptionType,
					placeString: getPlaceString(this.props.places),
				});
			}

		}
	}

	render() {
		return <button 
			className={'transcribe-button'+(this.props.className ? ' '+this.props.className : '')}
			// run transcribeButtonClick if onClick is not defined in props
			onClick={this.props.onClick || this.transcribeButtonClick}
			>
				{this.props.label}
			</button>;
	}
}