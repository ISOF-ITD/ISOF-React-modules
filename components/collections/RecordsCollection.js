import 'whatwg-fetch';
import _ from 'underscore';

import config from './../../../scripts/config.js';

export default class RecordsCollection {
	constructor(onComplete) {
		this.url = config.apiUrl+'records/';
		this.onComplete = onComplete;
	}

	fetch(params) {
		var page = params.page ? (params.page-1)*50 : 0;

		var paramStrings = [];

		for (var key in params) {
			if (params[key] && key != 'page') {
				paramStrings.push(key+'/'+params[key]);
			}
		}

		if (config.fetchOnlyCategories) {
			paramStrings.push('only_categories/true');
		}

		var paramString = paramStrings.join('/');

		fetch(this.url+((page)+'/50/')+paramString)
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