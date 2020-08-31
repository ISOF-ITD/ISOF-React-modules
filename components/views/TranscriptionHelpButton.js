import React from 'react';

import config from './../../../scripts/config.js';

export default class TranscriptionHelpButton extends React.Component {
	constructor(props) {
		super(props);

		this.helpButtonClick = this.helpButtonClick.bind(this);
		//console.log('TranscriptionHelpButton');
	}

	helpButtonClick() {
		if (window.eventBus) {
			//console.log('TranscriptionHelpButton click');
			//console.log(this.props);
			window.eventBus.dispatch('overlay.transcriptionhelp', {
				url: config.siteUrl+'#'+this.props.location.pathname,
				title: this.props.title,
				type: this.props.type,
				appUrl: config.appUrl,
			});
		}
	}

	render() {
		return <button className="feedback-button transcriptionhelp-button" onClick={this.helpButtonClick}>{l('Instruktioner')}</button>;
	}
}