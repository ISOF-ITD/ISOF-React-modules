import React from 'react';
import { hashHistory } from 'react-router';

import config from './../../../scripts/config.js';

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
				url: config.siteUrl+'#'+hashHistory.getCurrentLocation().pathname,
				title: this.props.title,
				type: this.props.type,
				appUrl: config.appUrl,
			});
		}
	}

	render() {
		return <button className="help-button" onClick={this.helpButtonClick}>{l('Hjälp')}</button>;
	}
}