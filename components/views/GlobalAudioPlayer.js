import React from 'react';
import config from './../../../scripts/config.js';

export default class GlobalAudioPlayer extends React.Component {
	constructor(props) {
		super(props);

		if (window.eventBus) {
			window.eventBus.addEventListener('audio.play', function(event) {
				this.playAudio(event.target.audio);
			}.bind(this));
		}
	}

	playAudio(audio) {
		console.log('playAudio: '+config.audioUrl+audio.source);

		if (this.audio) {
			this.audio.pause();

			delete this.audio;
		}

		this.audio = new Audio(config.audioUrl+audio.source);
		this.audio.play();
	}

	render() {
		return <div className="global-audio-player map-floating-control">GlobalAudioPlayer</div>;
	}
}