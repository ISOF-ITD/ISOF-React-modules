import React from 'react';
import RecordListItemAudioPlayer from './RecordListItemAudioPlayer';

import config from './../../../scripts/config.js';

export default class RecordListItem extends React.Component {
	render() {
		return <tr>
			<td className="text-larger">
				{
					this.props.item.type == 'inspelning' &&
					<RecordListItemAudioPlayer recordId={this.props.item.id} />
				}
				<a href={'#record/'+this.props.item.id}>{this.props.item.title ? this.props.item.title : '(Untitled'}</a>
			</td>
			<td data-title="Kategori:">{this.props.item.taxonomy.name}</td>
			<td data-title="Socken, Landskap:">
			{
				this.props.item.places &&
				<a href={'#place/'+this.props.item.places[0].id}>{this.props.item.places[0].name+', '+this.props.item.places[0].landskap}</a>
			}
			</td>
			<td data-title="Uppteckningsår:">{this.props.item.year > 0 ? this.props.item.year : ''}</td>
			<td data-title="Materialtyp:">{this.props.item.type}</td>
		</tr>;
	}
}