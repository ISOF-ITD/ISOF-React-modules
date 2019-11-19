import React from 'react';
import config from './../../../scripts/config.js';
import ImageMap from './ImageMap';

// Main CSS: ui-components/overlay.less
// ImageMap CSS: ui-components/image-map.less

export default class TranscriptionOverlay extends React.Component {
	constructor(props) {
		super(props);

		this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);

		this.inputChangeHandler = this.inputChangeHandler.bind(this);

		this.mediaImageClickHandler = this.mediaImageClickHandler.bind(this);

		this.sendButtonClickHandler = this.sendButtonClickHandler.bind(this);

		this.state = {
			visible: false,
			messageInput: '',
			nameInput: '',
			emailInput: '',
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

	mediaImageClickHandler(event) {
		this.setState({
			imageIndex: event.currentTarget.dataset.index
		});
	}

	inputChangeHandler(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	sendButtonClickHandler() {
		console.log(this.state);

		var data = {
			from_email: this.state.emailInput,
			from_name: this.state.nameInput,
			subject: "Sägenkarta: Transkribering",
			message: this.state.title+'\n'+
				this.state.url+'\n\n'+
				'Från: '+this.state.nameInput+' ('+this.state.emailInput+')\n\n'+
				this.state.messageInput
		};

		var formData = new FormData();
		formData.append("json", JSON.stringify(data) );

		fetch(config.restApiUrl+'feedback/', {
			method: "POST",
			body: formData
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
						return <img data-index={index} key={index} className="image-item" data-image={mediaItem.source} onClick={this.mediaImageClickHandler} src={config.imageUrl+mediaItem.source} alt="" />;
					}
				}.bind(this));
			}

			var overlayContent = <div className="row">

				<div className="four columns">
					<p>Transkribera '<a href={this.state.url}>{this.state.title}</a>'.</p>
					<p><a href="https://www.isof.se/om-oss/kartor/sagenkartan/transkribera.html"><strong>Läs mer om att transkribera.</strong></a><br/><br/></p>

					<hr/>

					<label>Transkription:</label>
					<textarea name="messageInput" className="u-full-width" value={this.state.messageInput} onChange={this.inputChangeHandler} style={{height: 380}}></textarea>

					<label>Ditt namn (frivilligt):</label>
					<input name="nameInput" className="u-full-width" type="text" value={this.state.nameInput} onChange={this.inputChangeHandler} />

					<label>Din e-post adress (frivilligt):</label>
					<input name="emailInput" className="u-full-width" type="text" value={this.state.emailInput} onChange={this.inputChangeHandler} />

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
