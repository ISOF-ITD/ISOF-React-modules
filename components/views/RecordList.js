import React from 'react';
import { hashHistory } from 'react-router';

import RecordsCollection from './../collections/RecordsCollection';
import RecordListItem from './RecordListItem';

import config from './../../../scripts/config.js';
import routeHelper from './../../../scripts/utils/routeHelper';

export default class RecordList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			records: [],
			fetchingPage: false,
			currentPage: 1
		};

		this.nextPage = this.nextPage.bind(this);
		this.prevPage = this.prevPage.bind(this);

		this.collections = new RecordsCollection(function(json) {
			if (!json.data || json.data.length == 0) {
				if (window.eventBus) {
					window.eventBus.dispatch('popup-notification.notify', null, l('Inga sökträffar'));
				}
			}

			this.setState({
				records: json.data,
				total: json.metadata.total,
				fetchingPage: false
			});
		}.bind(this));
	}

	componentDidMount() {
		if (!this.props.disableAutoFetch) {
			this.setState({
				currentPage: this.props.page || 1
			}, function() {
				this.fetchData(this.props);
			}.bind(this));
		}
	}

	componentWillReceiveProps(props) {
		console.log(props);
		var currentParams = JSON.parse(JSON.stringify(this.props));
		if (currentParams.place_id) {
			delete currentParams.place_id;
		}

		var params = JSON.parse(JSON.stringify(props));
		if (params.place_id) {
			delete params.place_id;
		}
		
		if (JSON.stringify(currentParams) !== JSON.stringify(params)) {
			/*
			if (currentParams.search != params.search || 
					currentParams.type != params.type || 
					currentParams.category != params.category || 
					currentParams.person != params.person || 
					currentParams.recordPlace != params.recordPlace) {
				this.setState({
					currentPage: 1
				});
			}
			*/
			this.setState({
				currentPage: params.page || 1
			}, function() {
				this.fetchData(params);
			}.bind(this));
		}
	}

	nextPage() {
		if (this.props.disableRouterPagination) {
			this.setState({
				currentPage: this.state.currentPage+1
			}, function() {
				this.fetchData(this.props);
			}.bind(this));
		}
		else {
			hashHistory.push('/places'+routeHelper.createSearchRoute(this.props)+'/page/'+(Number(this.state.currentPage)+1));
		}
	}
	
	prevPage() {
		if (this.props.disableRouterPagination) {
			this.setState({
				currentPage: this.state.currentPage-1
			}, function() {
				this.fetchData(this.props);
			}.bind(this));
		}
		else {
			hashHistory.push('/places'+routeHelper.createSearchRoute(this.props)+'/page/'+(Number(this.state.currentPage)-1));
		}
	}
	
	fetchData(params) {
		this.setState({
			fetchingPage: true
		});

		var fetchParams = {
			from: (this.state.currentPage-1)*50,
			size: 50,
			search: params.search || null,
			search_field: params.search_field || null,
			category: params.category || null,
			person_id: params.person || null,
			socken_id: params.recordPlace || null,
			gender: params.gender && params.person_relation ? params.person_relation+':'+params.gender : null,
			birth_years: params.birth_years ? (params.person_relation ? params.person_relation+':'+(params.gender ? params.gender+':' : '')+params.birth_years : params.birth_years) : null,
			record_ids: params.record_ids || null,
			has_metadata: params.has_metadata || null
		};

		if (!params.nordic) {
			fetchParams.country = config.country;
		}

		this.collections.fetch(fetchParams);
	}

	render() {
		var searchRouteParams = routeHelper.createSearchRoute(this.props);


		var items = this.state.records ? this.state.records.map(function(item, index) {
			return <RecordListItem key={item._source.id} 
				item={item} routeParams={searchRouteParams} 
				highlightRecordsWithMetadataField={this.props.highlightRecordsWithMetadataField} />;

		}.bind(this)) : [];

		if (this.state.records) {
			return (
				<div className={'table-wrapper records-list list-container'+(this.state.records.length == 0 ? ' loading' : this.state.fetchingPage ? ' loading-page' : '')}>

					<table width="100%" className="table-responsive">
						<thead>
							<tr>
								<th scope="col">{l('Titel')}</th>
								{
									!config.siteOptions.recordList || !config.siteOptions.recordList.hideCategories == true &&
									<th scope="col">{l('Kategori')}</th>
								}
								<th scope="col">{l('Socken, Landskap')}</th>
								<th scope="col">{l('Uppteckningsår')}</th>
								{
									!config.siteOptions.recordList || !config.siteOptions.recordList.hideMaterialType == true &&
									<th scope="col">{l('Materialtyp')}</th>
								}
							</tr>
						</thead>
						<tbody>
							{items}
						</tbody>
					</table>

					{
						this.state.total > 50 &&
						<div className="list-pagination">
							<hr/>
							<p className="page-info"><strong>{l('Visar')+' '+((this.state.currentPage*50)-49)+'-'+(this.state.currentPage*50 > this.state.total ? this.state.total : this.state.currentPage*50)+' '+l('av')+' '+this.state.total}</strong></p><br/>
							<button disabled={this.state.currentPage == 1} className="button prev-button" onClick={this.prevPage}>{l('Föregående')}</button>
							<span> </span>
							<button disabled={this.state.total <= this.state.currentPage*50} className="button next-button" onClick={this.nextPage}>{l('Nästa')}</button>
						</div>
					}
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