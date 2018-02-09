import _ from 'underscore';

import config from './../../scripts/config.js';

export default {
	_getList() {
		try {
			return localStorage.getItem(config.localLibraryName) ? JSON.parse(localStorage.getItem(config.localLibraryName)) : [];
		}
		catch (e) {
			return [];
		}
	},

	_saveList(list) {
		try {
			localStorage.setItem(config.localLibraryName, JSON.stringify(list));
		}
		catch (e) {
			
		}
	},

	add(item) {
		var storageList = this._getList();

		storageList.push(item);

		this._saveList(storageList);
	},

	remove(item) {
		var storageList = this._getList();

		storageList = _.reject(storageList, function(listItem) {
			if (typeof item == 'object') {
				return listItem.id == item.id;
			}
			else {
				return listItem.id == item;
			}
		});

		this._saveList(storageList);
	},

	find(item) {
		var storageList = this._getList();

		return _.findWhere(storageList, {
			id: item.id
		});
	},

	list() {
		return this._getList();
	}
};
