import React from 'react';
import _ from 'underscore';
import L from 'leaflet';

export default class ImageMap extends React.Component {
	constructor(props) {
		super(props);

		this.imageLoadedHandler = this.imageLoadedHandler.bind(this);

		this.state = {
			initialized: false
		};
	}

	componentDidMount() {
		console.log(this.props);

		if (this.props.image) {
			this.loadImage(this.props.image);
		}
	}

	componentWillReceiveProps(props) {
		if (props.image) {
			this.loadImage(props.image);
		}
	}

	loadImage(url) {
		this.imageEl = new Image();
		this.imageEl.onload = this.imageLoadedHandler;
		this.imageEl.src = url;
	}

	imageLoadedHandler() {
		console.log('imageLoadedHandler');
		console.log(this.imageEl);
		var containerWidth = this.refs.container.clientWidth;
		var containerHeight = this.refs.container.clientWidth;

		var imageWidth = this.imageEl.width;
		var imageHeight = this.imageEl.height;

		this.map = L.map(this.refs.mapView, {
			minZoom: 0,
			maxZoom: 3,
			zoom: 0,
			crs: L.CRS.Simple
		});

		window.map = this.map;

		console.log(containerWidth);

		var factor = containerWidth/imageWidth;
		var bounds = [[0, 0], [imageHeight*factor, imageWidth*factor]];

		var imageOverlay = L.imageOverlay(this.imageEl.src, bounds);
		imageOverlay.addTo(this.map);

		this.map.setMaxBounds(bounds);

		this.map.panTo([imageHeight, 0]);
	}

	render() {
		return <div ref="container" style={{height: 600, marginBottom: 20}} className={'image-map-container'}>
			<div className="map-container" style={{height: 600}} ref="mapView" />
		</div>
	}
}