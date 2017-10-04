import _ from 'underscore';

export default {
	getCategoryName(categoryLetter) {
		if (categoryLetter) {
			var categoryObj = _.find(this.categories, function(item) {
				return item.letter.toLowerCase() == categoryLetter.toLowerCase();
			}.bind(this));

			return categoryObj ? categoryObj.label : categoryLetter.indexOf(';') > -1 ? 'Flera kategorier' : '(Ingen kategori)';
		}
		else {
			return null;
		}
	},

	categories: [
		{
			letter: 'a',
			label: 'Döden och de döda',
			label_no: 'Døden og de døde'
		},
		{
			letter: 'b',
			label: 'Den vilda jakten',
			label_no: 'Den ville jakten'
		},
		{
			letter: 'c',
			label: 'Skogsväsen',
			label_no: 'Skogsvetter'
		},
		{
			letter: 'd',
			label: 'Vattenväsen',
			label_no: 'Vetter i vann'
		},
		{
			letter: 'e',
			label: 'Bergväsen',
			label_no: 'Troll & Kjemper'
		},
		{
			letter: 'f',
			label: 'Tomtar',
			label_no: 'Nisser'
		},
		{
			letter: 'g',
			label: 'De underjordiska',
			label_no: 'De underjordiske'
		},
		{
			letter: 'h',
			label: 'Förvandlade',
			label_no: 'Forvandlede (forgjorte, omskapte)'
		},
		{
			letter: 'i',
			label: 'Spiritus',
			label_no: 'Ånder (hjelpeånder)'
		},
		{
			letter: 'j',
			label: 'Djävulen',
			label_no: 'Djevelen'
		},
		{
			letter: 'k',
			label: 'Kloka',
			label_no: 'Kloke'
		},
		{
			letter: 'l',
			label: 'Häxor och trollkarlar',
			label_no: 'Hekser og trollmenn'
		},
		{
			letter: 'm',
			label: 'Tjuvmjölkande väsen',
			label_no: ''
		},
		{
			letter: 'n',
			label: 'Övernaturliga djur',
			label_no: ''
		}
	],

	categories_v1: [
		{
			letter: 'a',
			label: 'Döden och de döda'
		},
		{
			letter: 'b',
			label: 'Odens jakt'
		},
		{
			letter: 'c',
			label: 'Skogsväsen'
		},
		{
			letter: 'd',
			label: 'Vattenväsen'
		},
		{
			letter: 'e',
			label: 'Bergväsen'
		},
		{
			letter: 'f',
			label: 'Tomtar'
		},
		{
			letter: 'g',
			label: 'Jättar'
		},
		{
			letter: 'h',
			label: 'Troll'
		},
		{
			letter: 'i',
			label: 'Älvor, vittror och vättar'
		},
		{
			letter: 'j',
			label: 'Djävulen'
		},
		{
			letter: 'k',
			label: 'Kloka'
		},
		{
			letter: 'l',
			label: 'Häxor och  trollkarlar'
		},
		{
			letter: 'm',
			label: 'Tjuvmjölkande väsen'
		},
		{
			letter: 'n',
			label: 'Spiritus, dragdocka och bodrag'
		},
		{
			letter: 'o',
			label: 'Förvandlade'
		},
		{
			letter: 'p',
			label: 'Djur och natur'
		},
		{
			letter: 'q',
			label: 'Farsoter'
		},
		{
			letter: 'r',
			label: 'Kyrkor och kyrkklockor'
		},
		{
			letter: 's',
			label: 'Skatter'
		},
		{
			letter: 't',
			label: 'Krig och fejder'
		},
		{
			letter: 'u',
			label: 'Brott och straff'
		},
		{
			letter: 'v',
			label: 'Kungar och herremän'
		},
		{
			letter: 'w',
			label: 'De ovanliga'
		}
	]
}
