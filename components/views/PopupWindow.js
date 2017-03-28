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

	componentWillReceiveProps(props) {
		this.setState({
			windowOpen: Boolean(props.children) && !props.children.props.route.manuallyOpenPopup
		});
	}

	componentWillUnmount() {
		if (this.props.onHide) {
			this.props.onHide();
		}
	}

	render() {
		if (this.state.windowOpen) {
			if (this.props.onShow) {
				this.props.onShow();
			}
		}
		else {
			if (this.props.onHide) {
				this.props.onHide();
			}
		}

		return (
			<div className={'popup-wrapper'+(this.state.windowOpen || this.state.manualOpen ? ' visible' : '')}>
				{
					this.props.children && this.props.children.props.route.manuallyOpenPopup &&
					<a className="popup-open-button map-floating-control visible" onClick={this.openButtonClickHandler}><strong>{this.props.children.props.route.openButtonLabel}</strong></a>
				}
				<div className={'popup-content-wrapper'}>
					<div className="page-content">
						<a className="close-button" onClick={this.closeButtonClick}></a>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}