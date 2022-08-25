import React from 'react';

// Main CSS: ui-components/checkbox-list.less

export default class CheckBoxList extends React.Component {
	constructor(props) {
		super(props);

		this.checkBoxChangeHandler = this.checkBoxChangeHandler.bind(this);

		this.state = {
			selectedItems: this.props.selectedItems || []
		};
	}

	UNSAFE_componentWillReceiveProps(props) {
		if (props.selectedItems) {
			this.setState({
				selectedItems: props.selectedItems
			});
		}
	}

	checkBoxChangeHandler(event) {
		event.stopPropagation();

		var value = event.target.value;
		var selectedItems = this.state.selectedItems;

		if (this.state.selectedItems.indexOf(value) == -1) {
			selectedItems.push(value);
		}
		else {
			selectedItems.splice(this.state.selectedItems.indexOf(value), 1);
		}

		this.setState({
			selectedItems: selectedItems
		}, function() {
			if (this.props.onSelectionChange) {
				this.props.onSelectionChange(this.state.selectedItems);
			}
		}.bind(this));
	}

	render() {
		var items = this.props.values ? this.props.values.map(function(value, index) {
			if (typeof(value) == 'object') {
				return <label key={index} className="item"><input type="checkbox" value={value[this.props.valueField || 'value']} checked={this.state.selectedItems.indexOf(value[this.props.valueField || 'value']) > -1} onChange={this.checkBoxChangeHandler} /> {this.props.labelFunction ? this.props.labelFunction(value) : value[this.props.labelField || 'label']}</label>
			}
			else {
				return <label key={index} className="item"><input type="checkbox" value={value} checked={this.state.selectedItems.indexOf(value) > -1} onChange={this.checkBoxChangeHandler} /> {l(value)}</label>
			}
		}.bind(this)) : [];
		return (
			// <div className="checkbox-list">
			<div>
				{items}
			</div>
		);
	}
}