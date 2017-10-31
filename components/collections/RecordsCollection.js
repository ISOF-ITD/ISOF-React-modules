import 'whatwg-fetch';
import _ from 'underscore';

import config from './../../../scripts/config.js';

export default class RecordsCollection {
	constructor(onComplete) {
		this.url = config.apiUrl+'documents/';
		this.onComplete = onComplete;
	}

	fetch(params) {
		var paramStrings = [];

		var queryParams = Object.assign({}, config.requiredParams, params);

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

		if (!window.applicationSettings.includeNordic) {
			paramStrings.push('country='+config.country);
		}

		var paramString = paramStrings.join('&');

		fetch(this.url+'?'+paramString)
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				if (this.onComplete) {
					this.onComplete(json);
				}
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}
}