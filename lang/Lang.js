import langData from './langData';

const defaultLang = 'sv';

export default {
	setCurrentLang: function(lang) {
		window.currentLang = lang;

		if (window.eventBus) {
			window.eventBus.dispatch('Lang.setCurrentLang');
		}
	},

	get: function(phrase) {
		if (window.traceLangGet) {
			console.log('Lang.get: '+phrase);
		}

		if (!window.currentLang) {
			window.currentLang = defaultLang;
		}
		return window.currentLang == defaultLang || !langData[window.currentLang][phrase] ? phrase : langData[window.currentLang][phrase];
	}
};