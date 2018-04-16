import React from 'react';
import _ from 'underscore';
import L from 'leaflet';

// Main CSS: ui-components/image-map.less

export default class ImageMap extends React.Component {
	constructor(props) {
		super(props);

		this.imageLoadedHandler = this.imageLoadedHandler.bind(this);

		this.state = {
			initialized: false
		};
	}

	componentDidMount() {
		this.map = L.map(this.refs.mapView, {
			minZoom: 0,
			maxZoom: this.props.maxZoom || 3,
			zoom: 0,
			crs: L.CRS.Simple
		});

		if (this.props.image) {
			this.loadImage(this.props.image);
		}
	}

	componentWillReceiveProps(props) {
		if (props.image && props.image != this.props.image) {
			this.loadImage(props.image);
		}
	}

	loadImage(url) {
		if (this.imageOverlay) {
			this.map.removeLayer(this.imageOverlay);
		}

		this.imageEl = new Image();
		this.imageEl.onload = this.imageLoadedHandler;
		this.imageEl.src = url;
	}

	imageLoadedHandler() {
		var containerWidth = this.refs.container.clientWidth;
		var containerHeight = this.refs.container.clientWidth;

		var imageWidth = this.imageEl.width;
		var imageHeight = this.imageEl.height;

		var factor = containerWidth/imageWidth;
		var bounds = [[0, 0], [imageHeight*factor, imageWidth*factor]];

		if (this.imageOverlay) {
			this.map.removeLayer(this.imageOverlay);
		}

		this.imageOverlay = L.imageOverlay(this.imageEl.src, bounds);
		this.imageOverlay.addTo(this.map);

		this.map.setMaxBounds(bounds);

		this.map.setView([imageHeight, 0], 0);
	}

	render() {
		return <div ref="container" className={'image-map-container'}>
			<div className="map-container" ref="mapView" />
		</div>
	}
}