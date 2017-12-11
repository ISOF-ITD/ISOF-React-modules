import langData from './langData';

const defaultLang = 'sv';

export default {
	collect: true,
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

		if (Lang.collect) {
			if (!Lang.notFound) {
				Lang.notFound = [];
			}

			if (!langData[window.currentLang][phrase]) {
				if (Lang.notFound.indexOf(phrase) == -1) {
					Lang.notFound.push(phrase);
					console.log('Did not find translation for "'+phrase+'"');
				}
			}
		}

		return window.currentLang == defaultLang || !langData[window.currentLang][phrase] ? phrase : langData[window.currentLang][phrase];
	}
};