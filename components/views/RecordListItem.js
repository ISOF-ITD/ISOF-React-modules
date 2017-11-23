import React from 'react';
import ListPlayButton from './ListPlayButton';
import { hashHistory } from 'react-router';
import _ from 'underscore';

import config from './../../../scripts/config.js';

export default class RecordListItem extends React.Component {
	render() {
		var displayTextSummary = false;
		if (this.props.highlightRecordsWithMetadataField) {
			if (_.findWhere(this.props.item._source.metadata, {type: this.props.highlightRecordsWithMetadataField})) {
				displayTextSummary = true;
				var textSummary = this.props.item._source.text ? (this.props.item._source.text.length > 300 ? this.props.item._source.text.substr(0, 300)+'...' : this.props.item._source.text) : '';
			}
		}

		var taxonomyElement;
		if (this.props.item._source.taxonomy) {
			if (config.siteOptions.recordList && config.siteOptions.recordList.visibleCategories) {
				var visibleCategories = config.siteOptions.recordList.visibleCategories;
			}
			if (this.props.item._source.taxonomy.name) {
				if (visibleCategories) {
					if (visibleCategories.indexOf(this.props.item._source.taxonomy.type.toLowerCase()) > -1) {
						taxonomyElement = <a href={'#/places/category/'+this.props.item._source.taxonomy.category.toLowerCase()}>{this.props.item._source.taxonomy.name}</a>;
					}
				}
				else {
					taxonomyElement = <a href={'#/places/category/'+this.props.item._source.taxonomy.category.toLowerCase()}>{this.props.item._source.taxonomy.name}</a>;
				}
			}
			else if (this.props.item._source.taxonomy.length > 0) {
				taxonomyElement = <span dangerouslySetInnerHTML={{__html: _.compact(_.map(this.props.item._source.taxonomy, function(taxonomyItem) {
							if (taxonomyItem.category) {
								if (visibleCategories) {
									if (visibleCategories.indexOf(taxonomyItem.type.toLowerCase()) > -1) {
										return '<a href="#/places/category/'+taxonomyItem.category.toLowerCase()+'">'+taxonomyItem.name+'</a>'
									}
								}
								else {
									return '<a href="#/places/category/'+taxonomyItem.category.toLowerCase()+'">'+taxonomyItem.name+'</a>'
								}
							}
						})).join(', ')}} >
					</span>;
			}
		}

		return <tr className={'list-item'+(displayTextSummary ? ' highlighted' : '')}>
			<td className="text-larger">
				<a className="item-title" target={config.embeddedApp ? '_parent' : '_self'} href={(config.embeddedApp ? config.siteUrl : '')+'#record/'+this.props.item._source.id+(this.props.routeParams ? this.props.routeParams : '')}>
					{
						this.props.item._source.materieltype == 'inspelning' &&
						<ListPlayButton />
					}
					{this.props.item._source.title ? this.props.item._source.title : '(Utan titel'}
				</a>
				{
					displayTextSummary &&
					<div className="item-summary">{textSummary}</div>
				}
			</td>
			<td data-title="Kategori:">
				{
					taxonomyElement
				}
			</td>
			<td data-title={l('Socken, Landskap')+':'}>
			{
				this.props.item._source.places && this.props.item._source.places.length > 0 &&
				<a target={config.embeddedApp ? '_parent' : '_self'} href={(config.embeddedApp ? config.siteUrl : '')+'#place/'+this.props.item._source.places[0].id}>{this.props.item._source.places[0].name+(this.props.item._source.places[0].landskap || this.props.item._source.places[0].fylke ? (this.props.item._source.places[0].landskap ? ', '+this.props.item._source.places[0].landskap : this.props.item._source.places[0].fylke ? this.props.item._source.places[0].fylke : '') : '')}</a>
			}
			</td>
			<td data-title="Uppteckningsår:">{this.props.item._source.year > 0 ? this.props.item._source.year : ''}</td>
			{
				!config.siteOptions.recordList || config.siteOptions.recordList.hideMaterialType == true &&
				<td data-title="Materialtyp:">{this.props.item._source.materialtype}</td>
			}
		</tr>;
	}
}