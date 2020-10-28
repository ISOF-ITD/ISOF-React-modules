import React from 'react';

import config from './../../../scripts/config.js';

// Main CSS: /ui-components/feedback-buttons.less";
export default class HelpButton extends React.Component {
	constructor(props) {
		super(props);

		this.helpButtonClick = this.helpButtonClick.bind(this);
		//console.log('HelpButton');
	}

	helpButtonClick() {
		if (window.eventBus) {
			//console.log('HelpButton click');
			window.eventBus.dispatch('overlay.help', {
				url: config.siteUrl+'#'+this.props.location.pathname,
				title: this.props.title,
				type: this.props.type,
				appUrl: config.appUrl,
			});
		}
	}

	render() {
		return <button className="feedback-button help-button" onClick={this.helpButtonClick}>{l('Hjälp')}</button>;
	}
}