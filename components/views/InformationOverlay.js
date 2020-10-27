import React from 'react';
import config from './../../../scripts/config.js';

// Help support for both ContributeInfo and Feedback. See also HelpOverlay, ContributeInfoOverlay and FeedbackOverlay.
// Similar to HelpOverlay but without dependency to config.js of app.js. 
// The instanciating component InformationButton has property text instead.
// Main CSS: ui-components/overlay.less

export default class InformationOverlay extends React.Component {
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
			window.eventBus.addEventListener('overlay.information', function(event) {
				//console.log('HelpOverlay help');
				this.setState({
					visible: true,
					type: event.target.type,
					title: event.target.title,
					url: event.target.url,
					appUrl: event.target.appUrl,
					text: event.target.text,
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
		var title = 'Hjälp';
		if (this.state.title) {
			var title = this.state.title;
		}

		if (this.state.text) {
			var overlayContent = <div>
				<p dangerouslySetInnerHTML={{__html: this.state.text}} />
			</div>;
		}

		return <div className={'overlay-container feedback-overlay-container'+(this.state.visible ? ' visible' : '')}>
			<div className="overlay-window">
				
				<div className="overlay-header">
					{l(title)}
					<button title="stäng" className="close-button white" onClick={this.closeButtonClickHandler}></button>
				</div>

				{overlayContent}

			</div>
		</div>;
	}
}