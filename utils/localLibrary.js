import _ from 'underscore';

import config from './../../scripts/config.js';

export default {
	_getList() {
		return localStorage.getItem(config.localLibraryName) ? JSON.parse(localStorage.getItem(config.localLibraryName)) : [];
	},

	_saveList(list) {
		localStorage.setItem(config.localLibraryName, JSON.stringify(list));
	},

	add(item) {
		var storageList = this._getList();

		storageList.push(item);

		this._saveList(storageList);
	},

	remove(item) {
		var storageList = this._getList();

		storageList = _.reject(storageList, function(listItem) {
			return listItem.id == item.id;
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