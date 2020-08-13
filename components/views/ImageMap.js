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

	UNSAFE_componentWillReceiveProps(props) {
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

		/*		
		Test with leaflet geojson rectangle overlay on image
		OBS: So far no rectangle is shown! Wrong layer config, coordinates, layer order, z-index ..?

		console.log(bounds);
		var geojsonFeature = [{
		    "type": "LineString",
		    "coordinates": [[10, 10], [10, 40], [20, 40], [20, 10]]
		}, {
		    "type": "LineString",
		    "coordinates": [[10, 10], [10, 40], [20, 40], [20, 10]]
		}];

		var myStyle = {
		    "color": "#ff7800",
		    "weight": 5,
		    "opacity": 0.65
		};

		var myLayer = L.geoJSON().addTo(this.map);
		myLayer.addData(geojsonFeature);
		myLayer.setStyle(myStyle);
		console.log('geojson')
		*/		

		this.map.setMaxBounds(bounds);

		this.map.setView([imageHeight, 0], 0);
	}

	render() {
		return <div ref="container" className={'image-map-container'}>
			<div className="map-container" ref="mapView" />
		</div>
	}
}