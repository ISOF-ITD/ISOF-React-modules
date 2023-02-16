import React from 'react';
import config from './../../../scripts/config.js';

// FeedbackOverlay support for Feedback but not ContributeInfo. See also ContributeInfoOverlay and FeedbackOverlay.
// Main CSS: ui-components/overlay.less

export default class FeedbackOverlay extends React.Component {
	constructor(props) {
		//console.log('FeedbackOverlay');
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
			messageSent: false
		};

		if (window.eventBus) {
			window.eventBus.addEventListener('overlay.feedback', function(event) {
				//console.log('FeedbackOverlay feedback');
				this.setState({
					visible: true,
					type: event.target.type,
					title: event.target.title,
					country: event.target.country,
					url: event.target.url,
					appUrl: event.target.appUrl,
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
			visible: false,
			messageSent: false,
			messageInputValue: '',
			nameInputValue: '',
			emailInputValue: '',
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
			// subject: this.state.url.split(/[/]+/).pop()+": Felanmälning",
		var subject = this.state.appUrl;
		if (subject.charAt(subject.length - 1) == "/") subject = subject.substr(0, subject.length - 1);
		var data = {
			from_email: this.state.emailInputValue,
			from_name: this.state.nameInputValue,
			subject: subject.split(/[/]+/).pop()+": Feedback",
			message: this.state.type+': '+this.state.title+'\n'+
				this.state.url+'\n\n'+
				'Från: '+this.state.nameInputValue+' ('+this.state.emailInputValue+')\n\n'+
				this.state.messageInputValue
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

	UNSAFE_componentWillReceiveProps() {
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
				<p>{l('Vi återkommer så fort vi kan. Tack.')}</p>
				<p><br/><button className="button-primary" onClick={this.closeButtonClickHandler}>Stäng</button></p>
			</div>;
		}
		else {
			var overlayContent = <div>
				<p>{config.siteOptions.feedbackText || 'Har du frågor eller synpunkter på hur applikationen fungerar? Har du hittat fel, till exempel i avskrifterna? Kontakta oss gärna!'}</p>
				<p>Du är nu på sidan '<a href={this.state.url}>{this.state.title}</a>' men kan också använda formuläret för mer generella förslag och synpunkter.<br/><br/></p>

				<hr/>

				<label htmlFor="feedback_name">Ditt namn:</label>
				<input id="feedback_name" autoComplete="name" className="u-full-width" type="text" value={this.state.nameInputValue} onChange={this.nameInputChangeHandler} />

				<label htmlFor="feedback_email">Din e-post adress:</label>
				<input id="feedback_email" className="u-full-width" type="email" value={this.state.emailInputValue} onChange={this.emailInputChangeHandler} />

				<label htmlFor="feedback_message">Meddelande:</label>
				<textarea lang="sv" id="feedback_message" className="u-full-width" value={this.state.messageInputValue} onChange={this.messageInputChangeHandler}></textarea>

				<button className="button-primary" onClick={this.sendButtonClickHandler}>Skicka</button>
			</div>;
		}

		return <div className={'overlay-container feedback-overlay-container'+(this.state.visible ? ' visible' : '')}>
			<div className="overlay-window">
				
				<div className="overlay-header">
					{l('Frågor och synpunkter')}
					<button title="stäng" className="close-button white" onClick={this.closeButtonClickHandler}></button>
				</div>

				{overlayContent}

			</div>
		</div>;
	}
}