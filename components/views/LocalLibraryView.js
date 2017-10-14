import React from 'react';
import { hashHistory } from 'react-router';

import config from './../../../scripts/config.js';

import DropdownMenu from './../controls/DropdownMenu';
import ShareButton from './../controls/ShareButtons';
import ElementNotificationMessage from './../controls/ElementNotificationMessage';

import localLibrary from './../../utils/localLibrary.js';

import clipboard from './../../utils/clipboard';

export default class LocalLibraryView extends React.Component {
	constructor(props) {
		super(props);

		this.libraryButtonClickHandler = this.libraryButtonClickHandler.bind(this);
		this.itemClickHandler = this.itemClickHandler.bind(this);
		this.itemRemoveButtonClickHander = this.itemRemoveButtonClickHander.bind(this);
		this.copyLinkClickHandler = this.copyLinkClickHandler.bind(this);
		this.dropdownOpenHandler = this.dropdownOpenHandler.bind(this);

		this.savedRecords = [];

		this.state = {
			dropdownOpen: false
		};
	}

	itemClickHandler(event) {
		hashHistory.push('/record/'+event.currentTarget.dataset.id);
	}

	libraryButtonClickHandler() {

	}

	dropdownOpenHandler() {
		this.setState({
			dropdownOpen: true
		}, function() {
			this.refs.shareButtons.initialize();
		}.bind(this));
	}

	itemRemoveButtonClickHander(event) {
		event.stopPropagation();

		localLibrary.remove(event.currentTarget.dataset.id);

		this.forceUpdate();
	}

	copyLinkClickHandler(event) {
		if (clipboard.copy(event.currentTarget.dataset.url)) {
			if (window.eventBus) {
				window.eventBus.dispatch('popup-notification.notify', null, 'Länk till dina sägner har kopierats.');
			}
		}

	}

	render() {
		if (this.savedRecords.length == 0 && localLibrary.list().length > 0 && this.refs.elementNotification) {
			this.refs.elementNotification.show();
		}

		this.savedRecords = localLibrary.list();

		var items = this.savedRecords && this.savedRecords.length > 0 ? this.savedRecords.map(function(item, index) {
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

		var legendIds = this.savedRecords.map(function(item) {
			return item.id;
		}).join(';');

		var shareLink = 'places/record_ids/'+legendIds;

		var footerContent = <div className="drowdown-footer">
			{
				this.state.dropdownOpen &&
				<ShareButton ref="shareButtons" manualInit={true} path={config.siteUrl+'#/'+shareLink} text="Några intressanta sägner på sägenkartan: " />
			}
			<a className="u-pull-right u-cursor-pointer" onClick={this.copyLinkClickHandler} data-url={config.siteUrl+'#/'+shareLink}>Kopiera länk</a>
		</div>;

		return (
			<div className="local-library-wrapper map-bottom-control">

				<ElementNotificationMessage 
					ref="elementNotification" 
					placement="above" 
					placementOffsetX="27" 
					placementOffsetY="-62" 
					messageId="myLegendsNotification" 
					forgetAfterClick={true} 
					manuallyOpen={true} 
					closeTrigger="click" 
					message="Klicka här för att visa lista över dina sparade sägner."
				>
					<DropdownMenu className={'map-floating-control map-floating-button visible library-open-button has-footer'+(this.savedRecords && this.savedRecords.length > 0 ? ' has-items' : '')} 
						dropdownDirection="up" 
						height="500px"
						footerContent={footerContent}
						headerText={this.props.headerText} 
						onOpen={this.dropdownOpenHandler}>
						{items}
					</DropdownMenu>
				</ElementNotificationMessage>
			</div>
		);
	}
}