import _ from 'underscore';

export default {
	getCategoryName(categoryLetter, advancedCategories) {
		if (categoryLetter) {
			var lookupObject = advancedCategories ? this.categories_advanced : this.categories;
			var categoryObj = _.find(lookupObject, function(item) {
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

	categories_advanced: [
		{
			"key": "A",
			"name": "Döden och de döda"
		},
		{
			"key": "B",
			"name": "Den vilda jakten"
		},
		{
			"key": "C",
			"name": "Skogsväsen"
		},
		{
			"key": "D",
			"name": "Vattenväsen"
		},
		{
			"key": "E",
			"name": "Bergväsen"
		},
		{
			"key": "F",
			"name": "Tomtar"
		},
		{
			"key": "G",
			"name": "De underjordiska"
		},
		{
			"key": "H",
			"name": "Förvandlade"
		},
		{
			"key": "I",
			"name": "Spiritus"
		},
		{
			"key": "J",
			"name": "Djävulen"
		},
		{
			"key": "K",
			"name": "Kloka"
		},
		{
			"key": "L",
			"name": "Häxor och trollkarlar"
		},
		{
			"key": "M",
			"name": "Tjuvmjölkande väsen"
		},
		{
			"key": "N",
			"name": "Övernaturliga djur"
		},
		{
			"key": "FL-14",
			"name": "14. Mellan land och stad"
		},
		{
			"key": "FL-20",
			"name": "20. Naturen"
		},
		{
			"key": "FL-22",
			"name": "22. Trädgården"
		},
		{
			"key": "FL-27",
			"name": "27. Skolavslutningar"
		},
		{
			"key": "FL-29",
			"name": "29. Husdjur"
		},
		{
			"key": "FL-31",
			"name": "31. Årets fester  i skolan"
		}
	]
}
