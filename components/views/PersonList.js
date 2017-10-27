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
			this.fetchData({
				socken_id: this.props.place,
				type: config.apiRecordsType
			});
		}
	}

	componentWillReceiveProps(props) {
		if (props.place && props.place != this.props.place) {		
			this.fetchData({
				socken_id: props.place,
				type: config.apiRecordsType
			});
		}
	}
	
	fetchData(params) {
		var paramStrings = [];

		for (var key in params) {
			if (params[key] && key != 'page') {
				paramStrings.push(key+'='+params[key]);
			}
		}

		if (config.fetchOnlyCategories) {
			paramStrings.push('only_categories=true');
		}

		if (!window.applicationSettings.includeNordic) {
			paramStrings.push('country='+config.country);
		}

		var paramString = paramStrings.join('&');

		this.setState({
			persons: []
		}, function() {
			fetch(this.url+'?'+paramStrings)
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
		console.log(this.state.persons);

		var items = this.state.persons ? this.state.persons.map(function(person, index) {
			return <tr key={index}>
				<td><a href={'#person/'+person.id}>{person.name}</a></td>
				<td>{person.birth_year > 0 ? person.birth_year : ''}</td>
			</tr>;

		}.bind(this)) : [];

		if (this.state.persons) {
			return (
				<div className={'table-wrapper list-container'+(this.state.persons.length == 0 ? ' loading' : '')}>

					<table width="100%" className="table-responsive">
						<thead>
							<tr>
								<th>Namn</th>
								<th>Födelseår</th>
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
					<h3>Inga sökträffar</h3>
				</div>
			);
		}
	}
}