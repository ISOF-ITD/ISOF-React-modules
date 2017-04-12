import React from 'react';
import config from './../../../scripts/config.js';

export default class FeedbackOverlay extends React.Component {
	constructor(props) {
		super(props);

		this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);

		this.messageInputChangeHandler = this.messageInputChangeHandler.bind(this);
		this.nameInputChangeHandler = this.nameInputChangeHandler.bind(this);
		this.emailInputChangeHandler = this.emailInputChangeHandler.bind(this);

		this.state = {
			visible: false,
			messageInputValue: '',
			nameInputValue: '',
			emailInputValue: ''
		};

		if (window.eventBus) {
			window.eventBus.addEventListener('overlay.feedback', function(event) {
				console.log(event.target);
				this.setState({
					visible: true,
					type: event.target.type,
					title: event.target.title,
					url: event.target.url
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

	render() {
		return <div className={'overlay-container'+(this.state.visible ? ' visible' : '')}>
			<div className="overlay-window">
				
				<div className="overlay-header">
					Felanmälning
					<button className="close-button white" onClick={this.closeButtonClickHandler}></button>
				</div>

				<p><strong>Typ: </strong>{this.state.type}</p>
				<p><strong>Titel: </strong>{this.state.title}</p>
				<p><strong>Adress: </strong><a href={this.state.url}>{this.state.url}</a></p>

				<hr/>

				<label>Ditt namn:</label>
				<input className="u-full-width" type="text" value={this.state.nameInputValue} onChange={this.nameInputChangeHandler} />

				<label>Din e-post adress:</label>
				<input className="u-full-width" type="text" value={this.state.emailInputValue} onChange={this.emailInputChangeHandler} />

				<label>Meddelande:</label>
				<textarea className="u-full-width" value={this.state.messageInputValue} onChange={this.messageInputChangeHandler}></textarea>

				<button className="button-primary">Skicka</button>
			</div>
		</div>;
	}
}