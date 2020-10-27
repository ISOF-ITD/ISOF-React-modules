import React from 'react';

import config from './../../../scripts/config.js';

export default class InformationButton extends React.Component {
	constructor(props) {
		super(props);

		this.helpButtonClick = this.helpButtonClick.bind(this);
		//console.log('HelpButton');
	}

	helpButtonClick() {
		if (window.eventBus) {
			//console.log('HelpButton click');
			window.eventBus.dispatch('overlay.information', {
				url: config.siteUrl+'#'+this.props.location.pathname,
				title: this.props.title,
				type: this.props.type,
				appUrl: config.appUrl,
				text: this.props.text,
			});
		}
	}

	render() {
		return <button className="feedback-button help-button on-top-of-map-button" onClick={this.helpButtonClick}>{l('Hjälp')}</button>;
	}
}