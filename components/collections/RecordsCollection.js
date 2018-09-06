import 'whatwg-fetch';
import _ from 'underscore';

import config from './../../../scripts/config.js';

export default class RecordsCollection {
	constructor(onComplete) {
		this.url = config.apiUrl+'documents/';
		this.onComplete = onComplete;
	}

	fetch(params) {
		console.log(params)
		var paramStrings = [];

		if (params.record_ids) { // Hämtar bara vissa sägner
			paramStrings.push('documents='+params.record_ids);
		}
		else {
			var queryParams = _.defaults(params, config.requiredParams);

			// Anpassa params till ES Djangi api
			if (queryParams.search) {
				if (queryParams.search_field == 'person') {
					queryParams.person = queryParams.search;
					delete queryParams.search;
				}
				if (queryParams.search_field == 'place') {
					queryParams.place = queryParams.search;
					delete queryParams.search;
				}
				delete queryParams.search_field;
			}

			for (var key in queryParams) {
				if (queryParams[key]) {
					paramStrings.push(key+'='+queryParams[key]);
				}
			}
		}

		var paramString = paramStrings.join('&');

		fetch(this.url+'?'+paramString)
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				if (this.onComplete) {
					this.onComplete(json);
				}
			}.bind(this))
			.catch(function(ex) {
				console.log('parsing failed', ex)
			});
	}
}