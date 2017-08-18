import React from 'react';

import L from 'leaflet';
import 'leaflet.markercluster';
import _ from 'underscore';

import MapBase from './MapBase';

import MapCollection from './../collections/MapCollection';
import mapHelper from './../../utils/mapHelper';

export default class SimpleMap extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
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
				this.refs.mapView.map.removeLayer(this.marker);
			}

			this.marker = L.marker([Number(markerData.lat), Number(markerData.lng)], {
				title: markerData.label,
				icon: mapHelper.markerIcon
			});

			this.refs.mapView.map.addLayer(this.marker);

			this.refs.mapView.map.panTo([Number(markerData.lat), Number(markerData.lng)], {
				animate: animateMap
			});
		}
	}

	render() {
		return (
			<MapBase ref="mapView" />
		);
	}
}