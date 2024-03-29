import 'whatwg-fetch';
import _ from 'underscore';

import config from '../../../scripts/config.js';

export default class MapCollection {
  constructor(onComplete) {
    this.url = `${config.apiUrl}socken/`;
    this.onComplete = onComplete;
  }

  cleanParams(params) {
    for (const prop in params) {
      if (params[prop] === null || params[prop] === undefined) {
        delete params[prop];
      }
    }

    return params;
  }

  fetch(params) {
    var paramStrings = [];

    if (params.record_ids) { // Hämtar bara platser för vissa sägner
      paramStrings.push(`documents=${params.record_ids}`);
    } else {
      var paramStrings = [];

      var params = _.defaults(this.cleanParams(params), config.requiredParams);
      // console.log(params);

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

      for (const key in params) {
        paramStrings.push(`${key}=${params[key]}`);
      }

      //			if (!window.applicationSettings.includeNordic) {
      //				paramStrings.push('country='+config.country);
      //			}
    }

    const paramString = paramStrings.join('&');

    fetch(`${this.url}?${paramString}`)
      .then((response) => response.json()).then((json) => {
        if (this.onComplete) {
          this.onComplete(json);
        }
      }).catch((ex) => {
        console.log('parsing failed', ex);
      });
  }
}
