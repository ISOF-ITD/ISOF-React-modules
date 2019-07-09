import React from 'react';

// Main CSS: ui-components/overlay.less

export default class OverlayWindow extends React.Component {
	constructor(props) {
		//console.log('OverlayWindow constructor');
		super(props);

		this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);

		let showClose = true;
		if (this.props.showClose) {
			let showClose = this.props.showClose;
		}

		this.state = {
			visible: false,
			title: this.props.title,
			showClose: showClose,
			htmlContent: this.props.htmlContent
		};
		//console.log('OverlayWindow constructor this.state.showClose:' + this.state.showClose);
	}

	componentDidMount() {
		//console.log('OverlayWindow didMount');
		window.eventBus.addEventListener('overlay.intro', function(event, data) {
			this.setState({
				visible: true,
				title: data && data.title ? data.title : this.state.title
			});
			//console.log('overlay.intro');
		}.bind(this));

		window.eventBus.addEventListener('overlay.hide', function(event) {
			this.setState({
				visible: false
			});
		}.bind(this));
		//console.log('OverlayWindow didMount end');
	}

	componentWillReceiveProps(props) {
		this.setState({
			title: props.title,
			htmlContent: props.htmlContent
		});
	}

	showWindow() {
		this.setState({
			visible: true
		});
	}

	closeButtonClickHandler() {
		this.setState({
			visible: false
		});
		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	render() {
		//console.log('OverlayWindow render');
		return <div className={'overlay-container light-modal'+(this.state.visible ? ' visible' : '')}>
			<div className="overlay-window medium">
				
				<div className="overlay-header">
					{this.state.title}
					{(this.state.showClose ? '<button className="close-button white" onClick='+(this.closeButtonClickHandler)+'></button> ' : '')} 
				</div>

				<div>
					{
						this.state.htmlContent &&
						<div dangerouslySetInnerHTML={{__html: this.state.htmlContent}} />
					}
					{
						this.props.children
					}
				</div>

			</div>
		</div>;
	}
}