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
		let _props = this.props;
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
							searchParams={this.props.match.params}
							search={this.props.match.params.search || null} 
							search_field={this.props.match.params.search_field || null} 
							type={this.props.match.params.type || null} 
							type={this.props.match.params.type || null} 
							category={this.props.match.params.category || null} 
							person={this.props.match.params.person || null}
							record_ids={this.props.match.params.record_ids || null}
							person_relation={this.props.match.params.person_relation || null}
							gender={this.props.match.params.gender || null}
							birth_years={this.props.match.params.birth_years || null}
							page={this.props.match.params.page || null} 
							has_metadata={this.props.match.params.has_metadata || null}
							nordic={this.props.match.params.nordic}
							highlightRecordsWithMetadataField={this.props.highlightRecordsWithMetadataField}
							{..._props}
						/>
					</div>
				</div>
			</div>
		);
	}
}