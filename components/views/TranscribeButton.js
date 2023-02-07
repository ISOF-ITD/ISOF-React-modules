import React from 'react';

import config from './../../../scripts/config.js';

import { getPlaceString } from './../utils/helpers.js';

// Main CSS: /ui-components/feedback-buttons.less";
export default class TranscribeButton extends React.Component {
	constructor(props) {
		super(props);

		this.transcribeButtonClick = this.transcribeButtonClick.bind(this);
	}

	transcribeButtonClick() {
		if (window.eventBus) {
			if(this.props.random) {
				let randomDocument = {};
				// get random document and save its data to current state
				// todo: create params with required params from config
				fetch(`${config.apiUrl}random_document/?type=arkiv&recordtype=one_record&transcriptionstatus=readytotranscribe&mark_metadata=transcriptionstatus&categorytypes=tradark&publishstatus=published`)
				.then(function(response) {
								return response.json()
							})
							.then(function(json) {
								randomDocument = json.hits.hits[0]._source;
								console.log(randomDocument);
								window.eventBus.dispatch('overlay.transcribe', {
									url: config.siteUrl+'#/records/'+randomDocument.id,
									id: randomDocument.id,
									archiveId: randomDocument.archive.archive_id,
									title: randomDocument.title,
									images: randomDocument.media,
									transcriptionType: randomDocument.transcriptiontype,
									placeString: getPlaceString(randomDocument.places),
								});
								})
								.then(function(json) {
								}.bind(this))
								.catch(function(ex) {
									console.log('parsing failed', ex)
								});
			}
			else {
				window.eventBus.dispatch('overlay.transcribe', {
					url: config.siteUrl+'#/records/'+this.props.recordId,
					id: this.props.recordId,
					archiveId: this.props.archiveId,
					title: this.props.title,
					type: this.props.type,
					images: this.props.images,
					transcriptionType: this.props.transcriptionType,
					placeString: getPlaceString(this.props.places),
				});
			}
			
		}
	}

	render() {
		return <button className={'transcribe-button'+this.props.className ? ' '+this.props.className : ''} onClick={this.transcribeButtonClick}>{this.props.label}</button>;
	}
}