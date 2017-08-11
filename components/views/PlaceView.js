import React from 'react';

import RecordList from './RecordList';
import SimpleMap from './SimpleMap';
import ListPlayButton from './ListPlayButton';

import config from './../../../scripts/config.js';

export default class PlaceView extends React.Component {
	constructor(props) {
		super(props);

		window.placeView = this;

		this.state = {
			data: {},
			placeMarker: {}
		};

		this.url = config.apiUrl+'place/';
	}

	componentDidMount() {
		this.fetchData(this.props.params);

		var state = {};
		if (this.props.params.category) {
			state['category'] = this.props.params.category;
		}
		if (this.props.params.type) {
			state['type'] = this.props.params.type;
		}
		if (this.props.params.place_id) {
			state['recordPlace'] = this.props.params.place_id;
		}
		if (this.props.params.search) {
			state['searchQuery'] = this.props.params.search;
		}
		if (this.props.params.search_field) {
			state['searchField'] = this.props.params.search_field;
		}
		this.setState(state);

	}

	componentWillReceiveProps(props) {
		if (props.params.place_id != this.props.params.place_id) {
			this.fetchData(props.params);
		}
	}

	fetchData(params) {
		if (params.place_id) {
			fetch(this.url+params.place_id+'/type/'+config.apiRecordsType+(config.fetchOnlyCategories ? '/only_categories/true' : ''))
				.then(function(response) {
					return response.json()
				}).then(function(json) {
					this.setState({
						data: json
					});
				}.bind(this)).catch(function(ex) {
					console.log('parsing failed', ex)
				})
			;
		}
	}

	render() {
		var informantsItems = this.state.data.informants && this.state.data.informants.length > 0 ? this.state.data.informants.map(function(informant, index) {
			return <tr key={index}>
				<td><a href={'#person/'+informant.id}>{informant.name}</a></td>
				<td>{informant.birth_year > 0 ? informant.birth_year : ''}</td>
			</tr>;
		}.bind(this)) : [];

		var recordsItems = this.state.data.records && this.state.data.records.length > 0 ? this.state.data.records.map(function(record, index) {
			return <tr key={index}>
				<td data-title="">
					<a href={'#record/'+record.id}>
						{
							record.type == 'inspelning' &&
							<ListPlayButton />
						}
						{record.title ? record.title : '(Untitled)'}
					</a>
				</td>
				<td data-title="Kategori">{record.taxonomy.name}</td>
				<td data-title="Socken, Landskap">
					{record.places &&
						<span>{record.places[0].name+', '+record.places[0].landskap}</span>
					}
				</td>
				<td data-title="Uppteckningsår">{record.year > 0 ? record.year : ''}</td>
				<td data-title="Materialtyp">{record.type}</td>
			</tr>;
		}.bind(this)) : [];

		return (
			<div className={'container'+(this.state.data.id ? '' : ' loading')}>
		
				<div className="container-header">
					<div className="row">
						<div className="twelve columns">
							<h2>{this.state.data.name}</h2>
							<p>
								{
									this.state.data.fylke ?
									<span><strong>Fylke</strong>: {this.state.data.fylke}</span> :
									<span><strong>Härad</strong>: {this.state.data.harad}, <strong>Län</strong>: {this.state.data.county}, <strong>Landskap</strong>: {this.state.data.landskap}</span>
								}
							</p>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="twelve columns">
						<SimpleMap marker={this.state.data.lat && this.state.data.lng ? {lat: this.state.data.lat, lng: this.state.data.lng, label: this.state.data.name} : null} />
					</div>
				</div>

				{
					(this.state.category || this.state.type || this.state.searchQuery || this.state.searchField) &&
					<div className="row search-results-container">
						<div className="twelve columns">
							<h3>Sökträffar</h3>

							<RecordList category={this.state.category} type={this.state.type} recordPlace={this.state.recordPlace} search={this.state.searchQuery} search_field={this.state.searchField} />

						</div>
					</div>
				}

				{
					this.state.data.informants && this.state.data.informants.length > 0 &&
					<hr/>
				}

				{
					this.state.data.informants && this.state.data.informants.length > 0 &&

					<div className="row">
						<div className="twelve columns">
							<h3>Intervjuade personer</h3>

							<div className="table-wrapper">
								<table width="100%">
									<thead>
										<tr>
											<th>Namn</th>
											<th>Födelseår</th>
										</tr>
									</thead>
									<tbody>
										{informantsItems}
									</tbody>
								</table>
							</div>
						</div>
					</div>

				}

				{
					this.state.data.records && this.state.data.records.length > 0 &&
					<hr/>
				}

				{
					this.state.data.records && this.state.data.records.length > 0 &&

					<div className="row">
						<div className="twelve columns">
							<h3>Samtliga uppteckningar från orten</h3>

							<div className="table-wrapper">
								<table width="100%" className="table-responsive">
									<thead>
										<tr>
											<th>Titel</th>
											<th>Kategori</th>
											<th>Socken, Landskap</th>
											<th>Uppteckningsår</th>
											<th>Materialtyp</th>
										</tr>
									</thead>
									<tbody>
										{recordsItems}
									</tbody>
								</table>
							</div>
						</div>
					</div>

				}

			</div>
		);
	}
}