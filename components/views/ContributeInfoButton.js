import React from 'react';
import { hashHistory } from 'react-router';

import config from './../../../scripts/config.js';

export default class ContributeinfoButton extends React.Component {
	constructor(props) {
		super(props);

		this.contributeinfoButtonClick = this.contributeinfoButtonClick.bind(this);
		//console.log('ContributeinfoButton');
	}

	contributeinfoButtonClick() {
		if (window.eventBus) {
			//console.log('ContributeinfoButton Click');
			window.eventBus.dispatch('overlay.contributeinfo', {
				url: config.siteUrl+'#'+hashHistory.getCurrentLocation().pathname,
				title: this.props.title,
				type: this.props.type,
				appUrl: config.appUrl,
			});
		}
	}

	render() {
		return <button className="contributeinfo-button" onClick={this.contributeinfoButtonClick}>{l('Vet du mer?')}</button>;
	}
}