import React from 'react';

import config from './../../../scripts/config.js';
import localLibrary from './../../utils/localLibrary.js';

import ShareButtons from './ShareButtons';

export default class RecordView extends React.Component {
	constructor(props) {
		super(props);

		this.toggleSaveRecord = this.toggleSaveRecord.bind(this);

		this.state = {
			data: {},
			saved: false
		};

		this.url = config.apiUrl+'record/';
	}

	componentDidMount() {
		this.fetchData(this.props.params);
	}

	componentWillReceiveProps(props) {
		if (props.params.record_id != this.props.params.record_id) {
			this.fetchData(props.params);
		}
	}

	toggleSaveRecord() {
		var libraryItem = {
			id: this.state.data.id,
			title: this.state.data.title
		};

		if (!localLibrary.find(libraryItem)) {
			localLibrary.add(libraryItem);
			this.setState({
				saved: true
			});
		}
		else {
			localLibrary.remove(libraryItem);
			this.setState({
				saved: false
			});
		}
	}

	fetchData(params) {
		if (params.record_id) {
			fetch(this.url+params.record_id)
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
					console.log('parsing failed', ex)
				})
			;
		}
	}

	render() {
		var mediaItems = this.state.data.media && this.state.data.media.length > 0 ? this.state.data.media.map(function(mediaItem, index) {
			if (mediaItem.type == 'image') {
				return <a key={index} className="image-link" target="_blank" href={config.imageUrl+mediaItem.source}><img className="archive-image" src={config.imageUrl+mediaItem.source} alt="" /></a>
			}
			else if (mediaItem.type == 'audio') {
				return <div key={index}>
					{
						mediaItem.title && mediaItem.title != '' &&
						<p>{mediaItem.title}<br/><br/></p>
					}
					<audio controls="controls" src={config.audioUrl+mediaItem.source}></audio>
					<hr/>
				</div>;
			}
		}) : [];

		var personItems = this.state.data.persons && this.state.data.persons.length > 0 ? this.state.data.persons.map(function(person, index) {
			return <tr key={index}>
				<td data-title=""><a href={'#person/'+person.id}>{person.name ? person.name : ''}</a></td>
				<td data-title="Födelseår">{person.birth_year && person.birth_year > 0 ? person.birth_year : ''}</td>
				<td data-title="Födelseort">
					{
						person.home && person.home.length > 0 &&
						<a href={'#place/'+person.home.id}>{person.home.name+', '+person.home.harad}</a>
					}
				</td>
				<td data-title="Roll">{person.relation == 'collector' ? 'Upptecknare' : person.relation == 'informant' ? 'Informant' : ''}</td>
			</tr>;
		}) : [];


		var placeItems = this.state.data.places && this.state.data.places.length > 0 ? this.state.data.places.map(function(place, index) {
			return <tr key={index}>
				<td><a href={'#place/'+place.id}>{place.name+', '+place.harad}</a></td>
			</tr>;
		}) : [];

		return <div className={'container'+(this.state.data.id ? '' : ' loading')}>
		
				<div className="container-header">
					<div className="row">
						<div className="twelve columns">
							<h2>{this.state.data.title} <button className={'save-button'+(this.state.saved ? ' saved' : '')} onClick={this.toggleSaveRecord}><span>Spara</span></button></h2>
							<p><strong>Materialtyp</strong>: {this.state.data.type}</p>
						</div>
					</div>
				</div>

  				<div className="row">

					{
						this.state.data.text &&
						<div className="six columns">
							<p dangerouslySetInnerHTML={{__html: this.state.data.text}} />

							{
								this.state.data.comment && this.state.data.comment != '' &&
								<p><strong>Kommentarer:</strong><br/>{this.state.data.comment}</p>
							}
							<ShareButtons path={'record/'+this.state.data.id} />
						</div>
					}
					{
						mediaItems.length > 0 &&
						<div className={'columns '+(this.state.data.text ? 'four u-pull-right' : 'twelve')}>
							{mediaItems}
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
							<div className="map-container small"></div>
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
						<p><strong>Materialtyp</strong><br/>
							{this.state.data.type ? this.state.data.type.charAt(0).toUpperCase() + this.state.data.type.slice(1) : ''}
						</p>

						<p><strong>Kategori</strong><br/>
							{this.state.data.taxonomy ? this.state.data.taxonomy.name : ''}</p>
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