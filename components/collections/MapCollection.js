import 'whatwg-fetch';
import _ from 'underscore';

import 'whatwg-fetch';
import Promise from 'promise-polyfill'; 

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

		var paramString = '';

		params = this.cleanParams(params);

		for (var key in params) {
			paramString += key+'/'+params[key]+'/';
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