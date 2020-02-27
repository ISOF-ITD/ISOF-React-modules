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

	// Categories with type tradark
	categories: [
		{
            letter: 'Trad1',
            label: 'Bebyggelse och bosättning',
        },
        {
            letter: 'Trad2',
            label: 'Yrken, näringar och hushållning',
        },
        {
            letter: 'Trad3',
            label: 'Kommunikation och handel',
        },
        {
            letter: 'Trad4',
            label: 'Samhället',
        },
        {
            letter: 'Trad5',
            label: 'Livets högtider',
        },
        {
            letter: 'Trad6',
            label: 'Spöken och gastar',
        },
        {
            letter: 'Trad7',
            label: 'Naturen',
        },
        {
            letter: 'Trad8',
            label: 'Läkekonst',
        },
        {
            letter: 'Trad9',
            label: 'Årets fester',
        },
        {
            letter: 'Trad10',
            label: 'Klokskap och svartkonst',
        },
        {
            letter: 'Trad11',
            label: 'Övernaturliga väsen',
        },
        {
            letter: 'Trad12',
            label: 'Historisk tradition',
        },
        {
            letter: 'Trad13',
            label: 'Sagor, gåtor och ordspråk',
        },
        {
            letter: 'Trad14',
            label: 'Visor och musik',
        },
        {
            letter: 'Trad15',
            label: 'Idrott, lek och spel',
        },
        {
            letter: 'Trad16',
            label: 'Ej kategoriserat',
        }
	]
}
