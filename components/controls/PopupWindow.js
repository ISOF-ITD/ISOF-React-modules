import React from 'react';
import { hashHistory } from 'react-router';

export default class PopupWindow extends React.Component {
	constructor(props) {
		super(props);

		this.closeButtonClick = this.closeButtonClick.bind(this);
		this.openButtonClickHandler = this.openButtonClickHandler.bind(this);

		this.state = {
			windowOpen: false,
			manualOpen: false
		};
	}

	closeButtonClick() {
		if (this.props.children.props.route.manuallyOpenPopup) {
			this.setState({
				windowOpen: false,
				manualOpen: false
			});
		}
		else {
			if (this.props.onClose) {
				this.props.onClose();
			}
		}
	}

	openButtonClickHandler() {
		this.setState({
			windowOpen: true,
			manualOpen: true
		});
	}

	componentDidMount() {
		this.setState({
			windowOpen: Boolean(this.props.children) && !this.props.children.props.route.manuallyOpenPopup
		});
	}

	componentWillReceiveProps(props) {
		this.setState({
			windowOpen: Boolean(props.children) && !props.children.props.route.manuallyOpenPopup
		});

		if (!props.children == this.props.children && !this.props.disableAutoScrolling) {
			this.refs.contentWrapper.scrollTo(0, 0);
		}
	}

	componentWillUnmount() {
		if (this.props.onHide) {
			this.props.onHide();
		}
		if (window.eventBus) {
			window.eventBus.dispatch('popup.close');
		}
	}

	render() {
		if (this.state.windowOpen || this.state.manualOpen) {
			if (this.props.onShow) {
				this.props.onShow();
			}
			if (window.eventBus) {
				setTimeout(function() {
					window.eventBus.dispatch('popup.open');
				}.bind(this), 100);
			}
		}
		else {
			if (this.props.onHide) {
				console.log('run onHide');
				this.props.onHide();
			}
			if (window.eventBus) {
				setTimeout(function() {
					window.eventBus.dispatch('popup.close');
				}.bind(this), 100);
			}
		}

		return (
			<div className={'popup-wrapper'+(this.state.windowOpen || this.state.manualOpen ? ' visible' : '')}>
				{
					this.props.children && this.props.children.props.route.manuallyOpenPopup &&
					<a className="popup-open-button map-floating-control map-bottom-control visible" onClick={this.openButtonClickHandler}><strong>{this.props.children.props.route.openButtonLabel}</strong></a>
				}
				<div ref="contentWrapper" className={'popup-content-wrapper'}>
					<div className="page-content">
						<a className={'close-button'+(this.props.closeButtonStyle == 'dark' ? '' : this.props.closeButtonStyle == 'white' ? ' white' : ' white')} onClick={this.closeButtonClick}></a>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}