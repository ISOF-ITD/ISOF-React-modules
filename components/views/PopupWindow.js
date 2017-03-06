import React from 'react';
import { hashHistory } from 'react-router';

export default class PopupWindow extends React.Component {
	constructor(props) {
		super(props);

		this.closeButtonClick = this.closeButtonClick.bind(this);

		this.state = {
			windowOpen: false
		};
	}

	closeButtonClick() {
		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			windowOpen: Boolean(props.children)
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
			<div className={'page-content-wrapper'+(this.state.windowOpen ? ' visible' : '')}>
				<div className="page-content">
					<a className="close-button" onClick={this.closeButtonClick}></a>
					{this.props.children}
				</div>
			</div>
		);
	}
}