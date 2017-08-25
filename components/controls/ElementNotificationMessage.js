import React from 'react';

import config from './../../../scripts/config.js';

export default class ElementNotificationMessage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			messageContainerWidth: 0,
			messageContainerHeight: 0,

			elementContainerWidth: 0,
			elementContainerHeight: 0,

			messageVisible: false
		};

		this.messageClickHandler = this.messageClickHandler.bind(this);
	}

	messageClickHandler() {
		this.setState({
			messageVisible: false
		});

		if (this.props.forgetAfterClick) {
			localStorage.setItem(this.props.messageId, 'read');
		}
	}

	show() {
		if (localStorage.getItem(this.props.messageId) != 'read') {
			this.setState({
				messageVisible: true
			});
		}
	}

	componentDidMount() {
		this.setState({
			messageContainerWidth: this.refs.messageContainer.clientWidth,
			messageContainerHeight: this.refs.messageContainer.clientHeight,

			elementContainerWidth: this.refs.elementContainer.offsetWidth,
			elementContainerHeight: this.refs.elementContainer.offsetHeight
		});

		if (this.props.closeTrigger && this.refs.elementContainer.addEventListener) {
			this.refs.elementContainer.addEventListener(this.props.closeTrigger, this.messageClickHandler);
		}

		if (!this.props.manuallyOpen) {
			if (this.props.forgetAfterClick) {
				if (localStorage.getItem(this.props.messageId) != 'read') {
					setTimeout(function() {
						this.setState({
							messageVisible: true
						})
					}.bind(this), 2000);
				}
			}
			else {
				setTimeout(function() {
					this.setState({
						messageVisible: true
					})
				}.bind(this), 2000);
			}
		}

		if (this.props.autoHide) {
			setTimeout(function() {
				this.setState({
					messageVisible: false
				})
			}.bind(this), 15000);
		}
	}

	componentWillUnmount() {
		if (this.props.closeTrigger && this.refs.elementContainer.addEventListener) {
			this.refs.elementContainer.removeEventListener(this.props.closeTrigger, this.messageClickHandler);
		}
	}

	getContainerStyle() {
		var placement = this.props.placement || 'under';

		var styleObj = {};

		if (placement == 'above') {
			styleObj['top'] = -this.state.messageContainerHeight-10+(Number(this.props.placementOffsetY) || 0);
			styleObj['left'] = -(this.state.messageContainerWidth/2)+(this.state.elementContainerWidth/2)+(Number(this.props.placementOffsetX) || 0);
		}
		if (placement == 'under') {
			styleObj['top'] = this.state.elementContainerHeight+10+(Number(this.props.placementOffsetY) || 0);
			styleObj['left'] = -(this.state.messageContainerWidth/2)+(this.state.elementContainerWidth/2)+(Number(this.props.placementOffsetX) || 0);
		}

		return styleObj;
	}

	getArrowStyle() {
		var placement = this.props.placement || 'under';

		var styleObj = {};

		if (placement == 'above') {
			styleObj['top'] = this.state.messageContainerHeight;
			styleObj['left'] = (this.state.messageContainerWidth/2)-5;
		}
		if (placement == 'under') {
			styleObj['top'] = -10;
			styleObj['left'] = (this.state.messageContainerWidth/2)-5;
		}

		return styleObj;
	}

	render() {
		return <div className="element-notification-message">
			<div className="element-container" ref="elementContainer">
				{this.props.children}
			</div>

			<div ref="messageContainer" onClick={this.messageClickHandler} className={'message-container'+(this.state.messageVisible ? ' visible' : '')} style={this.getContainerStyle()}>
				<div className="message">{this.props.message}</div>

				<div className={'arrow arrow-'+(this.props.placement || 'under')} style={this.getArrowStyle()}></div>

				<div className="close-button white"></div>
			</div>
		</div>;
	}
}