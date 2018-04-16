import React from 'react';
import { hashHistory } from 'react-router';

// Main CSS: ui-components/popupwindow.less

export default class PopupWindow extends React.Component {
	constructor(props) {
		super(props);

		this.closeButtonClick = this.closeButtonClick.bind(this);

		this.state = {
			windowOpen: false
		};
	}

	closeButtonClick() {
		this.closeWindow();
	}

	closeWindow() {
		this.setState({
			windowOpen: false
		});
		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	openButtonClickHandler() {
		this.openWindow();
	}

	openWindow() {
		this.setState({
			windowOpen: true
		});
	}

	componentDidMount() {
		this.setState({
			windowOpen: this.props.windowOpen
		});
	}

	componentWillReceiveProps(props) {
		if (props.windowOpen && !this.state.windowOpen) {
			this.openWindow();
		}
		else if (!props.windowOpen && this.state.windowOpen) {
			this.closeWindow();
		}
	}

	render() {
		return (
			<div className={'popup-wrapper'+(this.state.windowOpen ? ' visible' : '')}>
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