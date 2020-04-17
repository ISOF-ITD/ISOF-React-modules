import React from 'react';
import { hashHistory } from 'react-router';

import config from './../../../scripts/config.js';

export default class FeedbackButton extends React.Component {
	constructor(props) {
		super(props);

		this.feedbackButtonClick = this.feedbackButtonClick.bind(this);
		//console.log('FeedbackButton');
	}

	feedbackButtonClick() {
		if (window.eventBus) {
			//console.log('FeedbackButton click');
			window.eventBus.dispatch('overlay.feedback', {
				url: config.siteUrl+'#'+hashHistory.getCurrentLocation().pathname,
				title: this.props.title,
				type: this.props.type,
				appUrl: config.appUrl,
			});
		}
	}

	render() {
		return <button className="feedback-button" onClick={this.feedbackButtonClick}>{l('Frågor och synpunkter')}</button>;
	}
}