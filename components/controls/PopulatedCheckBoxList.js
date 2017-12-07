import React from 'react';
import CheckBoxList from './CheckBoxList';

export default class PopulatedCheckBoxList extends React.Component {
	constructor(props) {
		super(props);

		this.checkBoxListChangeHandler = this.checkBoxListChangeHandler.bind(this);

		this.state = {
			selectedItems: this.props.selectedItems || [],
			values: []
		};
	}

	componentWillReceiveProps(props) {
		if (props.selectedItems) {
			this.setState({
				selectedItems: props.selectedItems
			});
		}
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		fetch(this.props.dataUrl)
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				this.setState({
					data: json.data || json.results
				});
			}.bind(this))
			.catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	checkBoxListChangeHandler(event) {
		this.setState({
			selectedItems: event
		}, function() {
			if (this.props.onSelectionChange) {
				this.props.onSelectionChange(this.state.selectedItems);
			}
		}.bind(this));
	}

	render() {
		return (
			<CheckBoxList values={this.state.data}
				valueField={this.props.valueField} 
				labelField={this.props.labelField} 
				labelFunction={this.props.labelFunction} 
				selectedItems={this.state.selectedItems}  
				onSelectionChange={this.checkBoxListChangeHandler} />
		);
	}
}