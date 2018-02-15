import React from 'react';
import config from './../../../scripts/config.js';

export default class GlobalAudioPlayer extends React.Component {
	constructor(props) {
		super(props);

		window.isofAudioPlayer = {
			player: this,
			currentAudio: {
				record: null,
				media: null,
				playing: false,
				paused: false
			}
		};

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
			paused: false,
			audio: null,
			record: null,
			durationTime: '',
			currentTime: ''
		};

		if (window.eventBus) {
			window.eventBus.addEventListener('audio.playaudio', function(event) {
				this.playAudio(event.target);
			}.bind(this));
			window.eventBus.addEventListener('audio.pauseaudio', function(event) {
				this.pauseAudio();
			}.bind(this));
		}
	}

	msToTimeStr(ms) {
		var minutes = Math.floor(ms / 60000);
		var seconds = ((ms % 60000) / 1000).toFixed(0);
		return (minutes < 10 ? '0' : '')+minutes+":"+(seconds < 10 ? '0' : '')+seconds;
	}

	audioCanPlayHandler(event) {
		this.setState({
			loaded: true
		});

		if (window.eventBus) {
			window.eventBus.dispatch('audio.playervisible');
		}

		this.audio.play();

		this.durationInterval = setInterval(function() {
			this.setState({
				currentTime: this.msToTimeStr(this.audio.currentTime*1000),
				durationTime: this.msToTimeStr(this.audio.duration*1000)
			});
		}.bind(this), 1000);
	}

	audioEndedHandler(event) {
		isofAudioPlayer.currentAudio.playing = false;
		isofAudioPlayer.currentAudio.paused = false;

		if (window.eventBus) {
			window.eventBus.dispatch('audio.stop', {
				paused: false
			});
		}

		this.setState({
			paused: false,
			playing: false
		});

		clearInterval(this.durationInterval);
	}

	audioPlayHandler(event) {
		isofAudioPlayer.currentAudio.playing = true;
		isofAudioPlayer.currentAudio.paused = false;

		if (window.eventBus) {
			window.eventBus.dispatch('audio.play');
		}		

		this.setState({
			playing: true,
			paused: false
		});
	}

	audioPauseHandler(event) {
		isofAudioPlayer.currentAudio.playing = false;
		isofAudioPlayer.currentAudio.paused = true;

		if (window.eventBus) {
			window.eventBus.dispatch('audio.stop', {
				paused: true
			});
		}		

		this.setState({
			playing: false,
			paused: true
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

	pauseAudio() {
		if (this.state.loaded && this.state.playing) {
			this.audio.pause();
		}
	}

	resumeAudio() {
		if (this.state.loaded && this.state.paused) {
			this.audio.play();
		}
	}

	playAudio(data) {
		if (isofAudioPlayer.currentAudio.record == data.record.id && isofAudioPlayer.currentAudio.media == data.audio.source && this.state.paused) {
			this.resumeAudio();
		}
		else {
			isofAudioPlayer.currentAudio.record = data.record.id;
			isofAudioPlayer.currentAudio.media = data.audio.source;

			this.setState({
				playing: false,
				audio: data.audio,
				record: data.record
			});

			this.audio.src = config.audioUrl+data.audio.source;
			this.audio.load();
		}
	}

	render() {
		return <div className={'global-audio-player-wrapper map-bottom-control'+(this.state.loaded ? ' visible' : '')}>
			<div className={'global-audio-player'} disabled={!this.state.loaded}>

				<div className="player-time">
					{this.state.currentTime}
				</div>

				<div className="player-content">
					{
						this.state.record &&
						<div className="player-label"><a href={'#record/'+this.state.record.id}>{this.state.record.title}</a></div>
					}
					{
						this.state.audio &&
						<div className="player-label">{this.state.record.title != this.state.audio.title ? this.state.audio.title : this.state.audio.source}</div>
					}
				</div>

				<button className={'play-button large'+(this.state.playing ? ' playing' : '')} onClick={this.togglePlay}></button>

			</div>
		</div>;
	}
}