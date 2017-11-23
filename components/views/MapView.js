import React from 'react';

import L from 'leaflet';
import 'leaflet.markercluster';
import './../../lib/leaflet-heat';
//import 'leaflet.vectorgrid';
import _ from 'underscore';

import MapBase from './MapBase';

import MapCollection from './../collections/MapCollection';
import mapHelper from './../../utils/mapHelper';
import config from './../../../scripts/config.js';

export default class MapView extends React.Component {

	constructor(props) {
		super(props);

		window.mapView = this;

		this.state = {
			viewMode: 'clusters',
			loading: false
		};

		this.mapData = [];

		this.changeViewMode = this.changeViewMode.bind(this);
		this.mapBaseLayerChangeHandler = this.mapBaseLayerChangeHandler.bind(this);

		this.collections = new MapCollection(function(json) {
			this.mapData = json.data || [];
			this.updateMap();

			this.setState({
				loading: false
			});
		}.bind(this));
	}

	componentDidMount() {
		this.fetchData(this.props.searchParams);

		this.mapBase = this.refs.mapView;
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

	mapBaseLayerChangeHandler(event) {
		this.updateMap();
	}

	fetchData(params) {
		this.setState({
			loading: true
		});

		if (params) {
			var fetchParams = {
				search: params.search || null,
				search_field: params.search_field || null,
				category: params.category,
				year_from: params.year_from || null,
				year_to: params.year_to || null,
				person_relation: params.person_relation || null,
				gender: params.gender || null,
				record_ids: params.record_ids || null,
				has_metadata: params.has_metadata || null
			};

			this.collections.fetch(fetchParams);
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
		if (this.markers) {
			if (this.markers.clearLayers) {
				this.markers.clearLayers();
			}

			this.refs.mapView.map.removeLayer(this.markers);
		}

		switch (this.state.viewMode) {
			case 'markers':
				this.markers = L.featureGroup();
				this.refs.mapView.map.addLayer(this.markers);
				break;
			case 'circles':
				this.markers = L.featureGroup();
				this.refs.mapView.map.addLayer(this.markers);
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
							iconSize: new L.Point(28, 28)
						});
					}
				});
				this.refs.mapView.map.addLayer(this.markers);
				break;
			case 'heatmap':
				this.markers = L.heatLayer([], {
					minOpacity: 0.35,
					radius: 18,
					blur: 15
				});
				this.markers.addTo(this.refs.mapView.map);
			case 'heatmap-count':
				this.markers = L.heatLayer([], {
					minOpacity: 0.35,
					radius: 18,
					blur: 15
				});
				this.markers.addTo(this.refs.mapView.map);
		}
	}

	updateMap() {
		if (this.state.viewMode == 'markers' || this.state.viewMode == 'clusters') {
			if (this.markers) {
				this.markers.clearLayers();
			}
			else {
				this.createLayers();
			}

			// Lägger till alla prickar på kartan
			if (this.mapData.length > 0) {
				// Hämtar current bounds (minus 20%) av synliga kartan
				var currentBounds = this.refs.mapView.map.getBounds().pad(-0.2);

				// Samlar ihop latLng av alla prickar för att kunna senare zooma inn till dem
				var bounds = [];
				var markerWithinBounds = false;
				
				_.each(this.mapData, function(mapItem) {
					if (mapItem.location.length > 0) {
						// Skalar L.marker objekt och lägger till rätt icon
						var marker = L.marker([Number(mapItem.location[0]), Number(mapItem.location[1])], {
							title: mapItem.name,
							// Om mapItem.has_metadata lägger vi till annan typ av ikon, används mest av matkartan för att visa kurerade postar
							icon: mapItem.has_metadata == true ? (this.props.highlightedMarkerIcon || mapHelper.markerIconHighlighted) : (this.props.defaultMarkerIcon || mapHelper.markerIcon)
						});

						// Lägger till click event listener
						marker.on('click', function(event) {
							// Om onMarkerClick finns som property för MapView kallar vi den funktionen
							if (this.props.onMarkerClick) {
								this.props.onMarkerClick(mapItem.id);
							}
						}.bind(this));

						// Lägger pricken till kartan
						this.markers.addLayer(marker);

						// Lägger latLng till bounds
						bounds.push(mapItem.location);

						// Checkar om punkten är synlig på visibella kartan på skärmen
						if (currentBounds.contains(mapItem.location)) {
							markerWithinBounds = true;
						}
					}
				}.bind(this));

				// Zooma in till alla nya punkena om ingen av dem finns inom synliga kartan
				if (!markerWithinBounds) {
					this.refs.mapView.map.fitBounds(bounds, {
						maxZoom: 10,
						padding: [50, 50]
					});
				}
			}
		}
		if (this.state.viewMode == 'circles') {
			if (this.markers) {
				this.markers.clearLayers();
			}
			else {
				this.createLayers();
			}

			if (this.mapData.length > 0) {
				var bounds = [];
				
				var minValue = _.min(this.mapData, function(mapItem) {
					return Number(mapItem.c);
				}).c;

				var maxValue = _.max(this.mapData, function(mapItem) {
					return Number(mapItem.c);
				}).c;

				_.each(this.mapData, function(mapItem) {
					if (mapItem.lat && mapItem.lng) {
						var marker = L.circleMarker([mapItem.lat, mapItem.lng], {
							radius: ((mapItem.c/maxValue)*20)+2,
							fillColor: "#047bff",
							fillOpacity: 0.4,
							color: '#000',
							weight: 0.8
						});

						marker.on('click', function(event) {
							if (this.props.onMarkerClick) {
								this.props.onMarkerClick(mapItem.id);
							}
						}.bind(this));

						this.markers.addLayer(marker);
					}
				}.bind(this));
/*
				if (this.legendsEl) {
					var template = _.template($("#mapLegendsTemplate").html());
					this.legendsEl.html(template({
						minValue: Number(minValue),
						maxValue: Number(maxValue)
					}));
					this.legendsEl.addClass('visible');
				}
*/
			}
		}
		if (this.state.viewMode == 'heatmap') {
			var latLngs = _.map(this.mapData, function(mapItem) {
				return [mapItem.lat, mapItem.lng, 0.5];
			}.bind(this));
			this.markers.setLatLngs(latLngs);
		}
		if (this.state.viewMode == 'heatmap-count') {
			this.refs.mapView.map.removeLayer(this.markers);

			var maxCount = _.max(this.mapData, function(mapItem) {
				return Number(mapItem.c);
			}).c;

			this.markers = L.heatLayer([], {
				minOpacity: 0.35,
				radius: 18,
				blur: 15,
				max: maxCount
			});
			this.markers.addTo(this.refs.mapView.map);

			var latLngs = _.map(this.mapData, function(mapItem) {
				return [mapItem.lat, mapItem.lng, mapItem.c];
			}.bind(this));
			this.markers.setLatLngs(latLngs);
		}

		if (this.props.onMapUpdate) {
			this.props.onMapUpdate();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.loading != nextState.loading || this.state.viewMode != nextState.viewMode;
	}

	render() {
		return (
			<div className={'map-wrapper'+(this.state.loading ? ' map-loading' : '')}>
				{this.props.children}

				{
					!this.props.hideMapmodeMenu &&
					<div className="map-viewmode-menu">
						<a className={'icon-marker'+(this.state.viewMode == 'clusters' ? ' selected' : '')} data-viewmode="clusters" onClick={this.changeViewMode}><span>Cluster</span></a>
						<a className={'icon-heatmap'+(this.state.viewMode == 'heatmap' ? ' selected' : '')} data-viewmode="heatmap" onClick={this.changeViewMode}><span>Heatmap</span></a>
						<a className={'icon-circles'+(this.state.viewMode == 'circles' ? ' selected' : '')} data-viewmode="circles" onClick={this.changeViewMode}><span>Circles</span></a>
					</div>
				}

				<div className="map-progress">
					<div className="indicator"></div>
				</div>

				<MapBase ref="mapView" className="map-view" layersControlPosition={this.props.layersControlPosition || 'topleft'} zoomControlPosition={this.props.zoomControlPosition || 'topleft'} scrollWheelZoom={true} onBaseLayerChange={this.mapBaseLayerChangeHandler} />
			</div>
		);
	}
}