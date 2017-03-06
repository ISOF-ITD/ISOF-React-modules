import React from 'react';
import RecordList from './RecordList';
import WindowScroll from './../../utils/windowScroll';

export default class RecordListWrapper extends React.Component {
	constructor(props) {
		super(props);

		this.scrollToList = this.scrollToList.bind(this);
	}

	scrollToList() {
		new WindowScroll().scrollToY(500, 1, 'easeInOutSine');
	}

	render() {
		return (
			<div className="search-results-wrapper">
				<a className="search-results-button visible" onClick={this.scrollToList}><strong>Visa sökträffar som lista</strong></a>

				<div className="container-wrapper">
					<div className="container">

						<div className="row">
							<h2>Sökträffar som lista</h2>
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
				</div>
			</div>
		);
	}
}