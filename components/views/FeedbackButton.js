import React from 'react';

import config from './../../../scripts/config.js';

// Main CSS: /ui-components/feedback-buttons.less";
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
				url: config.siteUrl+'#'+this.props.location.pathname,
				title: this.props.title,
				type: this.props.type,
				country: this.props.country,
				appUrl: config.appUrl,
			});
		}
	}

	render() {
		return <button className="feedback-button" onClick={this.feedbackButtonClick}>{l('Frågor och synpunkter')}</button>;
	}
}