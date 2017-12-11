import React from 'react';
import { hashHistory } from 'react-router';

import RecordsCollection from './../collections/RecordsCollection';
import RecordListItem from './RecordListItem';

import config from './../../../scripts/config.js';
import routeHelper from './../../../scripts/utils/routeHelper';

export default class PersonList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			persons: []
		};

		this.url = config.apiUrl+(this.props.personType || 'persons')+'/';
	}

	componentDidMount() {
		if (this.props.place) {
			this.handleProps(this.props);
		}
	}

	componentWillReceiveProps(props) {
		if (props.place && props.place != this.props.place) {		
			this.handleProps(props);
		}
	}

	handleProps(props) {
		var fetchParams = {
			socken_id: props.place
		};

		if (!props.includeNordic) {
			fetchParams.country = config.country;
		}

		this.fetchData(fetchParams);
	}
	
	fetchData(params) {
		var paramStrings = [];

		var queryParams = Object.assign({}, config.requiredParams, params);

		for (var key in queryParams) {
			if (queryParams[key] && key != 'page') {
				paramStrings.push(key+'='+queryParams[key]);
			}
		}

		var paramString = paramStrings.join('&');

		this.setState({
			persons: []
		}, function() {
			fetch(this.url+'?'+paramString)
				.then(function(response) {
					return response.json()
				}).then(function(json) {
					this.setState({
						persons: json.data
					});
				}.bind(this)).catch(function(ex) {
					console.log('parsing failed', ex)
				})
			;
		}.bind(this));
	}

	render() {
		var items = this.state.persons ? this.state.persons.map(function(person, index) {
			return <tr key={index}>
				<td>
					{
						!config.siteOptions.disablePersonLinks == true ?
						<a href={'#person/'+person.id}>{person.name}</a> :
						person.name
					}
				</td>
				<td>{person.birth_year > 0 ? person.birth_year : ''}</td>
			</tr>;

		}.bind(this)) : [];

		if (this.state.persons) {
			return (
				<div className={'table-wrapper list-container'+(this.state.persons.length == 0 ? ' loading' : '')}>

					<table width="100%" className="table-responsive">
						<thead>
							<tr>
								<th>{l('Namn')}</th>
								<th>{l('Födelseår')}</th>
							</tr>
						</thead>
						<tbody>
							{items}
						</tbody>
					</table>

				</div>
			);			
		}
		else {
			return (
				<div className="table-wrapper list-container">
					<h3>{l('Inga sökträffar')}</h3>
				</div>
			);
		}
	}
}