import React from 'react';

import SimpleMap from './SimpleMap';
import RecordList from './RecordList';

import config from './../../../scripts/config.js';

export default class PersonView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {},
			personId: null
		};

		this.url = config.apiUrl+'person/';
	}

	componentDidMount() {
		this.fetchData(this.props.params);

		if (this.props.params.person_id) {
			this.setState({
				personId: this.props.params.person_id
			});
		}
	}

	componentWillReceiveProps(props) {
		if (props.params.person_id != this.props.params.person_id) {
			this.fetchData(props.params);

			this.setState({
				personId: props.params.person_id
			});
		}
	}

	fetchData(params) {
		if (params.person_id) {
			fetch(this.url+params.person_id)
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
		var recordItems = this.state.data.records && this.state.data.records.length > 0 ? this.state.data.records.map(function(record, index) {
			return <tr key={index}>
				<td data-title=""><a href={'#record/'+record.id}>{record.title ? record.title : '(Utan titel)'}</a></td>
				<td data-title="Kategori:">{record.taxonomy.name}</td>
				<td data-title="Socken, Landskap:">
					{
						record.places &&
						<a href={'#place/'+record.places[0].id}>{record.places[0].name+', '+record.places[0].landskap}</a>
					}
				</td>
				<td data-title="Roll:">{record.relation == 'c' ? 'Upptecknare' : record.relation == 'i' ? 'Informant' : ''}</td>
				<td data-title="Uppteckningsår:">{record.year > 0 ? record.year : ''}</td>
				<td data-title="Materialtyp:">{record.type}</td>
			</tr>
		}) : [];

		return (
			<div className={'container'+(this.state.data.id ? '' : ' loading')}>
				
				<div className="container-header">
					<div className="row">
						<div className="twelve columns">
							<h2>{this.state.data.name ? this.state.data.name : ''}</h2>
							<p>
							{
								(this.state.data.birth_year && this.state.data.birth_year > 0 ? 'Föddes '+this.state.data.birth_year : '')+
								(this.state.data.birth_year && this.state.data.birth_year > 0 && this.state.data.home ? ' i ' : '')
							}
							{
								this.state.data.home &&
								<a href={'#place/'+this.state.data.home[0].id}>{this.state.data.home[0].name+', '+this.state.data.home[0].landskap}</a>
							}
							</p>
						</div>
					</div>
				</div>

				{
					this.state.data.home && this.state.data.home.length > 0 && this.state.data.home[0].lat && this.state.data.home[0].lng &&
					<div className="row">
						<div className="twelve columns">
							<SimpleMap marker={{lat: this.state.data.home[0].lat, lng: this.state.data.home[0].lng, label: this.state.data.home[0].name}} />
						</div>
					</div>
				}

				<div className="row">

					<div className={(this.state.data.image ? 'eight' : 'twelve')+' columns'}>
						{
							this.state.data.biography &&
							<p dangerouslySetInnerHTML={{__html: this.state.data.biography}} />
						}
					</div>
					{
						this.state.data.image &&
						<div className="four columns">
							<img className="archive-image" src={'http://www4.sprakochfolkminnen.se/Folkminnen/Svenska_sagor_filer/'+this.state.data.image} alt="" />
						</div>
					}

				</div>

				<hr/>

				<div className="row">
			
					<div className="twelve columns">
						<h3>Uppteckningar</h3>

						<RecordList disableAutoFetch="true" person={this.state.personId} />

					</div>
				</div>

			</div>
		);
	}
}