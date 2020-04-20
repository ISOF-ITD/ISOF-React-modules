import React from 'react';
import config from './../../../scripts/config.js';

// Main CSS: ui-components/overlay.less

export default class HelpOverlay extends React.Component {
	constructor(props) {
		//console.log('HelpOverlay');
		super(props);

		this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);

		this.state = {
			visible: false,
			messageInputValue: '',
			nameInputValue: '',
			emailInputValue: '',
			messageSent: false
		};

		if (window.eventBus) {
			window.eventBus.addEventListener('overlay.help', function(event) {
				//console.log('HelpOverlay help');
				this.setState({
					visible: true,
					type: event.target.type,
					title: event.target.title,
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
			visible: false
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
			var overlayContent = <div>
				<p>{config.siteOptions.helpText || 'Har du hittat några fel i Sägenkartan? Har du kompletterande information om berättelserna eller personerna som omnämns? Eller vill du hjälpa till med att skriva rent uppteckningar som vi kan lägga ut på Sägenkartan? Kontakta oss gärna!'}</p>
				<p><a href="https://www.isof.se/om-oss/kartor/sagenkartan/transkribera.html"><strong>Läs mer om att transkribera.</strong></a><br/><br/></p>

			</div>;
		}

		return <div className={'overlay-container feedback-overlay-container'+(this.state.visible ? ' visible' : '')}>
			<div className="overlay-window">
				
				<div className="overlay-header">
					{l('Hjälp')}
					<button className="close-button white" onClick={this.closeButtonClickHandler}></button>
				</div>

				{overlayContent}

			</div>
		</div>;
	}
}