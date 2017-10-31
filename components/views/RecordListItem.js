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
				var textSummary = this.props.item._source.text.length > 300 ? this.props.item._source.text.substr(0, 300)+'...' : this.props.item._source.text;
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
					this.props.item._source.taxonomy && this.props.item._source.taxonomy.name &&
					<a href={'#/places/category/'+this.props.item._source.taxonomy.category}>{this.props.item._source.taxonomy.name}</a>
				}
			</td>
			<td data-title="Socken, Landskap:">
			{
				this.props.item._source.places && this.props.item._source.places.length > 0 &&
				<a target={config.embeddedApp ? '_parent' : '_self'} href={(config.embeddedApp ? config.siteUrl : '')+'#place/'+this.props.item._source.places[0].id}>{this.props.item._source.places[0].name+', '+this.props.item._source.places[0].landskap}</a>
			}
			</td>
			<td data-title="Uppteckningsår:">{this.props.item._source.year > 0 ? this.props.item._source.year : ''}</td>
			<td data-title="Materialtyp:">{this.props.item._source.materialtype}</td>
		</tr>;
	}
}