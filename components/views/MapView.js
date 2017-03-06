import React from 'react';

import L from 'leaflet';
import 'leaflet.markercluster';
import './../../lib/leaflet-heat';
//import 'leaflet.vectorgrid';
import _ from 'underscore';

import MapCollection from './../collections/MapCollection';
import mapHelper from './../../utils/mapHelper';

export default class MapView extends React.Component {

	constructor(props) {
		super(props);

		window.mapView = this;

		this.state = {
			viewMode: 'clusters'
		};

		this.mapData = [];

		this.changeViewMode = this.changeViewMode.bind(this);

		this.collections = new MapCollection(function(json) {
			this.mapData = json.data || [];
			this.updateMap();
		}.bind(this));
	}

	componentDidMount() {
		var layers = mapHelper.createLayers();

		this.map = L.map(this.refs.mapView, {
			center: [61.5122, 16.7211], 
			zoom: 5,
			minZoom: 3,
			layers: [layers[Object.keys(layers)[0]]],
			scrollWheelZoom: true
		});
/*
		this.vectorGridLayer = L.vectorGrid.protobuf('http://localhost:8084/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=sverige_socken_sweref:se_socken_clipped&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&FORMAT=application/x-protobuf;type=mapbox-vector&TILECOL={x}&TILEROW={y}', {
			interactive: true,
			vectorTileLayerStyles: {
				se_socken_clipped: function(properties, zoom) {
					var showFeature = properties.DISTRNAMN == 'Borås' || 
						properties.DISTRNAMN == 'Kinna' || 
						properties.DISTRNAMN == 'Bollebygd' || 
						properties.DISTRNAMN == 'Härrida' || 
						properties.DISTRNAMN == 'Kinnarumma' || 
						properties.DISTRNAMN == 'Fristad' || 
						properties.DISTRNAMN == 'Rångedala' || 
						properties.DISTRNAMN == 'Sätila' || 
						properties.DISTRNAMN == 'Svenljunga'; 

					showFeature = true;

					return {
						weight: showFeature ? 0.5 : 0,
						fillOpacity: showFeature ? 0.5 : 0,
						fill: showFeature,
						fillColor: '#ff0000'
					}
				}
			},
			getFeatureId: function(feature) {
				return feature.properties.OBJEKT_ID;
			}
		});

		this.vectorGridLayer.on('click', function(event) {
			console.log(event);

			window.feature = event.layer;

			this.vectorGridLayer.setFeatureStyle(event.layer.properties.OBJEKT_ID, {
				fill: true,
				fillOpacity: 0.8
			});
		}.bind(this));

		this.vectorGridLayer.on('mouseover', function(event) {

		});

		this.vectorGridLayer.addTo(this.map);
*/
		L.control.layers(layers, null, {
			position: 'topleft'
		}).addTo(this.map);

//		this.setViewmode('clusters');

		this.fetchData(this.props.searchParams);
	}

	componentWillReceiveProps(props) {
		var currentSearchParams = JSON.parse(JSON.stringify(this.props.searchParams));
		if (currentSearchParams.place_id) {
			delete currentSearchParams.place_id;
		}

		var searchParams = JSON.parse(JSON.stringify(props.searchParams));
		if (searchParams.place_id) {
			delete searchParams.place_id;
		}

		if (JSON.stringify(currentSearchParams) !== JSON.stringify(searchParams)) {
			this.fetchData(searchParams);
		}
	}

	fetchData(params) {
		if (params) {
			this.collections.fetch({
				search: params.search || null,
				search_field: params.search_field || null,
				type: params.type || 'arkiv;tryckt',
				category: params.category
			});
		}
	}

	changeViewMode(event) {
		this.setViewmode(event.target.dataset.viewmode);
	}

	setViewmode(viewMode) {
		if (viewMode != this.state.viewMode) {
			this.setState({
				viewMode: viewMode
			});

			if (this.mapData.length > 0) {
				setTimeout(function() {
					this.createLayers();

					this.updateMap();
				}.bind(this), 50);
			}
		}
	}

	createLayers() {
		console.log('MapView: createLayers');
		if (this.markers) {
			if (this.markers.clearLayers) {
				this.markers.clearLayers();
			}

			this.map.removeLayer(this.markers);
		}

		switch (this.state.viewMode) {
			case 'markers':
				this.markers = L.featureGroup();
				this.map.addLayer(this.markers);
				break;
			case 'clusters':
				this.markers = new L.MarkerClusterGroup({
					showCoverageOnHover: false,
					maxClusterRadius: 40,
					iconCreateFunction: function (cluster) {
						var childCount = cluster.getChildCount();
						var c = ' marker-cluster-';
						if (childCount < 10) {
							c += 'small';
						} else if (childCount < 20) {
							c += 'medium';
						} else {
							c += 'large';
						}
						return new L.DivIcon({
							html: '<div><span>'+
								'<b>'+childCount+'</b>'+
								'</span></div>',
							className: 'marker-cluster'+c,
							iconSize: new L.Point(24, 24)
						});
					}
				});
				this.map.addLayer(this.markers);
				break;
			case 'heatmap':
				this.markers = L.heatLayer([], {
					minOpacity: 0.35,
					radius: 18,
					blur: 15
				});
				this.markers.addTo(this.map);
		}
	}

	updateMap() {
		console.log('MapView: updateMap');
		console.log('state.viewMode: '+this.state.viewMode);
		console.log(this.markers);

		if (this.state.viewMode == 'markers' || this.state.viewMode == 'clusters') {
			if (this.markers) {
				this.markers.clearLayers();
			}
			else {
				this.createLayers();
			}

			if (this.mapData.length > 0) {
				var bounds = [];
				
				_.each(this.mapData, function(mapItem) {
					if (mapItem.lat && mapItem.lng) {
						var marker = L.marker([Number(mapItem.lat), Number(mapItem.lng)], {
							title: mapItem.name,
							icon: mapHelper.orangeIcon
						});
/*
						var template = _.template($("#markerPopupTemplate").html());
						var popupHtml = template({
							model: model
						});

						marker.bindPopup(popupHtml).on('popupopen', _.bind(function(event) {
							_.each(this.$el.find('.place-view-link'), _.bind(function(linkEl) {
								$(linkEl).click(_.bind(function(event) {
									event.preventDefault();
									this.trigger('viewPlace', {
										placeId: mapItem.id')
									});
								}, this));
							}, this));
						}, this));
*/
						marker.on('click', function(event) {
							if (this.props.onMarkerClick) {
								this.props.onMarkerClick(mapItem.id);
							}
						}.bind(this));

						this.markers.addLayer(marker);

						if (mapHelper.inSweden(mapItem.lat, mapItem.lng)) {
							bounds.push([mapItem.lat, mapItem.lng])
						}
					}
				}.bind(this));

				this.map.fitBounds(bounds, {
					maxZoom: 10
				});
			}
		}
		if (this.state.viewMode == 'heatmap') {
			var latLngs = _.map(this.mapData, function(mapItem) {
				return [mapItem.lat, mapItem.lng, mapItem.c];
			}.bind(this));
			this.markers.setLatLngs(latLngs);
		}

		if (this.props.onMapUpdate) {
			this.props.onMapUpdate();
		}
	}

	render() {
		return (
			<div className="map-wrapper">
				{this.props.children}

				<div className="map-viewmode-menu">
					<a className={'icon-marker'+(this.state.viewMode == 'clusters' ? ' selected' : '')} data-viewmode="clusters" onClick={this.changeViewMode}><span>Cluster</span></a>
					<a className={'icon-heatmap'+(this.state.viewMode == 'heatmap' ? ' selected' : '')} data-viewmode="heatmap" onClick={this.changeViewMode}><span>Heatmap</span></a>
				</div>

				<div className="map-view" ref="mapView"></div>
			</div>
		);
	}
}