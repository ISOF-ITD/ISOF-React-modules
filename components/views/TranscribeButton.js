import React from 'react';

import config from './../../../scripts/config.js';

// Main CSS: /ui-components/feedback-buttons.less";
export default class TranscribeButton extends React.Component {
	constructor(props) {
		super(props);

		this.transcribeButtonClick = this.transcribeButtonClick.bind(this);
	}

	transcribeButtonClick() {
		if (window.eventBus) {
			window.eventBus.dispatch('overlay.transcribe', {
				url: config.siteUrl+'#records/'+this.props.recordId,
				id: this.props.recordId,
				title: this.props.title,
				type: this.props.type,
				images: this.props.images
			});
		}
	}

	render() {
		return <button className={'transcribe-button'+this.props.className ? ' '+this.props.className : ''} onClick={this.transcribeButtonClick}>{this.props.label}</button>;
	}
}