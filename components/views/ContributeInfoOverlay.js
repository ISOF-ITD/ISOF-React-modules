import React from 'react';
import config from './../../../scripts/config.js';

// ContributeInfoOverlay support for ContributeInfo but not Feedback. See also ContributeInfoOverlay and FeedbackOverlay.
// Main CSS: ui-components/overlay.less

export default class ContributeinfoOverlay extends React.Component {
	constructor(props) {
		//console.log('ContributeinfoOverlay');
		//debugger;
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
			window.eventBus.addEventListener('overlay.contributeinfo', function(event) {
				this.setState({
					visible: true,
					type: event.target.type,
					title: event.target.title,
					country: event.target.country,
					url: event.target.url,
					appUrl: event.target.appUrl,
					id: event.target.id,
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
			subject: subject.split(/[/]+/).pop()+": ContributeInfo",
			recordid: this.state.id,
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
				<p>{l('Tack för ditt bidrag. Meddelande skickat.')}</p>
				<p><br/><button className="button-primary" onClick={this.closeButtonClickHandler}>Stäng</button></p>
			</div>;
		}
		else {
			var overlayContent = <div>
				<p>{config.siteOptions.contributeInfoText || 'Känner du till någon av personerna som nämns: en upptecknare, någon som intervjuats eller som nämns i en berättelse? Vid 1900-talets början var arkiven framför allt intresserade av berättelserna, inte berättarna. Därför vet vi idag ganska lite om människorna i arkiven. Kontakta oss gärna nedan om du har information om eller fotografier på någon av personerna som nämns på uppteckningen! 					Vill du vara med och bevara minnen och berättelser från vår tid till framtiden? På Institutets webbplats publiceras regelbundet frågelistor om olika ämnen. '}
				<a href="https://www.isof.se/folkminnen/beratta-for-oss.html"><strong>{l('Läs mer.')}</strong></a>
				</p>

				<p>Du är nu på sidan '<a href={this.state.url}>{this.state.title}</a>' men kan också använda formuläret för mer generella förslag och synpunkter.<br/><br/></p>

				<hr/>

				<label htmlFor="contribute_name">Ditt namn:</label>
				<input id="contribute_name" autoComplete="name" className="u-full-width" type="text" value={this.state.nameInputValue} onChange={this.nameInputChangeHandler} />

				<label htmlFor="contribute_email">Din e-post adress:</label>
				<input id="contribute_email" autoComplete="email" className="u-full-width" type="email" value={this.state.emailInputValue} onChange={this.emailInputChangeHandler} />

				<label htmlFor="contribute_message">Meddelande:</label>
				<textarea lang="sv" spellCheck="false" id="contribute_message" className="u-full-width" value={this.state.messageInputValue} onChange={this.messageInputChangeHandler}></textarea>

				<button className="button-primary" onClick={this.sendButtonClickHandler}>Skicka</button>
			</div>;
		}

		return <div className={'overlay-container feedback-overlay-container'+(this.state.visible ? ' visible' : '')}>
			<div className="overlay-window">
				
				<div className="overlay-header">
					{l('Vet du mer?')}
					<button title="stäng" className="close-button white" onClick={this.closeButtonClickHandler}></button>
				</div>

				{overlayContent}

			</div>
		</div>;
	}
}