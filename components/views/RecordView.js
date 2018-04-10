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
import SitevisionContent from './../controls/SitevisionContent';
import PdfViewer from './../controls/PdfViewer';

export default class RecordView extends React.Component {
	constructor(props) {
		super(props);

		window.config = config;
		window.recordView = this;

		this.toggleSaveRecord = this.toggleSaveRecord.bind(this);
		this.mediaImageClickHandler = this.mediaImageClickHandler.bind(this);

		this.state = {
			data: {},
			saved: false
		};

		this.url = config.apiUrl+'document/';
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
				window.eventBus.dispatch('popup-notification.notify', null, '<strong>'+this.state.data.title+'</strong> '+l('har sparats till dina sägner')+'.');
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
				imageUrl: event.currentTarget.dataset.image,
				type: event.currentTarget.dataset.type
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
						data: json._source,
						saved: localLibrary.find({
							id: json._id
						})
					});
				}.bind(this)).catch(function(ex) {
					console.log('parsing failed', ex);
				})
			;
		}
	}

	getArchiveLogo(archive) {
		var archiveLogos = [];

		archiveLogos['Dialekt-, namn- och folkminnesarkivet i Göteborg'] = 'img/archive-logo-isof.png';
		archiveLogos['Dialekt- och folkminnesarkivet i Uppsala'] = 'img/archive-logo-isof.png';
		archiveLogos['Dialekt och folkminnesarkivet i Uppsala'] = 'img/archive-logo-isof.png';
		archiveLogos['DAG'] = 'img/archive-logo-isof.png';
		archiveLogos['NFS'] = 'img/archive-logo-ikos.png';
		archiveLogos['DFU'] = 'img/archive-logo-isof.png';

		return archiveLogos[archive] || null;
	}

	render() {
		var imageItems = [];
		var pdfItems = [];
		var audioItems = [];

		if (this.state.data) {

			if (this.state.data.media && this.state.data.media.length > 0) {
				var imageDataItems = _.filter(this.state.data.media, function(dataItem) {
					return dataItem.type == 'image';
				});
				imageItems = imageDataItems.map(function(mediaItem, index) {
					if (mediaItem.source.indexOf('.pdf') == -1) {
						return <div data-type="image" data-image={mediaItem.source} onClick={this.mediaImageClickHandler} key={'image-'+index} className={'archive-image'}>
							<img src={config.imageUrl+mediaItem.source} alt="" />
							{
								mediaItem.title &&
								<div className="media-title sv-portlet-image-caption">{mediaItem.title}</div>
							}
						</div>;
					}
				}.bind(this));

				var audioDataItems = _.filter(this.state.data.media, function(dataItem) {
					return dataItem.type == 'audio';
				});
				audioItems = audioDataItems.map(function(mediaItem, index) {
					return <tr key={index}>
						<td data-title="Lyssna:" width="50px">
							<ListPlayButton media={mediaItem} recordId={this.state.data.id} recordTitle={this.state.data.title} />
						</td>
						<td>{mediaItem.title.length > 0 ? mediaItem.title : this.state.data.title}</td>
					</tr>;
				}.bind(this));

				var pdfDataItems = _.filter(this.state.data.media, function(dataItem) {
					return dataItem.type == 'pdf';
				});
				pdfItems = pdfDataItems.map(function(mediaItem, index) {
					return <div data-type="pdf" data-image={mediaItem.source} onClick={this.mediaImageClickHandler} key={'pdf-'+index} className="archive-image pdf">
						<div className="pdf-icon" />
						{
							mediaItem.title &&
							<div className="media-title sv-portlet-image-caption">{mediaItem.title}</div>
						}
					</div>;
				}.bind(this));

				if (config.siteOptions.recordView && config.siteOptions.recordView.imagePosition == config.siteOptions.recordView.pdfIconsPosition) {
					imageItems = imageItems.concat(pdfItems);
					pdfItems = [];
				}
			}

			var personItems = this.state.data.persons && this.state.data.persons.length > 0 ? this.state.data.persons.map(function(person, index) {
				return <tr key={index}>
					<td data-title="">
						{
							!config.siteOptions.disablePersonLinks == true ?
							<a href={'#person/'+person.id}>{person.name ? person.name : ''}</a> :
							person.name
						}
					</td>
					<td data-title="Födelseår">{person.birth_year && person.birth_year > 0 ? person.birth_year : ''}</td>
					<td data-title="Födelseort">
						{
							person.home && person.home.length > 0 &&
							<a href={'#place/'+person.home[0].id}>{person.home[0].name+', '+person.home[0].harad}</a>
						}
					</td>
					<td data-title="Roll">{person.relation == 'c' ? l('Upptecknare') : person.relation == 'i' ? l('Informant') : ''}</td>
				</tr>;
			}) : [];


			var placeItems = this.state.data.places && this.state.data.places.length > 0 ? this.state.data.places.map(function(place, index) {
				return <tr key={index}>
					<td><a href={'#place/'+place.id}>{place.name+', '+(place.fylke ? place.fylke : place.harad)}</a></td>
				</tr>;
			}) : [];

			var textElement;

			var forceFullWidth  = false;

			var sitevisionUrl = _.find(this.state.data.metadata, function(item) {
				return item.type == 'sitevision_url';
			});

			if (sitevisionUrl) {
				textElement = <SitevisionContent url={sitevisionUrl.value} />
			}

			else if (this.state.data.text && this.state.data.text.indexOf('transkriberad') > -1 && this.state.data.text.length < 25 && this.state.data.media.length > 0) {
				textElement = <div><p><strong>Den här uppteckningen är inte transkriberad.</strong><br/><br/>Vill du vara med och tillgängliggöra samlingarna för fler? Hjälp oss att skriva av berättelser!</p><TranscribeButton
					className="button-primary"
					label="Transkribera"
					title={this.state.data.title}
					recordId={this.state.data.id}
					images={this.state.data.media} /></div>;
			}

			else if ((!this.state.data.text || this.state.data.text.length == 0) && _.filter(this.state.data.media, function(item) {
				return item.type == 'pdf';
			}).length == 1 && _.filter(this.state.data.media, function(item) {
				return item.type == 'image';
			}).length == 0 && _.filter(this.state.data.media, function(item) {
				return item.type == 'audio';
			}).length == 0) {
				var pdfObject = _.find(this.state.data.media, function(item) {
					return item.type == 'pdf';
				});

				textElement = <PdfViewer height="800" url={config.imageUrl+pdfObject.source}/>;

				forceFullWidth = true;
			}
			else {
				textElement = <p dangerouslySetInnerHTML={{__html: this.state.data.text}} />;
			}


			var taxonomyElement;

			if (this.state.data.taxonomy) {
				if (this.state.data.taxonomy.name) {
					taxonomyElement = <p><strong>{l('Kategori')}</strong><br/>
						<a href={'#/places/category/'+this.state.data.taxonomy.category.toLowerCase()}>{l(this.state.data.taxonomy.name)}</a></p>;
				}
				else if (this.state.data.taxonomy.length > 0) {
					taxonomyElement = <p><strong>{l('Kategori')}</strong><br/>
						<span dangerouslySetInnerHTML={{__html: _.map(_.filter(this.state.data.taxonomy, function(taxonomyItem) {
							return taxonomyItem.category;
						}), function(taxonomyItem) {
									return '<a href="#/places/category/'+taxonomyItem.category.toLowerCase()+'">'+l(taxonomyItem.name)+'</a>'
								}).join(', ')}} >
						</span></p>;
				}
			}

			var metadataItems = [];

			var getMetadataTitle = function(item) {
				return config.siteOptions.metadataLabels && config.siteOptions.metadataLabels[item] ? config.siteOptions.metadataLabels[item] : item;
			};

			if (this.state.data.metadata && this.state.data.metadata.length > 0 && config.siteOptions.recordView && config.siteOptions.recordView.visible_metadata_fields && config.siteOptions.recordView.visible_metadata_fields.length > 0) {
				var itemCount = 0;
				_.each(this.state.data.metadata, function(item, index) {
					if (config.siteOptions.recordView.visible_metadata_fields.indexOf(item.type) > -1) {
						itemCount++;
						metadataItems.push(
							<div className="grid-item" key={item.type}>
								<p><strong>{getMetadataTitle(item.type)}</strong><br />
								{item.value}</p>
							</div>
						);

						if (itemCount % 3 === 0 ) {
							metadataItems.push(<div className="grid-divider-3 u-cf" key={'cf-'+index} />);
						}

						if (itemCount % 2 === 0 ) {
							metadataItems.push(<div className="grid-divider-2 u-cf" key={'cf-'+index} />);
						}
					}
				});
			}

			return <div className={'container'+(this.state.data.id ? '' : ' loading')}>

					<div className="container-header">
						<div className="row">
							<div className="twelve columns">
								<h2>{this.state.data.title && this.state.data.title != '' ? this.state.data.title : l('(Utan titel)')} <ElementNotificationMessage
																placement="under"
																placementOffsetX="-1"
																messageId="saveLegendsNotification"
																forgetAfterClick={true}
																closeTrigger="click"
																autoHide={true}
																message={l('Klicka på stjärnan för att spara sägner till din egen lista.')}>
									<button className={'save-button'+(this.state.saved ? ' saved' : '')} onClick={this.toggleSaveRecord}><span>{l('Spara')}</span></button></ElementNotificationMessage></h2>
								<p><strong>Materialtyp</strong>: {this.state.data.materialtype}</p>
							</div>
						</div>

						{
							!config.siteOptions.hideContactButton &&
							<FeedbackButton title={this.state.data.title} type="Sägen" />
						}
					</div>

					<div className="row">

						{
							(this.state.data.text || textElement) &&
							<div className={(sitevisionUrl || imageItems.length == 0 || forceFullWidth || ((config.siteOptions.recordView && config.siteOptions.recordView.audioPlayerPosition == 'under') && (config.siteOptions.recordView && config.siteOptions.recordView.imagePosition == 'under') && (config.siteOptions.recordView && config.siteOptions.recordView.pdfIconsPosition == 'under')) ? 'twelve' : 'eight')+' columns'}>
								{
									textElement
								}

								{
									this.state.data.comment && this.state.data.comment != '' &&
									<p className="text-small"><strong>{l('Ordförklaringar och dylikt i upptekcningarna/utgåvorna')+':'}</strong><br/><span dangerouslySetInnerHTML={{__html: this.state.data.comment}} /></p>
								}
								{
									this.state.data.printed_source && this.state.data.materialtype == 'tryckt' &&
									<p className="text-small"><em>{this.state.data.printed_source}</em></p>
								}
								{
									sitevisionUrl || forceFullWidth || (config.siteOptions.recordView && config.siteOptions.recordView.audioPlayerPosition == 'under' && audioItems.length > 0) &&
									<div className="table-wrapper">
										<table width="100%">
											<tbody>
												{audioItems}
											</tbody>
										</table>
									</div>
								}
								{
									sitevisionUrl || forceFullWidth || (config.siteOptions.recordView && config.siteOptions.recordView.imagePosition == 'under') && imageItems.length > 0 &&
									<div>
										{imageItems}
									</div>
								}
								{
									sitevisionUrl || forceFullWidth || (config.siteOptions.recordView && config.siteOptions.recordView.pdfIconsPosition == 'under') && pdfItems.length > 0 &&
									<div>
										{pdfItems}
									</div>
								}
							</div>
						}
						{
							!sitevisionUrl && !forceFullWidth && (!config.siteOptions.recordView || !config.siteOptions.recordView.imagePosition || config.siteOptions.recordView.imagePosition == 'right' || !config.siteOptions.recordView.pdfIconsPosition || config.siteOptions.recordView.pdfIconsPosition == 'right' || !config.siteOptions.recordView.audioPlayerPosition || config.siteOptions.recordView.audioPlayerPosition == 'right') && (imageItems.length > 0 || audioItems.length > 0 || pdfItems.length > 0) &&
							<div className={'columns four u-pull-right'}>

								{
									(!config.siteOptions.recordView || !config.siteOptions.recordView.audioPlayerPosition || config.siteOptions.recordView.audioPlayerPosition == 'right') && audioItems.length > 0 &&
									<div className="table-wrapper">
										<table width="100%">
											<tbody>
												{audioItems}
											</tbody>
										</table>
									</div>
								}

								{
									(!config.siteOptions.recordView || !config.siteOptions.recordView.imagePosition || config.siteOptions.recordView.imagePosition == 'right') && imageItems.length > 0 &&
									imageItems
								}

								{
									(!config.siteOptions.recordView || !config.siteOptions.recordView.pdfIconsPosition || config.siteOptions.recordView.pdfIconsPosition == 'right') && pdfItems.length > 0 &&
									pdfItems
								}

							</div>
						}

					</div>

					{
						metadataItems.length > 0 &&
						<div className="grid-items">

							{metadataItems}

							<div className="u-cf" />

						</div>
					}

					<ShareButtons path={config.siteUrl+'#/record/'+this.state.data.id} text={'"'+this.state.data.title+'"'} title={l('Dela på sociala media')} />

					<hr/>

					{
						personItems.length > 0 &&
						<div className="row">

							<div className="twelve columns">
								<h3>{l('Personer')}</h3>

								<div className="table-wrapper">
									<table width="100%" className="table-responsive">
										<thead>
											<tr>
												<th>{l('Namn')}</th>
												<th>{l('Födelseår')}</th>
												<th>{l('Födelseort')}</th>
												<th>{l('Roll')}</th>
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
								<h3>{l('Platser')}</h3>

								<div className="table-wrapper">
									<table width="100%">

										<thead>
											<tr>
												<th>{l('Namn')}</th>
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
									this.state.data.places && this.state.data.places.length > 0 && this.state.data.places[0].location.lat && this.state.data.places[0].location.lon &&
									<SimpleMap markers={this.state.data.places} />
								}
							</div>

						</div>
					}

					<hr/>

					<div className="row">

						<div className="four columns">
							{
								this.state.data.archive && this.state.data.archive.archive &&
								<p><strong>{l('Arkiv')}</strong><br/>{this.state.data.archive.archive}</p>
							}

							{
								this.state.data.archive && this.state.data.archive.archive &&
								<p><strong>{l('Acc. nr')}</strong><br/>{this.state.data.archive.archive_id}</p>
							}

							{
								this.state.data.archive && this.state.data.archive.archive &&
								<p><strong>{l('Sid. nr')}</strong><br/>{this.state.data.archive.page}</p>
							}
						</div>

						<div className="four columns">
							{
								this.state.data.materialtype &&
								<p><strong>{l('Materialtyp')}</strong><br/>
									{this.state.data.materialtype ? this.state.data.materialtype.charAt(0).toUpperCase() + this.state.data.materialtype.slice(1) : ''}
								</p>
							}

							{
								taxonomyElement
							}
						</div>

						<div className="four columns">
							{
								this.state.data.year && this.state.data.year > 0 &&
								<p><strong>{l('Uppteckningsår')}</strong><br/>{this.state.data.year > 0 ? this.state.data.year :''}</p>
							}

							{
								this.state.data.printed_source &&
								<p><strong>{l('Tryckt i')}</strong><br/>{this.state.data.printed_source}</p>
							}

							{
								this.state.data.archive && this.state.data.archive.archive &&
								<p><img src={this.getArchiveLogo(this.state.data.archive.archive)} /></p>
							}
						</div>

					</div>

				</div>;
		}
		else {
			return <div className={'container'}>
					<div className="container-header">
						<div className="row">
							<div className="twelve columns">
								<h2>{l('Finns inte')}</h2>
							</div>
						</div>
					</div>

					<div className="row">
						<p>{'Post '+this.props.params.record_id+ ' finns inte.'}</p>
					</div>
				</div>
		}
	}
}
