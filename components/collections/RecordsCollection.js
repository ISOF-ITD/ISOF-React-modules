import 'whatwg-fetch';
import _ from 'underscore';

import config from './../../../scripts/config.js';

export default class RecordsCollection {
	constructor(onComplete) {
		this.url = config.apiUrl+'records/';
		this.url = baseUrl;
		this.onComplete = onComplete;
	}

	fetch(params) {
		var page = params.page ? params.page-1 : 0;

		var paramString = '';

		for (var key in params) {
			if (params[key] && key != 'page') {
				paramString += key+'/'+params[key]+'/';
			}
		}

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