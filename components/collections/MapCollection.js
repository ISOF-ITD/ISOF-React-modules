import 'whatwg-fetch';
import _ from 'underscore';

import config from './../../../scripts/config.js';

export default class MapCollection {
	constructor(onComplete) {
		this.url = config.apiUrl+'locations/';
		this.onComplete = onComplete;
	}

	cleanParams(params) {
		for (var prop in params) {
			if (params[prop] === null || params[prop] === undefined) {
				delete params[prop];
			}
		}

		return params;
	}

	fetch(params) {
		var paramString;

		if (params.text_ids) { // Hämtar bara platser för vissa sägner
			paramString = 'text_ids/'+params.text_ids;
		}
		else {
			var paramStrings = [];

			params = this.cleanParams(params);

			for (var key in params) {
				paramStrings.push(key+'/'+params[key]);
			}

			if (config.fetchOnlyCategories) {
				paramStrings.push('only_categories/true');
			}

			paramString = paramStrings.join('/');
		}

		fetch(this.url+paramString)
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