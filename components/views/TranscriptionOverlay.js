import React from 'react';
import config from './../../../scripts/config.js';
import ImageMap from './ImageMap';

export default class TranscriptionOverlay extends React.Component {
	constructor(props) {
		super(props);

		this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);

		this.messageInputChangeHandler = this.messageInputChangeHandler.bind(this);
		this.nameInputChangeHandler = this.nameInputChangeHandler.bind(this);
		this.emailInputChangeHandler = this.emailInputChangeHandler.bind(this);

		this.sendButtonClickHandler = this.sendButtonClickHandler.bind(this);

		this.state = {
			visible: false,
			messageInputValue: '',
			nameInputValue: '',
			emailInputValue: '',
			messageSent: false,
			currentImage: null
		};

		if (window.eventBus) {
			window.eventBus.addEventListener('overlay.transcribe', function(event) {
				this.setState({
					visible: true,
					type: event.target.type,
					title: event.target.title,
					url: event.target.url,
					images: event.target.images,
					imageIndex: 0
				});
			}.bind(this));
			window.eventBus.addEventListener('overlay.hide', function(event) {
				this.setState({
					visible: false
				});
			}.bind(this));
		}
	}

	closeButtonClickHandler() {
		this.setState({
			visible: false
		});
	}

	messageInputChangeHandler(event) {
		this.setState({
			messageInputValue: event.target.value
		});
	}

	nameInputChangeHandler(event) {
		this.setState({
			nameInputValue: event.target.value
		});
	}

	emailInputChangeHandler(event) {
		this.setState({
			emailInputValue: event.target.value
		});
	}

	sendButtonClickHandler() {
		return;
		
		var data = {
			from_email: this.state.emailInputValue,
			from_name: this.state.nameInputValue,
			subject: "Sägenkarta: Felanmälning",
			message: this.state.type+': '+this.state.title+'\n'+
				this.state.url+'\n\n'+
				'Från: '+this.state.nameInputValue+' ('+this.state.emailInputValue+')\n\n'+
				this.state.messageInputValue
		};

		fetch(config.apiUrl+'feedback', {
			method: "POST",
			body: JSON.stringify(data)
		})
		.then(function(response) {
			return response.json()
		}).then(function(json) {
			if (json.success) {
				this.setState({
					messageSent: true
				})
			}
		}.bind(this));
	}

	componentWillReceiveProps() {
		this.setState({
			messageSent: false,
			emailInputValue: '',
			nameInputValue: '',
			messageInputValue: ''
		});
	}

	render() {
		console.log(this.state);

		if (this.state.messageSent) {
			var overlayContent = <div>
				<p>Meddelande skickat. Tack.</p>
				<p><br/><button className="button-primary" onClick={this.closeButtonClickHandler}>Stäng</button></p>
			</div>;
		}
		else {
			if (this.state.images && this.state.images.length > 0) {
				var imageItems = this.state.images.map(function(mediaItem, index) {
					if (mediaItem.source.indexOf('.pdf') == -1) {
						return <img style={{maxWidth: 100}} key={index} className="archive-image" data-image={mediaItem.source} onClick={this.mediaImageClickHandler} src={config.imageUrl+mediaItem.source} alt="" />;
					}
				}.bind(this));
			}

			var overlayContent = <div className="row">

				<div className="four columns">
					<p>Transkribera '<a href={this.state.url}>{this.state.title}</a>'.<br/><br/></p>

					<hr/>

					<label>Ditt namn:</label>
					<input className="u-full-width" type="text" value={this.state.nameInputValue} onChange={this.nameInputChangeHandler} />

					<label>Din e-post adress:</label>
					<input className="u-full-width" type="text" value={this.state.emailInputValue} onChange={this.emailInputChangeHandler} />

					<label>Transkription:</label>
					<textarea className="u-full-width" value={this.state.messageInputValue} onChange={this.messageInputChangeHandler} style={{height: 380}}></textarea>

					<button className="button-primary" onClick={this.sendButtonClickHandler}>Skicka</button>
				</div>

				<div className="eight columns">

					<ImageMap image={this.state.images ? config.imageUrl+this.state.images[this.state.imageIndex].source : null} />

					<div className="image-list">
						{imageItems}
					</div>
				</div>

			</div>;
		}

		return <div className={'overlay-container'+(this.state.visible ? ' visible' : '')}>
			<div className="overlay-window large">
				
				<div className="overlay-header">
					Transkribera
					<button className="close-button white" onClick={this.closeButtonClickHandler}></button>
				</div>

				{overlayContent}

			</div>
		</div>;
	}
}