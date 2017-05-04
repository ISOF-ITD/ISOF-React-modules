import React from 'react';
import RecordList from './RecordList';
import WindowScroll from './../../utils/windowScroll';

export default class RecordListWrapper extends React.Component {
	constructor(props) {
		super(props);

		console.log(props);
	}

	render() {
		return (
			<div className="container">

				<div className="container-header">
					<div className="row">
						<div className="twelve columns">
							<h2>Sökträffar som lista</h2>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="records-list-wrapper">
						<RecordList 
							search={this.props.params.search || null} 
							search_field={this.props.params.search_field || null} 
							type={this.props.params.type || null} 
							category={this.props.params.category || null} 
							person={this.props.params.person || null}
						/>
					</div>
				</div>
			</div>
		);
	}
}