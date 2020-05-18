import React from 'react';

// Main CSS: ui-components/poupwindow.less

export default class RoutePopupWindow extends React.Component {
	constructor(props) {
		super(props);

		this.closeButtonClick = this.closeButtonClick.bind(this);
		this.openButtonClickHandler = this.openButtonClickHandler.bind(this);

		this.languageChangedHandler = this.languageChangedHandler.bind(this);

		this.state = {
			windowOpen: false,
			manualOpen: false
		};
	}

	closeButtonClick() {
		if (this.props.children.props.manuallyOpenPopup) {
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

	languageChangedHandler() {
		this.forceUpdate();
	}

	componentDidMount() {
		if (window.eventBus) {
			window.eventBus.addEventListener('Lang.setCurrentLang', this.languageChangedHandler)
		}
		
		this.setState({
			windowOpen: Boolean(this.props.children) && !this.props.children.props.manuallyOpenPopup
		});
	}

	UNSAFE_componentWillReceiveProps(props) {
		this.setState({
			windowOpen: Boolean(props.children) && !props.children.props.manuallyOpenPopup
		});

		if (!props.children == this.props.children && !this.props.disableAutoScrolling) {
			this.refs.contentWrapper.scrollTo(0, 0);
		}
	}

	componentWillUnmount() {
		if (window.eventBus) {
			window.eventBus.removeEventListener('Lang.setCurrentLang', this.languageChangedHandler)
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
					this.props.children && this.props.children.props.manuallyOpenPopup &&
					<a className="popup-open-button map-floating-control map-bottom-control visible" onClick={this.openButtonClickHandler}><strong>{l(this.props.children.props.openButtonLabel)}</strong></a>
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