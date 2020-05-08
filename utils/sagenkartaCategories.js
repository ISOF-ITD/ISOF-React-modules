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
			label_no: 'Tyvmelkende vesen'
		},
		{
			letter: 'n',
			label: 'Övernaturliga djur',
			label_no: 'Overnaturlige dyr'
		}
	],

	categories_advanced: [
		{
			letter: 'A',
			label: 'Döden och de döda'
		},
		{
			letter: 'B',
			label: 'Den vilda jakten'
		},
		{
			letter: 'C',
			label: 'Skogsväsen'
		},
		{
			letter: 'D',
			label: 'Vattenväsen'
		},
		{
			letter: 'E',
			label: 'Bergväsen'
		},
		{
			letter: 'F',
			label: 'Tomtar'
		},
		{
			letter: 'G',
			label: 'De underjordiska'
		},
		{
			letter: 'H',
			label: 'Förvandlade'
		},
		{
			letter: 'I',
			label: 'Spiritus'
		},
		{
			letter: 'J',
			label: 'Djävulen'
		},
		{
			letter: 'K',
			label: 'Kloka'
		},
		{
			letter: 'L',
			label: 'Häxor och trollkarlar'
		},
		{
			letter: 'M',
			label: 'Tjuvmjölkande väsen'
		},
		{
			letter: 'N',
			label: 'Övernaturliga djur'
		},
		{
			letter: 'FL-7',
			label: '7. Vardagsliv under andra världskriget'
		},
		{
			letter: 'FL-14',
			label: '14. Mellan land och stad'
		},
		{
			letter: 'FL-20',
			label: '20. Naturen'
		},
		{
			letter: 'FL-22',
			label: '22. Trädgården'
		},
		{
			letter: 'FL-27',
			label: '27. Skolavslutningar'
		},
		{
			letter: 'FL-29',
			label: '29. Husdjur'
		},
		{
			letter: 'FL-31',
			label: '31. Årets fester  i skolan'
		},
		{
			letter: 'FL-W1',
			label:  'W1. Bilar och bilism'
		}
	]
}
