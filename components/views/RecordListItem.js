import React from 'react';
import ListPlayButton from './ListPlayButton';
import { hashHistory } from 'react-router';

import config from './../../../scripts/config.js';

export default class RecordListItem extends React.Component {
	render() {
		return <tr>
			<td className="text-larger">
				<a target={config.embeddedApp ? '_parent' : '_self'} href={(config.embeddedApp ? config.siteUrl : '')+'#record/'+this.props.item.id+(this.props.routeParams ? this.props.routeParams : '')}>
					{
						this.props.item.type == 'inspelning' &&
						<ListPlayButton />
					}
					{this.props.item.title ? this.props.item.title : '(Utan titel'}
				</a>
			</td>
			<td data-title="Kategori:">{this.props.item.category ? this.props.item.category.name : ''}</td>
			<td data-title="Socken, Landskap:">
			{
				this.props.item.places && this.props.item.places.length > 0 &&
				<a target={config.embeddedApp ? '_parent' : '_self'} href={(config.embeddedApp ? config.siteUrl : '')+'#place/'+this.props.item.places[0].id}>{this.props.item.places[0].name+', '+this.props.item.places[0].harad.landskap}</a>
			}
			</td>
			<td data-title="Uppteckningsår:">{this.props.item.year > 0 ? this.props.item.year : ''}</td>
			<td data-title="Materialtyp:">{this.props.item.type}</td>
		</tr>;
	}
}