import React from 'react';
import { hashHistory } from 'react-router';

import config from './../../../scripts/config.js';

import DropdownMenu from './../controls/DropdownMenu';
import ShareButton from './../controls/ShareButtons';

import localLibrary from './../../utils/localLibrary.js';

import clipboard from './../../utils/clipboard';

export default class LocalLibraryView extends React.Component {
	constructor(props) {
		super(props);

		this.libraryButtonClickHandler = this.libraryButtonClickHandler.bind(this);
		this.itemClickHandler = this.itemClickHandler.bind(this);
		this.itemRemoveButtonClickHander = this.itemRemoveButtonClickHander.bind(this);
		this.copyLinkClickHandler = this.copyLinkClickHandler.bind(this);
	}

	itemClickHandler(event) {
		hashHistory.push('/record/'+event.currentTarget.dataset.id);
	}

	libraryButtonClickHandler() {

	}

	itemRemoveButtonClickHander(event) {
		event.stopPropagation();

		localLibrary.remove(event.currentTarget.dataset.id);

		this.forceUpdate();
	}

	copyLinkClickHandler(event) {
		clipboard.copy(event.currentTarget.dataset.url);
	}

	render() {
		var savedRecords = localLibrary.list();

		var items = savedRecords && savedRecords.length > 0 ? savedRecords.map(function(item, index) {
			return <a key={index} data-id={item.id} onClick={this.itemClickHandler} className="item">
				{
					item.title
				}
				<div className="close-button" data-id={item.id} onClick={this.itemRemoveButtonClickHander}></div>
				{
					item.place && <span className="u-pull-right">{item.place}</span>
				}
			</a>
		}.bind(this)) : <h3 className="text-center">Inga sparade sägner</h3>;

		var legendIds = savedRecords.map(function(item) {
			return item.id;
		}).join(';');

		var shareLink = 'places/text_ids/'+legendIds;

		var footerContent = <div className="drowdown-footer">
			<ShareButton path={shareLink} />
			<a className="u-pull-right u-cursor-pointer" onClick={this.copyLinkClickHandler} data-url={config.siteUrl+'#/'+shareLink}>Kopiera länk</a>
		</div>;

		return (
			<div className="local-library-wrapper map-bottom-control">
				<DropdownMenu className={'map-floating-control map-floating-button visible library-open-button has-footer'+(savedRecords && savedRecords.length > 0 ? ' has-items' : '')} 
					dropdownDirection="up" 
					height="500px"
					footerContent={footerContent}
					headerText={this.props.headerText}>
					{items}
				</DropdownMenu>
			</div>
		);
	}
}