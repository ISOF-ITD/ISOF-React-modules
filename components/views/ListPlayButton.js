import React from 'react';
import config from './../../../scripts/config.js';

// Main CSS: ui-components/audio-player.less

export default class ListPlayButton extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isPlaying: false
		};

		this.playButtonClickHandler = this.playButtonClickHandler.bind(this);
		this.audioPlayerPlayHandler = this.audioPlayerPlayHandler.bind(this);
		this.audioPlayerStopHandler = this.audioPlayerStopHandler.bind(this);
	}

	audioPlayerPlayHandler() {
		this.setState({
			isPlaying: window.isofAudioPlayer && window.isofAudioPlayer.currentAudio && window.isofAudioPlayer.currentAudio.record == this.props.recordId && window.isofAudioPlayer.currentAudio.media == this.props.media.source && window.isofAudioPlayer.currentAudio.playing
		});
	}

	audioPlayerStopHandler() {
		this.setState({
			isPlaying: window.isofAudioPlayer && window.isofAudioPlayer.currentAudio && window.isofAudioPlayer.currentAudio.record == this.props.recordId && window.isofAudioPlayer.currentAudio.media == this.props.media.source && window.isofAudioPlayer.currentAudio.playing
		});
	}

	componentDidMount() {
		if (window.eventBus) {
			window.eventBus.addEventListener('audio.play', this.audioPlayerPlayHandler);
			window.eventBus.addEventListener('audio.stop', this.audioPlayerStopHandler);
		}

		if (window.isofAudioPlayer && window.isofAudioPlayer.currentAudio && window.isofAudioPlayer.currentAudio.record == this.props.recordId && (this.props.media && window.isofAudioPlayer.currentAudio.media == this.props.media.source) && window.isofAudioPlayer.currentAudio.playing) {
			this.setState({
				isPlaying: true
			});
		}
	}

	componentWillUnmount() {
		if (window.eventBus) {
			window.eventBus.removeEventListener('audio.play', this.audioPlayerPlayHandler);
			window.eventBus.removeEventListener('audio.stop', this.audioPlayerStopHandler);
		}
	}

	playButtonClickHandler(event) {
		if (this.props.disablePlayback) {
			return;
		}
		else {
			event.stopPropagation();
			event.preventDefault();

			if (window.eventBus) {
				if (window.isofAudioPlayer && window.isofAudioPlayer.currentAudio && window.isofAudioPlayer.currentAudio.record == this.props.recordId && window.isofAudioPlayer.currentAudio.media == this.props.media.source && window.isofAudioPlayer.currentAudio.playing) {
					window.eventBus.dispatch('audio.pauseaudio');
				}
				else {
					window.eventBus.dispatch('audio.playaudio', {
						record: {
							id: this.props.recordId,
							title: this.props.recordTitle,
						},
						audio: this.props.media
					});
				}
			}
		}
	}

	render() {
		return <button alt="Spela" className={'play-button'+(this.state.isPlaying ? ' playing' : '')} onClick={this.playButtonClickHandler}></button>;
	}
}