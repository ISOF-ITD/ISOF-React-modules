import React from 'react';

export default class OverlayWindow extends React.Component {
	constructor(props) {
		super(props);

		this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);

		this.state = {
			visible: false,
			title: this.props.title,
			htmlContent: this.props.htmlContent
		};
	}

	componentDidMount() {
		window.eventBus.addEventListener('overlay.intro', function(event, data) {
			this.setState({
				visible: true,
				title: data && data.title ? data.title : this.state.title
			});
		}.bind(this));

		window.eventBus.addEventListener('overlay.hide', function(event) {
			this.setState({
				visible: false
			});
		}.bind(this));
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
		return <div className={'overlay-container light-modal'+(this.state.visible ? ' visible' : '')}>
			<div className="overlay-window medium">
				
				<div className="overlay-header">
					{this.state.title}
					<button className="close-button white" onClick={this.closeButtonClickHandler}></button>
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