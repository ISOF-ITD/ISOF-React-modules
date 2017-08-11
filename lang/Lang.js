import langData from './langData';

const defaultLang = 'sv';

export default {
	setCurrentLang: function(lang) {
		window.currentLang = lang;
	},

	get: function(phrase) {
		if (!window.currentLang) {
			window.currentLang = defaultLang;
		}
		return window.currentLang == defaultLang || !langData[window.currentLang][phrase] ? phrase : langData[window.currentLang][phrase];
	}
};