import React from 'react';
import config from './../../../scripts/config.js';

export default class ImageOverlay extends React.Component {
	constructor(props) {
		super(props);

		this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);

		this.state = {
			imageUrl: null,
			visible: false
		};

		if (window.eventBus) {
			window.eventBus.addEventListener('overlay.viewimage', function(event) {
				this.setState({
					imageUrl: event.target.imageUrl,
					visible: true
				});
			}.bind(this));
			window.eventBus.addEventListener('overlay.hide', function(event) {
				this.setState({
					visible: false
				});
			}.bind(this));
		}
	}

	closeButtonClickHandler() {
		this.setState({
			visible: false
		});
	}

	render() {
		return <div className={'overlay-container'+(this.state.visible ? ' visible' : '')}>
			<div className="image-overlay">
				<img src={config.imageUrl+this.state.imageUrl} />

				<button className="close-button white" onClick={this.closeButtonClickHandler}></button>
			</div>
		</div>;
	}
}