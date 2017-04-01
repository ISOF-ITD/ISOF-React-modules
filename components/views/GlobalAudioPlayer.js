import React from 'react';
import config from './../../../scripts/config.js';

export default class GlobalAudioPlayer extends React.Component {
	constructor(props) {
		super(props);

		this.audioCanPlayHandler = this.audioCanPlayHandler.bind(this);
		this.audioEndedHandler = this.audioEndedHandler.bind(this);
		this.audioPlayHandler = this.audioPlayHandler.bind(this);
		this.audioPauseHandler = this.audioPauseHandler.bind(this);
		this.togglePlay = this.togglePlay.bind(this);

		this.audio = new Audio();

		this.audio.addEventListener('canplay', this.audioCanPlayHandler);
		this.audio.addEventListener('ended', this.audioEndedHandler);
		this.audio.addEventListener('play', this.audioPlayHandler);
		this.audio.addEventListener('pause', this.audioPauseHandler);

		this.state = {
			audio: null,
			loaded: false,
			playing: false,
			audio: null,
			record: null,
			docked: false
		};

		if (window.eventBus) {
			window.eventBus.addEventListener('audio.play', function(event) {
				this.playAudio(event.target);
			}.bind(this));
/*
			window.eventBus.addEventListener('popup.open', function() {
				this.setState({
					docked: true
				});
			}.bind(this));

			window.eventBus.addEventListener('popup.close', function() {
				this.setState({
					docked: false
				});
			}.bind(this));
*/
		}
	}

	audioCanPlayHandler(event) {
		console.log('audioCanPlayHandler');

		this.setState({
			loaded: true
		});

		this.audio.play();
	}

	audioEndedHandler(event) {
		console.log('audioEndedHandler');
	}

	audioPlayHandler(event) {
		console.log('audioPlayHandler');

		this.setState({
			playing: true
		});
	}

	audioPauseHandler(event) {
		console.log('audioPauseHandler');

		this.setState({
			playing: false
		});
	}

	togglePlay() {
		if (this.state.loaded) {
			if (this.state.playing) {
				this.audio.pause();
			}
			else {
				this.audio.play();
			}
		}
	}

	playAudio(data) {
		console.log('playAudio');
		console.log(data);

		this.setState({
			playing: false,
			audio: data.audio,
			record: data.record
		});

		this.audio.src = config.audioUrl+data.audio.source;
		this.audio.load();
	}

	render() {
		return <div className={'global-audio-player-wrapper map-floating-control map-bottom-control'+(this.state.docked ? ' docked' : '')+(this.state.loaded ? ' visible' : '')}>
			<div className={'global-audio-player'} disabled={!this.state.loaded}>
				<div className="player-content">
					{
						this.state.record &&
						<div className="player-label"><a href={'#record/'+this.state.record.id}>{this.state.record.title}</a></div>
					}
					{
						this.state.audio &&
						<div className="player-label">{this.state.audio.title}</div>
					}
				</div>
				<button className={'play-button large'+(this.state.playing ? ' playing' : '')} onClick={this.togglePlay}></button>
			</div>
		</div>;
	}
}