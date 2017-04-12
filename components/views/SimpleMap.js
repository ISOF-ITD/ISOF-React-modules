import React from 'react';

import L from 'leaflet';
import 'leaflet.markercluster';
import _ from 'underscore';

import MapCollection from './../collections/MapCollection';
import mapHelper from './../../utils/mapHelper';

export default class SimpleMap extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		var layers = mapHelper.createLayers();

		this.map = L.map(this.refs.mapView, {
			center: [61.5122, 16.7211], 
			zoom: 5,
			minZoom: 3,
			layers: [layers[Object.keys(layers)[0]]],
			scrollWheelZoom: this.props.scrollWheelZoom || false
		});

		L.control.layers(layers).addTo(this.map);

		if (this.props.marker) {
			this.addMarker(this.props.marker);
		}
	}

	componentWillReceiveProps(props) {
		if (props.marker) {
			this.addMarker(props.marker);
		}
	}

	addMarker(markerData) {
		if (markerData && markerData.lat && markerData.lng) {
			var animateMap = this.props.animate;

			if (this.marker) {
				animateMap = true;
				this.map.removeLayer(this.marker);
			}

			this.marker = L.marker([Number(markerData.lat), Number(markerData.lng)], {
				title: markerData.label,
				icon: mapHelper.orangeIcon
			});

			this.map.addLayer(this.marker);

			this.map.panTo([Number(markerData.lat), Number(markerData.lng)], {
				animate: animateMap
			});
		}
	}

	render() {
		return (
			<div className="map-container small" ref="mapView"></div>
		);
	}
}