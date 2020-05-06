import React from 'react';

import RecordList from './RecordList';
import PersonList from './PersonList';
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

		this.url = config.restApiUrl+'locations/';
	}

	handleParams(params) {
		var fetchParams = params;

		// TODO: Is 'nordic' needed in this component? Is it for filter on country in placeview or to hand over to subcomponent as RecordList? (or inconsistency if placeid not in current country of map?)
		// country is also set in RecordList! 
		if (params.nordic != 'true') {
			fetchParams.country = config.country;
		}
		this.fetchData(fetchParams);

		var state = {};
		if (params.type) {
			state['type'] = params.type;
		}
		if (params.category) {
			state['category'] = params.category;
		}
		if (params.place_id) {
			state['recordPlace'] = params.place_id;
		}
		if (params.search) {
			state['searchQuery'] = params.search;
		}
		if (params.search_field) {
			state['searchField'] = params.search_field;
		}
		if (params.record_ids) {
			state['record_ids'] = params.record_ids;
		}
		if (params.has_metadata) {
			state['has_metadata'] = params.has_metadata;
		}
		if (params.gender) {
			state['gender'] = params.gender;
		}
		if (params.birth_years) {
			state['birth_years'] = params.birth_years;
		}
		// TODO: Is 'nordic' needed in this component? Is it for filter on country in placeview or to hand over to subcomponent as RecordList? (or inconsistency if placeid not in current country of map?)
		if (params.nordic) {
			state['nordic'] = true;
		}	
		this.setState(state);
	}

	componentDidMount() {
		this.handleParams(this.props.match.params);
	}

	componentWillReceiveProps(props) {
		if (props.match.params.place_id !== this.props.match.params.place_id) {
			this.handleParams(props.match.params)
		}
	}

	fetchData(params) {
		if (params.place_id) {
			fetch(this.url+params.place_id+'/')
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
		let _props = this.props;
		var informantsItems = this.state.data.informants && this.state.data.informants.length > 0 ? this.state.data.informants.map(function(informant, index) {
			return <tr key={index}>
				<td><a href={'#person/'+informant.id}>{informant.name}</a></td>
				<td>{informant.birth_year > 0 ? informant.birth_year : ''}</td>
			</tr>;
		}.bind(this)) : [];

		var personsItems = this.state.data.persons && this.state.data.persons.length > 0 ? this.state.data.persons.map(function(person, index) {
			return <tr key={index}>
				<td>
					{
						!config.siteOptions.disablePersonLinks == true ?
						(
							config.siteOptions.disableInformantLinks == true && person.relation == 'i' ?
							person.name :
							<a href={'#person/'+person.id}>{person.name ? person.name : ''}</a>
						) :
						person.name
					}
				</td>
				<td>{person.birth_year > 0 ? person.birth_year : ''}</td>
			</tr>;
		}.bind(this)) : [];

		var recordsItems = this.state.data.records && this.state.data.records.length > 0 ? this.state.data.records.map(function(record, index) {
			return <tr key={index}>
				<td data-title="">
					<a href={'#records/'+record.id}>
						{
							record.type == 'inspelning' &&
							<ListPlayButton />
						}
						{record.title ? record.title : '(Untitled)'}
					</a>
				</td>
				<td data-title={l('Kategori')}>{record.taxonomy.name}</td>
				<td data-title={l('Socken, Landskap')}>
					{record.places &&
						<span>{record.places[0].name+', '+record.places[0].landskap}</span>
					}
				</td>
				<td data-title={l('Insamlingsår')}>{record.year > 0 ? record.year : ''}</td>
				<td data-title={l('Materialtyp')}>{record.materialtype}</td>
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
									// Test: Each country handled different (Not yet working)
									//this.state.data.archive ? this.state.data.archive.country == 'Finland' &&
									//this.state.data.fylke ?
									//<span><strong>{l('Landskap')}</strong>: {this.state.data.fylke}</span> :
									this.state.data.fylke ?
									<span><strong>{l('Fylke')}</strong> {this.state.data.fylke}</span> :
									this.state.data.harad ?
									<span><strong>{l('Härad')}</strong>: {this.state.data.harad}, <strong>{l('Län')}</strong>: {this.state.data.lan}, <strong>{l('Landskap')}</strong>: {this.state.data.landskap}</span>
									: null
								}
							</p>
						</div>
					</div>
				</div>

				{
					!_props.hideMap &&
					<div className="row">
						<div className="twelve columns">
							<SimpleMap marker={this.state.data.location && this.state.data.location.lat && this.state.data.location.lon ? {lat: this.state.data.location.lat, lng: this.state.data.location.lon, label: this.state.data.name} : null} />
						</div>
					</div>
				}

				{
					<div className="row search-results-container">
						<div className="twelve columns">
	
							{
								!this.props.showOnlyResults &&
								<h3>{l('Sökträffar')}</h3>
							}

							<RecordList 
								disableRouterPagination={true}
								highlightRecordsWithMetadataField={this.props.highlightRecordsWithMetadataField} 
								record_ids={this.state.record_ids} 
								type={this.state.type} 
								category={this.state.category} 
								has_metadata={this.state.has_metadata} 
								recordPlace={this.state.recordPlace} 
								search={this.state.searchQuery} 
								gender={this.state.gender}
								birth_years={this.state.birth_years}
								nordic={this.state.nordic}
								search_field={this.state.searchField} 
								{..._props}
								/>

						</div>
					</div>
				}

				{
					!this.props.showOnlyResults &&
					<div>

						{
							this.state.data.records && this.state.data.records.length > 0 &&
							<hr/>
						}

						{
							<div className="row">
								<div className="twelve columns">
									<h3>{l('Samtliga uppteckningar från orten')}</h3>

									<RecordList disableRouterPagination={true} highlightRecordsWithMetadataField={this.props.highlightRecordsWithMetadataField} 
										has_metadata={this.state.has_metadata} 
										nordic={this.state.nordic}
										recordPlace={this.state.recordPlace} />		
								</div>
							</div>

						}

					</div>
				}

				{
					!this.props.hidePersons &&
					<div className="row">
						<div className="twelve columns">
							<PersonList personType="informants" title={l('Intervjuade personer')} 
								nordic={this.state.nordic}
								place={this.state.recordPlace}  />
						</div>
					</div>

				}

			</div>
		);
	}
}