import React from 'react';
import _ from 'underscore';

import config from './../../../scripts/config.js';
import localLibrary from './../../utils/localLibrary.js';

import ShareButtons from './../controls/ShareButtons';
import SimpleMap from './SimpleMap';
import ListPlayButton from './ListPlayButton';
import FeedbackButton from './FeedbackButton';
import TranscribeButton from './TranscribeButton';
import ElementNotificationMessage from './../controls/ElementNotificationMessage';

export default class RecordView extends React.Component {
	constructor(props) {
		super(props);

		this.toggleSaveRecord = this.toggleSaveRecord.bind(this);
		this.mediaImageClickHandler = this.mediaImageClickHandler.bind(this);

		this.state = {
			data: {},
			saved: false
		};

		this.url = config.apiUrl+'records/';
	}

	componentDidMount() {
		this.fetchData(this.props.params);
	}

	componentWillReceiveProps(props) {
		if (props.params.record_id != this.props.params.record_id) {
			this.fetchData(props.params);
			if (window.eventBus) {
				window.eventBus.dispatch('overlay.hide');
			}
		}
	}

	componentWillUnmount() {
		if (window.eventBus) {
			window.eventBus.dispatch('overlay.hide');
		}
	}

	toggleSaveRecord() {
		var libraryItem = {
			id: this.state.data.id,
			title: this.state.data.title,
			place: this.state.data.places && this.state.data.places.length > 0 ? this.state.data.places[0].name : null
		};

		if (!localLibrary.find(libraryItem)) {
			localLibrary.add(libraryItem);
			this.setState({
				saved: true
			});

			if (window.eventBus) {
				window.eventBus.dispatch('popup-notification.notify', null, '<strong>'+this.state.data.title+'</strong> har sparats till dina sägner.');
			}

		}
		else {
			localLibrary.remove(libraryItem);
			this.setState({
				saved: false
			});
		}
	}

	mediaImageClickHandler(event) {
		if (window.eventBus) {
			window.eventBus.dispatch('overlay.viewimage', {
				imageUrl: event.target.dataset.image
			});
		}
	}

	fetchData(params) {
		if (params.record_id) {
			fetch(this.url+params.record_id+'/')
				.then(function(response) {
					return response.json()
				}).then(function(json) {
					this.setState({
						data: json,
						saved: localLibrary.find({
							id: json.id
						})
					});
				}.bind(this)).catch(function(ex) {
					console.log('parsing failed', ex);
				})
			;
		}
	}

	render() {
		var imageItems = [];
		var audioItems = [];

		if (this.state.data.media && this.state.data.media.length > 0) {
			var imageDataItems = _.filter(this.state.data.media, function(dataItem) {
				return dataItem.type == 'image';
			});
			imageItems = imageDataItems.map(function(mediaItem, index) {
				if (mediaItem.source.indexOf('.pdf') == -1) {
					return <img key={index} className="archive-image" data-image={mediaItem.source} onClick={this.mediaImageClickHandler} src={config.imageUrl+mediaItem.source} alt="" />;
				}
			}.bind(this));
		}

		if (this.state.data.media && this.state.data.media.length > 0) {
			var audioDataItems = _.filter(this.state.data.media, function(dataItem) {
				return dataItem.type == 'audio';
			});
			audioItems = audioDataItems.map(function(mediaItem, index) {
				return <tr key={index}>
					<td data-title="Lyssna:">
						<ListPlayButton media={mediaItem} recordId={this.state.data.id} recordTitle={this.state.data.title} />
					</td>
					<td>{mediaItem.title}</td>
				</tr>;
			}.bind(this));
		}

		var personItems = this.state.data.persons && this.state.data.persons.length > 0 ? this.state.data.persons.map(function(person, index) {
			return <tr key={index}>
				<td data-title=""><a href={'#person/'+person.person.id}>{person.person.name ? person.person.name : ''}</a></td>
				<td data-title="Födelseår">{person.person.birth_year && person.person.birth_year > 0 ? person.person.birth_year : ''}</td>
				<td data-title="Födelseort">
					{
						person.person.places && person.person.places.length > 0 &&
						<a href={'#place/'+person.person.places[0].id}>{person.person.places[0].name+', '+person.person.places[0].harad.name}</a>
					}
				</td>
				<td data-title="Roll">{person.relation == 'c' ? 'Upptecknare' : person.relation == 'i' ? 'Informant' : ''}</td>
			</tr>;
		}) : [];


		var placeItems = this.state.data.places && this.state.data.places.length > 0 ? this.state.data.places.map(function(place, index) {
			return <tr key={index}>
				<td><a href={'#place/'+place.id}>{place.name+', '+(place.fylke ? place.fylke : place.harad)}</a></td>
			</tr>;
		}) : [];

		var textElement;

		if (this.state.data.text && this.state.data.text.indexOf('transkriberad') > -1 && this.state.data.text.length < 25 && this.state.data.media.length > 0) {
			textElement = <p><TranscribeButton 
				className="button-primary" 
				label="Transkribera" 
				title={this.state.data.title} 
				recordId={this.state.data.id} 
				images={this.state.data.media} /></p>;
		}
		else {
			textElement = <p dangerouslySetInnerHTML={{__html: this.state.data.text}} />;
		}

		return <div className={'container'+(this.state.data.id ? '' : ' loading')}>
		
				<div className="container-header">
					<div className="row">
						<div className="twelve columns">
							<h2>{this.state.data.title} <ElementNotificationMessage 
															placement="under" 
															placementOffsetX="-1" 
															messageId="saveLegendsNotification" 
															forgetAfterClick={true} 
															closeTrigger="click" 
															autoHide={true} 
															message="Klicka på stjärnan för att spara sägner till din egen lista.">
								<button className={'save-button'+(this.state.saved ? ' saved' : '')} onClick={this.toggleSaveRecord}><span>Spara</span></button></ElementNotificationMessage></h2>
							<p><strong>Materialtyp</strong>: {this.state.data.type}</p>
						</div>
					</div>

					<FeedbackButton title={this.state.data.title} type="Sägen" />
				</div>

  				<div className="row">

					{
						this.state.data.text &&
						<div className="eight columns">
							{
								textElement
							}

							{
								this.state.data.comment && this.state.data.comment != '' &&
								<p className="text-small"><strong>Ordförklaringar och dylikt i upptekcningarna/utgåvorna:</strong><br/><span dangerouslySetInnerHTML={{__html: this.state.data.comment}} /></p>
							}
							{
								this.state.data.printed_source && this.state.data.type == 'tryckt' &&
								<p className="text-small"><em>{this.state.data.printed_source}</em></p>
							}
							<ShareButtons path={config.siteUrl+'#/record/'+this.state.data.id} text={'"'+this.state.data.title+'"'} />
						</div>
					}
					{
						(imageItems.length > 0 || audioItems.length > 0) &&
						<div className={'columns '+(this.state.data.text ? 'four u-pull-right' : 'twelve')}>
							{
								imageItems
							}
							{
								audioItems.length > 0 &&
								<div className="table-wrapper">
									<table width="100%" className="table-responsive">
										<tbody>
											{audioItems}
										</tbody>
									</table>
								</div>
							}
							{
								!this.state.data.text &&								
								<ShareButtons path={'record/'+this.state.data.id} />
							}
						</div>
					}

				</div>

				<hr/>

				{
					personItems.length > 0 &&
					<div className="row">

						<div className="twelve columns">
							<h3>Personer</h3>

							<div className="table-wrapper">
								<table width="100%" className="table-responsive">
									<thead>
										<tr>
											<th>Namn</th>
											<th>Födelseår</th>
											<th>Födelseort</th>
											<th>Roll</th>
										</tr>
									</thead>
									<tbody>
										{personItems}
									</tbody>
								</table>
							</div>
						</div>

					</div>
				}
				{
					personItems.length > 0 && placeItems.length > 0 &&
					<hr/>
				}

				{
					placeItems.length > 0 &&
					<div className="row">

						<div className="six columns">
							<h3>Platser</h3>

							<div className="table-wrapper">
								<table width="100%">

									<thead>
										<tr>
											<th>Namn</th>
										</tr>
									</thead>

									<tbody>
										{placeItems}
									</tbody>

								</table>
							</div>
						</div>

						<div className="six columns">
							{
								this.state.data.places && this.state.data.places.length > 0 && this.state.data.places[0].lat && this.state.data.places[0].lng &&
								<SimpleMap marker={{lat: this.state.data.places[0].lat, lng: this.state.data.places[0].lng, label: this.state.data.places[0].name}} />
							}
						</div>

					</div>
				}

				<hr/>

				<div className="row">

					<div className="four columns">
						{
							this.state.data.archive && this.state.data.archive.archive && this.state.data.archive.archive != 'null' &&
							<p><strong>Arkiv</strong><br/>{this.state.data.archive.archive}</p>
						}

						{
							this.state.data.archive && this.state.data.archive.archive && this.state.data.archive.archive_id != 'null' &&
							<p><strong>Acc. nr</strong><br/>{this.state.data.archive.archive_id}</p>
						}

						{
							this.state.data.archive && this.state.data.archive.archive && this.state.data.archive.page != 'null' &&
							<p><strong>Sid. nr</strong><br/>{this.state.data.archive.page}</p>
						}
					</div>

					<div className="four columns">
						{
							this.state.data.type &&
							<p><strong>Materialtyp</strong><br/>
								{this.state.data.type ? this.state.data.type.charAt(0).toUpperCase() + this.state.data.type.slice(1) : ''}
							</p>
						}

						{
							this.state.data.taxonomy && this.state.data.taxonomy.name &&
							<p><strong>Kategori</strong><br/>
								<a href={'#/places/category/'+this.state.data.taxonomy.category.toLowerCase()}>{this.state.data.taxonomy.name}</a></p>
						}
					</div>

					<div className="four columns">
						{
							this.state.data.year && this.state.data.year > 0 &&
							<p><strong>Uppteckningsår</strong><br/>{this.state.data.year > 0 ? this.state.data.year :''}</p>
						}

						{
							this.state.data.printed_source &&
							<p><strong>Tryckt i</strong><br/>{this.state.data.printed_source}</p>
						}
					</div>

				</div>

			</div>;
	}
}