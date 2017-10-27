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

		// Anpassa params till ES Djangi api
		if (params.search) {
			if (params.search_field == 'person') {
				params.person = params.search;
				delete params.search;
			}
			if (params.search_field == 'place') {
				params.place = params.search;
				delete params.search;
			}
			delete params.search_field;
		}

		for (var key in params) {
			if (params[key]) {
				paramStrings.push(key+'='+params[key]);
			}
		}

		if (config.fetchOnlyCategories) {
			paramStrings.push('only_categories=true');
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