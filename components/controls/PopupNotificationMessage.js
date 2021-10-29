import React from 'react';

// Main CSS: ui-components/popup-notification-message.less

export default class PopupNotificationMessage extends React.Component {
	constructor(props) {
		super(props);

		this.popupNotificationReceivedHandler = this.popupNotificationReceivedHandler.bind(this);
		this.popupNotificationCloseHandler = this.popupNotificationCloseHandler.bind(this);

		this.state = {
			message: null,
			visible: false
		};
	}

	componentDidMount() {
		window.eventBus.addEventListener('popup-notification.notify', this.popupNotificationReceivedHandler);
		window.eventBus.addEventListener('screen-clicked', this.popupNotificationCloseHandler);
	}

	// On screen interaction remove message
	popupNotificationCloseHandler() {
		this.setState({
			visible: false
		})
	}

	popupNotificationReceivedHandler(event, message) {
		if (message && message != '') {
			//Longer messages stay visible without timeout: Naive solution to identify message with many lines using line break <br>:  
			if (message.indexOf('<br>') > 0) {
					this.setState({
					message: message,
					visible: true
				})
			} else {
				var setMessage = function() {
					this.setState({
						message: message,
						visible: true
					}, function() {
						this.timeout = setTimeout(function() {
							this.setState({
								visible: false
							});
							this.timeout = null;
						}.bind(this), this.props.duration || 5000);
					}.bind(this));
				}.bind(this);
				if (this.timeout) {
					clearTimeout(this.timeout);

					this.setState({
						visible: false
					}, function() {
						setTimeout(function() {
							setMessage();
						}.bind(this), 600);
					}.bind(this));
				}
				else {
					setMessage();
				}
			}
		}
	}

	render() {
		return <div className={'popup-notification-message'+(this.state.visible ? ' visible' : '')}>
			<div className="message-container" dangerouslySetInnerHTML={{__html: this.state.message}} />
		</div>
	}
}