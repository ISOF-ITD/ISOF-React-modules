import React from 'react';

import config from './../../../scripts/config.js';

export default class ContributeInfoButton extends React.Component {
	constructor(props) {
		super(props);

		this.contributeinfoButtonClick = this.contributeinfoButtonClick.bind(this);
		//console.log('ContributeInfoButton');
	}

	contributeinfoButtonClick() {
		if (window.eventBus) {
			window.eventBus.dispatch('overlay.contributeinfo', {
				url: config.siteUrl+'#'+this.props.location.pathname,
				title: this.props.title,
				type: this.props.type,
				country: this.props.country,
				appUrl: config.appUrl,
			});
		}
	}

	render() {
		return <button className="feedback-button contributeinfo-button" onClick={this.contributeinfoButtonClick}>{l('Vet du mer?')}</button>;
	}
}