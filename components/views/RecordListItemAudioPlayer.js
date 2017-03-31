import React from 'react';
import config from './../../../scripts/config.js';

export default class RecordListItemAudioPlayer extends React.Component {
	constructor(props) {
		super(props);

		this.playButtonClickHandler = this.playButtonClickHandler.bind(this);
	}

	playButtonClickHandler() {
		if (window.eventBus) {
			window.eventBus.dispatch('audio.play', {
				recordId: this.props.recordId
			});
		}
	}

	render() {
		return <span><button alt="Spela" className="play-button" onClick={this.playButtonClickHandler}></button></span>;
	}
}