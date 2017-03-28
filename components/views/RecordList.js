import React from 'react';
import RecordsCollection from './../collections/RecordsCollection';

export default class RecordList extends React.Component {
	constructor(props) {
		super(props);

		this.currentPage = 1;

		this.state = {
			records: []
		};

		this.nextPage = this.nextPage.bind(this);
		this.prevPage = this.prevPage.bind(this);

		this.collections = new RecordsCollection(function(json) {
			this.setState({
				records: json.data,
				total: json.metadata.total,
				currentPage: this.currentPage
			});
		}.bind(this));
	}

	componentDidMount() {
		if (!this.props.disableAutoFetch) {
			this.fetchData(this.props);
		}
	}

	componentWillReceiveProps(props) {
		var currentParams = JSON.parse(JSON.stringify(this.props));
		if (currentParams.place_id) {
			delete currentParams.place_id;
		}

		var params = JSON.parse(JSON.stringify(props));
		if (params.place_id) {
			delete params.place_id;
		}
		
		if (JSON.stringify(currentParams) !== JSON.stringify(params)) {
			if (currentParams.type != params.type || 
					currentParams.category != params.category || 
					currentParams.person != params.person || 
					currentParams.recordPlace != params.recordPlace) {
				this.currentPage = 1;
			}
			this.fetchData(params);
		}
	}

	nextPage() {
		this.currentPage += 1;
		this.fetchData(this.props);
	}
	
	prevPage() {
		this.currentPage -= 1;
		this.fetchData(this.props);
	}
	
	fetchData(params) {
		this.collections.fetch({
			page: this.currentPage,
			search: params.search || null,
			search_field: params.search_field || null,
			type: params.type || 'arkiv;tryckt',
			category: params.category || null,
			person: params.person || null,
			record_place: params.recordPlace || null
		});
	}

	render() {
		var items = this.state.records ? this.state.records.map(function(item, index) {
			return <tr key={item.id}>
				<td className="text-larger"><a href={'#record/'+item.id}>{item.title ? item.title : '(Untitled'}</a></td>
				<td data-title="Kategori:">{item.taxonomy.name}</td>
				<td data-title="Socken, Landskap:">
				{
					item.places &&
					<a href={'#place/'+item.places[0].id}>{item.places[0].name+', '+item.places[0].landskap}</a>
				}
				</td>
				<td data-title="Uppteckningsår:">{item.year > 0 ? item.year : ''}</td>
				<td data-title="Materialtyp:">{item.type}</td>
			</tr>;

		}.bind(this)) : [];

		return (
			<div className="table-wrapper list-container">

				<table width="100%" className="table-responsive">
					<thead>
						<tr>
							<th scope="col">Titel</th>
							<th scope="col">Kategori</th>
							<th scope="col">Socken, Landskap</th>
							<th scope="col">Uppteckningsår</th>
							<th scope="col">Materialtyp</th>
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
						<p className="page-info"><strong>{'Visar 50 av '+this.state.total}</strong></p><br/>
						<button disabled={this.state.currentPage == 1} className="button prev-button" onClick={this.prevPage}>Föregående</button>
						<span> </span>
						<button disabled={this.state.total <= this.state.currentPage*50} className="button next-button" onClick={this.nextPage}>Nästa</button>
					</div>
				}
			</div>
		);
	}
}