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
            letter: 'trad1',
            label: 'Bebyggelse och bosättning',
        },
        {
            letter: 'trad2',
            label: 'Yrken, näringar och hushållning',
        },
        {
            letter: 'trad3',
            label: 'Kommunikation och handel',
        },
        {
            letter: 'trad4',
            label: 'Samhället',
        },
        {
            letter: 'trad5',
            label: 'Livets högtider',
        },
        {
            letter: 'trad6',
            label: 'Spöken och gastar',
        },
        {
            letter: 'trad7',
            label: 'Naturen',
        },
        {
            letter: 'trad8',
            label: 'Läkekonst',
        },
        {
            letter: 'trad9',
            label: 'Årets fester',
        },
        {
            letter: 'trad10',
            label: 'Klokskap och svartkonst',
        },
        {
            letter: 'trad11',
            label: 'Övernaturliga väsen',
        },
        {
            letter: 'trad12',
            label: 'Historisk tradition',
        },
        {
            letter: 'trad13',
            label: 'Sagor, gåtor och ordspråk',
        },
        {
            letter: 'trad14',
            label: 'Visor och musik',
        },
        {
            letter: 'trad15',
            label: 'Idrott, lek och spel',
        },
        {
            letter: 'trad16',
            label: 'Ej kategoriserat',
        }
	]
}
