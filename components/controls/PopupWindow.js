import React from 'react';

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

	UNSAFE_componentWillReceiveProps(props) {
		if (props.windowOpen && !this.state.windowOpen) {
			this.openWindow();
		}
		else if (!props.windowOpen && this.state.windowOpen) {
			this.closeWindow();
		}
	}

	render() {
		return (
			<div tabIndex={-1} className={'popup-wrapper'+(this.state.windowOpen ? ' visible' : '')}>
				<div tabIndex={-1} ref="contentWrapper" className={'popup-content-wrapper'} tabIndex={-1}>
					<div className="page-content">
						<a tabIndex={0} title='stäng' className={'close-button'+(this.props.closeButtonStyle == 'dark' ? '' : this.props.closeButtonStyle == 'white' ? ' white' : ' white')} onClick={this.closeButtonClick}></a>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}