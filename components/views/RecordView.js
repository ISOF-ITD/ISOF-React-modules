import React from 'react';
import _, { now } from 'underscore';

import config from './../../../scripts/config.js';
import localLibrary from './../../utils/localLibrary.js';

import ShareButtons from './../controls/ShareButtons';
import SimpleMap from './SimpleMap';
import ListPlayButton from './ListPlayButton';

import ContributeInfoButton from './ContributeInfoButton';
import FeedbackButton from './FeedbackButton';

import TranscribeButton from './TranscribeButton';
import ElementNotificationMessage from './../controls/ElementNotificationMessage';
import SitevisionContent from './../controls/SitevisionContent';
import PdfViewer from './../controls/PdfViewer';
import routeHelper from './../../../scripts/utils/routeHelper';

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
		this.fetchData(this.props.match.params);
	}

	UNSAFE_componentWillReceiveProps(props) {
		if (props.match.params.record_id != this.props.match.params.record_id) {
			this.fetchData(props.match.params);
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

	// Sparar posten till localLibrary
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
			// Skickar overlay.viewimage till eventBus, ImageOverlay modulen lyssnar på det och visar bilden
			window.eventBus.dispatch('overlay.viewimage', {
				imageUrl: event.currentTarget.dataset.image,
				type: event.currentTarget.dataset.type
			});
		}
	}

	fetchData(params) {
		// Add index to callback if defined in config.
		let index = '';
		if ('requiredParams' in config && 'index' in config.requiredParams) {
				index = '?index=' + config.requiredParams.index;
		}
		if (params.record_id) {
			fetch(this.url+params.record_id+'/' + index)
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
		var archiveLogos = {};

		archiveLogos['Dialekt-, namn- och folkminnesarkivet i Göteborg'] = 'img/archive-logo-isof.png';
		archiveLogos['Dialekt- och folkminnesarkivet i Uppsala'] = 'img/archive-logo-isof.png';
		archiveLogos['Dialekt och folkminnesarkivet i Uppsala'] = 'img/archive-logo-isof.png';
		archiveLogos['DAG'] = 'img/archive-logo-isof.png';
		//Needs to be shrinked. By css?
		//archiveLogos['Norsk folkeminnesamling'] = 'img/UiO_Segl_A.png';
		archiveLogos['Norsk folkeminnesamling'] = 'img/archive-logo-ikos.png';
		archiveLogos['NFS'] = 'img/archive-logo-ikos.png';
		archiveLogos['DFU'] = 'img/archive-logo-isof.png';
		archiveLogos['SLS'] = 'img/SLS-logga.svg';
		archiveLogos['Svenska litteratursällskapet i Finland (SLS)'] = 'img/SLS-logga.svg';
		
		//Absolute path (old)
		//return archiveLogos[archive] ? config.appUrl+archiveLogos[archive] : config.appUrl+archiveLogos['DAG'];
		//Relative path
		return archiveLogos[archive] ? ''+archiveLogos[archive] : ''+archiveLogos['DAG'];
	}

	render() {
		var imageItems = [];
		var pdfItems = [];
		var audioItems = [];
		let _props = this.props;

		//var routeParams = routeHelper.createSearchRoute(_props);
		var routeParams = routeHelper.createSearchRoute(_props.match.params);
		//console.log(routeParams)

		if (this.state.data) {
			// Förberedar visuella media objekt
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

			// Förberedar lista över personer
			//console.log('disablePersonLinks: '+config.siteOptions.disablePersonLinks)
			//console.log('disableInformantLinks: '+config.siteOptions.disableInformantLinks)
			var personItems = this.state.data.persons && this.state.data.persons.length > 0 ? this.state.data.persons.map(function(person, index) {
				return <tr key={index}>
					<td data-title="">
						{
							!config.siteOptions.disablePersonLinks == true ?
							(
								config.siteOptions.disableInformantLinks == true && person.relation == 'i' ?
								person.name :
								<a href={'#/person/'+person.id +(routeParams ? routeParams : '')}>{person.name ? person.name : ''}</a>
							) :
							person.name
						}
					</td>
					<td data-title="Födelseår">{person.birth_year && person.birth_year > 0 ? person.birth_year : ''}</td>
					<td data-title="Födelseort">
						{
							person.home && person.home.length > 0 &&
							<a href={'#/places/'+person.home[0].id+(routeParams ? routeParams : '')}>{person.home[0].name+', '+person.home[0].harad}</a>
						}
					</td>
					<td data-title="Roll">{person.relation == 'c' ? l('Upptecknare') : person.relation == 'i' ? l('Informant') : ''}</td>
				</tr>;
			}) : [];

			// Förberedar lista över socknar
			var placeItems = this.state.data.places && this.state.data.places.length > 0 ? this.state.data.places.map(function(place, index) {
				return <tr key={index}>
					<td><a href={'#/places/'+place.id+(routeParams ? routeParams : '')}>{place.name+', '+(place.fylke ? place.fylke : place.harad)}</a></td>
				</tr>;
			}) : [];

			var textElement;

			var forceFullWidth  = false;

			var sitevisionUrl = _.find(this.state.data.metadata, function(item) {
				return item.type == 'sitevision_url';
			});

			// Om vi har sitevisionUrl definerad använder vi SitevisionContent modulen för att visa sidans innehåll
			if (sitevisionUrl) {
				textElement = <SitevisionContent url={sitevisionUrl.value} />
			}
			// Gammal regel: Om "transkriberad" finns i texten lägger vi till transkriberings knappen istället för att visa textan
			// else if (this.state.data.text && this.state.data.text.indexOf('transkriberad') > -1 && this.state.data.text.length < 25 && this.state.data.media.length > 0) {
			// Ny regel Om transcriptionstatus = readytotranscribe lägger vi till transkriberings knappen istället för att visa texten
			else if (this.state.data.transcriptionstatus == 'readytotranscribe' && this.state.data.media.length > 0) { // && (this.state.data.transcriptiondate < now() - 1h)) {
				textElement = <div><p><strong>{l('Den här uppteckningen är inte avskriven.')}</strong><br/><br/>{l('Vill du vara med och tillgängliggöra samlingarna för fler? Hjälp oss att skriva av berättelser!')}</p><TranscribeButton
					className="button-primary"
					label={l('Skriv av')}
					title={this.state.data.title}
					recordId={this.state.data.id}
					images={this.state.data.media}
					transcriptionType={this.state.data.transcriptiontype}
					 /></div>;
			}
			// Om posten inte innehåller bara en pdf fil (ingen text, inte ljudfiler och inte bilder), då visar vi pdf filen direkt
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
			// Annars visar vi texten som vanligt
			else {
				formatted_text = ""
				if (this.state.data.text) {
					var formatted_text = this.state.data.text.replaceAll("\r\n","<br>"); 
				}
				textElement = <p dangerouslySetInnerHTML={{__html: formatted_text}} />;
				// textElement = <p dangerouslySetInnerHTML={{__html: this.state.data.text}} />;
			}

			// Förbereder kategori länk
			var taxonomyElement;

			if (this.state.data.taxonomy) {
				if (this.state.data.taxonomy.name) {
					taxonomyElement = <p><strong>{l('Kategori')}</strong><br/>
						<a href={'#/places/category/'+this.state.data.taxonomy.category.toLowerCase()+(routeParams ? routeParams : '')}>{l(this.state.data.taxonomy.name)}</a></p>;
				}
				else if (this.state.data.taxonomy.length > 0) {
					taxonomyElement = <p><strong>{l('Kategori')}</strong><br/>
						<span dangerouslySetInnerHTML={{__html: _.map(_.filter(this.state.data.taxonomy, function(taxonomyItem) {
							return taxonomyItem.category;
						}), function(taxonomyItem) {
									return '<a href="#/places/category/'+taxonomyItem.category.toLowerCase()+(routeParams ? routeParams : '')+'">'+l(taxonomyItem.name)+'</a>'
								}).join(', ')}} >
						</span></p>;
				}
			}

			// Prepares country for this record
			let country = 'unknown';
			if ('archive' in this.state.data && 'country' in this.state.data.archive) {
				country = this.state.data.archive.country;
			}

			// Förbereder metadata items. siteOptions i config bestämmer vilken typ av metadata ska synas
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

			// Prepares pages
			let pages = '';
			if ('archive' in this.state.data && 'page' in this.state.data.archive){
				pages = this.state.data.archive.page;
				// If pages is not an interval separated with '-': calculate interval
				// pages can be recorded as interval in case of pages '10a-10b'
				if (!!pages && pages.indexOf('-') == -1) {
					if (this.state.data.archive.total_pages){
						//Remove uncommon non numeric characters in pages (like 10a) for simplicity
						if (typeof pages === 'string') {
							pages = pages.replace(/\D/g,'');
							pages = parseInt(pages);
						}
						let total_pages = parseInt(this.state.data.archive.total_pages);
						if (total_pages > 1){
							let endpage = pages;
							endpage = endpage + total_pages - 1;
							pages = pages.toString() + '-' + endpage.toString();
						}
					}
				}
			}

			// Prepare title
			let titleText = this.state.data.title;
			let transcriptionStatusElement = this.state.data.transcriptionstatus;
			if (transcriptionStatusElement == 'undertranscription' || transcriptionStatusElement == 'transcribed' || transcriptionStatusElement == 'reviewing' || transcriptionStatusElement == 'needsimprovement' || transcriptionStatusElement == 'approved') {
				titleText = 'Titel granskas';
			}

			return <div className={'container'+(this.state.data.id ? '' : ' loading')}>

					<div className="container-header">
						<div className="row">
							<div className="twelve columns">
								<h2>{titleText && titleText != '' ? titleText : l('(Utan titel)')} <ElementNotificationMessage
																placement="under"
																placementOffsetX="-1"
																messageId="saveLegendsNotification"
																forgetAfterClick={true}
																closeTrigger="click"
																autoHide={true}
																message={l('Klicka på stjärnan för att spara sägner till din egen lista.')}>
									<button className={'save-button'+(this.state.saved ? ' saved' : '')} onClick={this.toggleSaveRecord}><span>{l('Spara')}</span></button></ElementNotificationMessage></h2>
								{
									(!config.siteOptions.recordView || !config.siteOptions.recordView.hideMaterialType) &&
									<p><strong>Materialtyp</strong>: {this.state.data.materialtype}</p>
								}
							</div>
						</div>

						{
							!config.siteOptions.hideContactButton &&
							<FeedbackButton title={this.state.data.title} type="Uppteckning" country={country} {..._props}/>
						}
						{
							!config.siteOptions.hideContactButton &&
							<ContributeInfoButton title={this.state.data.title} type="Uppteckning" country={country} id={this.state.data.id} {..._props}/>
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
									<p className="text-small"><strong>{l('Kommentarer')+':'}</strong><br/><span dangerouslySetInnerHTML={{__html: this.state.data.comment}} /></p>
								}

								{
									this.state.data.source && this.state.data.materialtype == 'tryckt' &&
									<p className="text-small"><strong>{l('Tryckt källa') + ': '}</strong><em>{this.state.data.source}</em></p>
								}

								{
									audioItems.length > 0 && (sitevisionUrl || forceFullWidth || (config.siteOptions.recordView && config.siteOptions.recordView.audioPlayerPosition == 'under')) &&
									<div className="table-wrapper">
										<table width="100%">
											<tbody>
												{audioItems}
											</tbody>
										</table>
									</div>
								}

								{
									imageItems.length > 0 && (sitevisionUrl || forceFullWidth || (config.siteOptions.recordView && config.siteOptions.recordView.imagePosition == 'under')) &&
									<div>
										{imageItems}
									</div>
								}

								{
									pdfItems.length > 0 && (sitevisionUrl || forceFullWidth || (config.siteOptions.recordView && config.siteOptions.recordView.pdfIconsPosition == 'under')) &&
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


					<div className="row">

						<div className="six columns">
							<ShareButtons path={config.siteUrl+'#/records/'+this.state.data.id} text={'"'+this.state.data.title+'"'} title={l('Dela på sociala media')} />
						</div>

						{
							config.siteOptions && config.siteOptions.copyrightContent &&
							<div className="six columns">
								<div className="copyright" dangerouslySetInnerHTML={{__html: config.siteOptions.copyrightContent}}></div>
							</div>
						}

					</div>

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
								<p><strong>{l('Sid. nr')}</strong><br/>{pages}</p>
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
								this.state.data.year &&
								<p><strong>{l('Insamlingsår')}</strong><br/>{this.state.data.year.substring(0,4)}</p>
							}

							{
								this.state.data.source &&
								<p><strong>{l('Tryckt källa')}</strong><br/>{this.state.data.source}</p>
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
						<p>{'Post '+this.props.match.params.record_id+ ' finns inte.'}</p>
					</div>
				</div>
		}
	}
}
