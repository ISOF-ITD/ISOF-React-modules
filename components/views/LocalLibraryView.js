import React from 'react';

import DropdownMenu from './../controls/DropdownMenu';

import localLibrary from './../../utils/localLibrary.js';

export default class LocalLibraryView extends React.Component {
	constructor(props) {
		super(props);

		this.libraryButtonClickHandler = this.libraryButtonClickHandler.bind(this);
	}

	libraryButtonClickHandler() {

	}

	render() {
		var savedRecords = localLibrary.list();

		var items = savedRecords && savedRecords.length > 0 ? savedRecords.map(function(item, index) {
			return <a key={index} href={'#/record/'+item.id} className="item">
				{
					item.title
				}
				{
					item.place && <span className="u-pull-right">{item.place}</span>
				}
			</a>
		}) : <h3 className="text-center">Inga sparade sägner</h3>;

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