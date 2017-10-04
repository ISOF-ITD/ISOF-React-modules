import React from 'react';

import L from 'leaflet';
import 'leaflet.markercluster';

import mapHelper from './../../utils/mapHelper';

export default class MapBase extends React.Component {
	componentDidMount() {
		this.layers = mapHelper.createLayers();

		this.nordicLegendsUpdateHandler = this.nordicLegendsUpdateHandler.bind(this);

		if (this.props.disableSwedenMap) {
			delete this.layers[mapHelper.tileLayers[0].label];
		}

		window.mapBase = this;

		var mapOptions = {
			center: [63.5, 16.7211], 
			zoom: 4,
			minZoom: 4,
			maxZoom: 13,
			layers: [this.layers[Object.keys(this.layers)[0]]],
			scrollWheelZoom: this.props.scrollWheelZoom || false
			layers: [layers[Object.keys(layers)[0]]],
			scrollWheelZoom: this.props.scrollWheelZoom || false,
			zoomControl: false
		};

		if (!this.props.disableSwedenMap) {
			mapOptions.crs = mapHelper.getSweref99crs();
			mapOptions.zoom = 1;
			mapOptions.minZoom = 1;
		}

		this.currentBaseLayer = mapHelper.tileLayers[0].label;

		this.map = L.map(this.refs.mapView, mapOptions);

		L.control.zoom({
			position: this.props.zoomControlPosition || 'topright'
		}).addTo(this.map);

		L.control.layers(layers, null, {
			position: this.props.layersControlPosition || 'topright'
		}).addTo(this.map);

		this.map.on('baselayerchange', this.mapBaseLayerChangeHandler.bind(this));

		if (window.eventBus) {
			window.eventBus.addEventListener('nordicLegendsUpdate', this.nordicLegendsUpdateHandler);
		}
	}

	nordicLegendsUpdateHandler() {
		if (window.applicationSettings.includeNordic && this.currentBaseLayer.indexOf('Lantmäteriet') > -1) {
			console.log('change base layer');
			this.map.removeLayer(this.layers[this.currentBaseLayer]);
			this.map.addLayer(this.layers['Open Screet Map Mapnik']);
		}
	}

	mapBaseLayerChangeHandler(event) {
		if (event.name.indexOf('Lantmäteriet') > -1 && this.map.options.crs.code != 'EPSG:3006') {
			var mapCenter = this.map.getCenter();
			var mapZoom = this.map.getZoom();

			this.map.options.crs = mapHelper.getSweref99crs();

			this.map.options.minZoom = 1;
			this.map.options.maxZoom = 13;

			this.map.setView(mapCenter, mapZoom-4, {
				animate: false
			});
		}

		if (event.name.indexOf('Lantmäteriet') == -1 && this.map.options.crs.code == 'EPSG:3006') {
			var mapCenter = this.map.getCenter();
			var mapZoom = this.map.getZoom();

			this.map.options.crs = L.CRS.EPSG3857;

			this.map.options.minZoom = 4;
			this.map.options.maxZoom = 16;

			this.map.setView(mapCenter, mapZoom+4, {
				animate: false
			});
		}

		if (this.props.onBaseLayerChange) {
			this.props.onBaseLayerChange(event);
		}
	}

	invalidateSize() {
		if (this.map) {
			this.map.invalidateSize();
		}
	}

	componentWillReceiveProps(props) {
		if (props.marker) {
			this.addMarker(props.marker);
		}
	}

	render() {
		return (
			<div className={this.props.className || 'map-container small'} ref="mapView" style={this.props.mapHeight ? {height: (this.props.mapHeight.indexOf('px') == -1 ? this.props.mapHeight+'px' : this.props.mapHeight)} : null}></div>
		);
	}
}