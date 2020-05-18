import React from 'react';

import L from 'leaflet';
import 'leaflet.markercluster';
import _ from 'underscore';

import MapBase from './MapBase';

import MapCollection from './../collections/MapCollection';
import mapHelper from './../../utils/mapHelper';

// Main CSS: ui-components/map.less
//           ui-components/map-ui.less

// Leaflet CSS: leaflet.less
//              MarkerCluster.Default.less

export default class SimpleMap extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.marker) {
			this.addMarker(this.props.marker);
		}
		if (this.props.markers) {
			this.addMarkers(this.props.markers);
		}
	}

	UNSAFE_componentWillReceiveProps(props) {
		if (props.marker) {
			this.addMarker(props.marker);
		}
		if (props.markers) {
			this.addMarkers(props.markers);
		}
	}

	removeMarkers() {
		if (this.markers) {
			_.each(this.markers, function(marker) {
				this.refs.mapView.map.removeLayer(marker);
			}.bind(this));
		}
	}

	addMarkers(markers) {
		this.removeMarkers();

		this.markers = [];

		_.each(markers, function(marker) {
			this.addMarker(marker, true);
		}.bind(this));
	}

	addMarker(markerData, allowMultiple) {
		if (!allowMultiple) {
			this.removeMarkers();
		}

		if (markerData && ((markerData.lat && markerData.lng) || (markerData.location && markerData.location.lat && markerData.location.lon))) {
			var animateMap = this.props.animate;

			if (this.marker && !allowMultiple) {
				animateMap = true;
				this.refs.mapView.map.removeLayer(this.marker);
			}

			var location = Number(markerData.lat) && Number(markerData.lng) ? [Number(markerData.lat), Number(markerData.lng)] :
				(markerData.location && Number(markerData.location.lat) && Number(markerData.location.lon) ? [Number(markerData.location.lat), Number(markerData.location.lon)] : null);

			if (location) {
				var marker = L.marker(location, {
					title: markerData.label || markerData.name || null,
					icon: mapHelper.markerIcon
				});

				if (allowMultiple) {
					this.markers.push(marker);
				}
				else {
					this.marker = marker;
				}

				this.refs.mapView.map.addLayer(marker);

				this.refs.mapView.map.panTo(location, {
					animate: animateMap
				});
			}
		}
	}

	render() {
		return (
			<MapBase ref="mapView" />
		);
	}
}