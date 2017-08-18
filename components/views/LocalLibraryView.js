import React from 'react';
import { hashHistory } from 'react-router';

import DropdownMenu from './../controls/DropdownMenu';

import localLibrary from './../../utils/localLibrary.js';

export default class LocalLibraryView extends React.Component {
	constructor(props) {
		super(props);

		this.libraryButtonClickHandler = this.libraryButtonClickHandler.bind(this);
		this.itemClickHandler = this.itemClickHandler.bind(this);
		this.itemRemoveButtonClickHander = this.itemRemoveButtonClickHander.bind(this);
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

//		var footerContent = <div className="drowdown-footer">Share!</div>;

		return (
			<div className="local-library-wrapper map-bottom-control">
				<DropdownMenu className={'map-floating-control map-floating-button visible library-open-button has-footer'+(savedRecords && savedRecords.length > 0 ? ' has-items' : '')} 
					dropdownDirection="up" 
					height="500px"
					
					headerText={this.props.headerText}>
					{items}
				</DropdownMenu>
			</div>
		);
	}
}