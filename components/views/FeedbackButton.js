import React from 'react';
import { hashHistory } from 'react-router';

import config from './../../../scripts/config.js';

export default class FeedbackButton extends React.Component {
	constructor(props) {
		super(props);

		this.feedbackButtonClick = this.feedbackButtonClick.bind(this);
	}

	feedbackButtonClick() {
		if (window.eventBus) {
			window.eventBus.dispatch('overlay.feedback', {
				url: config.siteUrl+'#'+hashHistory.getCurrentLocation().pathname,
				title: this.props.title,
				type: this.props.type
			});
		}
	}

	render() {
		return <button className="feedback-button" onClick={this.feedbackButtonClick}>Felanmälning</button>;
	}
}