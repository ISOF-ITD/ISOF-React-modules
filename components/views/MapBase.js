import React from 'react';

import L from 'leaflet';
import 'leaflet.markercluster';

import mapHelper from './../../utils/mapHelper';

export default class MapBase extends React.Component {

	constructor(props) {
		super(props);

		console.log('MapBase');
	}

	componentDidMount() {
		var layers = mapHelper.createLayers();

		this.map = L.map(this.refs.mapView, {
			crs: mapHelper.getSweref99crs(),
			center: [61.5122, 16.7211], 
			zoom: 5,
			minZoom: 2,
			maxZoom: 13,
			layers: [layers[Object.keys(layers)[0]]],
			scrollWheelZoom: this.props.scrollWheelZoom || false
		});

		L.control.layers(layers, null, {
			position: this.props.layersControlPosition || 'topright'
		}).addTo(this.map);

		this.map.on('baselayerchange', this.mapBaseLayerChangeHandler.bind(this));
	}

	mapBaseLayerChangeHandler(event) {
		if (event.name == 'Lantmäteriet' && this.map.options.crs.code != 'EPSG:3006') {
			var mapCenter = this.map.getCenter();
			var mapZoom = this.map.getZoom();

			this.map.options.crs = mapHelper.getSweref99crs();

			this.map.options.minZoom = 2;
			this.map.options.maxZoom = 13;

			this.map.setView(mapCenter, mapZoom-4, {
				animate: false
			});
		}

		if (event.name != 'Lantmäteriet' && this.map.options.crs.code == 'EPSG:3006') {
			var mapCenter = this.map.getCenter();
			var mapZoom = this.map.getZoom();

			this.map.options.crs = L.CRS.EPSG3857;

			this.map.options.minZoom = 6;
			this.map.options.maxZoom = 16;

			this.map.setView(mapCenter, mapZoom+4, {
				animate: false
			});
		}
	}

	componentWillReceiveProps(props) {
		if (props.marker) {
			this.addMarker(props.marker);
		}
	}

	render() {
		return (
			<div className={this.props.className || 'map-container small'} ref="mapView"></div>
		);
	}
}