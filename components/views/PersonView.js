import React from 'react';

import SimpleMap from './SimpleMap';
import RecordList from './RecordList';
import ContributeInfoButton from './ContributeInfoButton';
import FeedbackButton from './FeedbackButton';

import config from './../../../scripts/config.js';

export default class PersonView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {},
			personId: null
		};

		this.url = config.restApiUrl+'persons/';
	}

	componentDidMount() {
		this.fetchData(this.props.match.params);

		if (this.props.match.params.person_id) {
			this.setState({
				personId: this.props.match.params.person_id
			});
		}
	}

	UNSAFE_componentWillReceiveProps(props) {
		if (props.match.params.person_id != this.props.match.params.person_id) {
			this.fetchData(props.match.params);

			this.setState({
				personId: props.match.params.person_id
			});
		}
	}

	fetchData(params) {
		if (params.person_id) {
			fetch(this.url+params.person_id+'/')
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

		//Prepare person county/region:
		let person_county = '';
		if (!!this.state.data.places) {
			if (!!this.state.data.places[0]) {
				let place = this.state.data.places[0];
				if (!!place) {
					person_county = place.name;
					if (!!place.landskap) {
						person_county = person_county + ', ' + place.landskap;
					} 
					// TODO: set landskap = fylke in database and remove this?
					if (!!place.fylke) {
						person_county = person_county + ', ' + place.fylke;
					}
				}
			}
		}

		// Prepare nordic:
		// TODO Replace with "Application defined filter parameter" where it is used (Sägenkartan)
		let nordic = '';
		if (window.applicationSettings) {
			if (window.applicationSettings.includeNordic) {
					nordic = '/nordic/true';
			}
		}
		
		// TODO: Check if RecordList component below has replaced this part so: it is not used anymore and can be removed?
		var recordItems = this.state.data.records && this.state.data.records.length > 0 ? this.state.data.records.map(function(record, index) {

			//Prepare county/region:
			let county = '';
			if (!!record.places[0]) {
				county = record.places[0].name;
				if (!!record.places[0].landskap) {
					county = county + ', ' + record.places[0].landskap;
				} 
				// TODO: set landskap = fylke in database and remove this?
				if (!!record.places[0].fylke) {
					county = county + ', ' + record.places[0].fylke;
				}
			}

			return <tr key={index}>
				<td data-title=""><a href={'#/records/'+record.id}>{record.title ? record.title : l('(Utan titel)')}</a></td>
				<td data-title={l('Kategori')+':'}>{record.taxonomy.name}</td>
				<td data-title={l('Socken, Landskap')+':'}>
					{
						record.places &&
						<a href={'#/places/'+record.places[0].id+nordic}>{county}</a>
					}
				</td>
				<td data-title={l('Roll')+':'}>{record.relation == 'c' ? l('Upptecknare') : record.relation == 'i' ? l('Informant') : ''}</td>
				<td data-title={l('Insamlingsår')+':'}>{record.year > 0 ? record.year : ''}</td>
				<td data-title={l('Materialtyp')+':'}>{record.type}</td>
			</tr>
		}) : [];

		return (
			<div className={'container'+(this.state.data.id ? '' : ' loading')}>

				<div className="container-header">
					<div className="row">
						<div className="twelve columns">
							<h2>{this.state.data.name || ''}</h2>
							<p>
							{
								(this.state.data.birth_year && this.state.data.birth_year > 0 ? l('Föddes')+' '+this.state.data.birth_year : '')+
								(this.state.data.birth_year && this.state.data.birth_year > 0 && this.state.data.places ? ' i ' : '')
							}
							{
								this.state.data.places && this.state.data.places.length > 0 &&
								<a href={'#/places/'+this.state.data.places[0].id+nordic}>{person_county}</a>
							}
							</p>
						</div>
					</div>

					{
						!config.siteOptions.hideContactButton &&
						<FeedbackButton title={this.state.data.name || ''} type="Person" {..._props} />
					}
					{
						!config.siteOptions.hideContactButton &&
						<ContributeInfoButton title={this.state.data.name || ''} type="Person" />
					}
				</div>

				{
					this.state.data.places && this.state.data.places.length > 0 && this.state.data.places[0].lat && this.state.data.places[0].lng &&
					<div className="row">
						<div className="twelve columns">
							<SimpleMap marker={{lat: this.state.data.places[0].lat, lng: this.state.data.places[0].lng, label: this.state.data.places[0].name}} />
						</div>
					</div>
				}

				<div className="row">

					<div className={(this.state.data.image ? 'eight' : 'twelve')+' columns'}>
						{
							this.state.data.biography &&
							<p dangerouslySetInnerHTML={{__html: this.state.data.biography.replace(/(?:\r\n|\r|\n)/g, '<br />')}} />
						}
					</div>
					{
						this.state.data.image &&
						<div className="four columns">
							<img className="archive-image" src={(config.personImageUrl || config.imageUrl)+this.state.data.image} alt="" />
						</div>
					}

				</div>

				<hr/>

				<div className="row">

					<div className="twelve columns">
						<h3>{l('Uppteckningar')}</h3>

						<RecordList nordic={window.applicationSettings.includeNordic} disableRouterPagination={true} disableAutoFetch={true} person={this.state.personId} {..._props} />

					</div>
				</div>

			</div>
		);
	}
}
