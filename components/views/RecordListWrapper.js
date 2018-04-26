import React from 'react';
import RecordList from './RecordList';
import WindowScroll from './../../utils/windowScroll';

export default class RecordListWrapper extends React.Component {
	constructor(props) {
		super(props);

		this.languageChangedHandler = this.languageChangedHandler.bind(this);
	}

	languageChangedHandler() {
		this.forceUpdate();
	}

	componentDidMount() {
		if (window.eventBus) {
			window.eventBus.addEventListener('Lang.setCurrentLang', this.languageChangedHandler)
		}
	}

	componentWillUnmount() {
		if (window.eventBus) {
			window.eventBus.removeEventListener('Lang.setCurrentLang', this.languageChangedHandler)
		}
	}

	render() {
		return (
			<div className="container">

				<div className="container-header">
					<div className="row">
						<div className="twelve columns">
							<h2>{l('Sökträffar som lista')}</h2>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="records-list-wrapper">
						<RecordList 
							search={this.props.params.search || null} 
							search_field={this.props.params.search_field || null} 
							type={this.props.params.type || null} 
							type={this.props.params.type || null} 
							category={this.props.params.category || null} 
							person={this.props.params.person || null}
							record_ids={this.props.params.record_ids || null}
							person_relation={this.props.params.person_relation || null}
							gender={this.props.params.gender || null}
							birth_years={this.props.params.birth_years || null}
							page={this.props.params.page || null} 
							has_metadata={this.props.params.has_metadata || null}
							nordic={this.props.params.nordic}
							highlightRecordsWithMetadataField={this.props.route.highlightRecordsWithMetadataField}
						/>
					</div>
				</div>
			</div>
		);
	}
}