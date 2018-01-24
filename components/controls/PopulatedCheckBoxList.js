import React from 'react';
import CheckBoxList from './CheckBoxList';
import _ from 'underscore';

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
				var state = {
					data: json.data || json.results
				};

				if (this.props.filteredBy) {
					state.filterOptions = _.uniq(_.pluck(json.data || json.results, this.props.filteredBy));
					state.currentFilter = state.filterOptions[0];
				}

				this.setState(state);
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
		if (this.props.filteredBy && this.state.filterOptions) {
			var values = _.filter(this.state.data, function(item) {
				return item[this.props.filteredBy] == this.state.currentFilter;
			}.bind(this));

			var selectElementStyle = {
				float: 'right',
				marginTop: '-40px',
				marginBottom: 0
			};

			return <div>
				<select style={selectElementStyle} onChange={function(event) {this.setState({currentFilter: event.target.value})}.bind(this)} value={this.state.currentFilter}>
					{
						_.map(this.state.filterOptions, function(item) {
							return <option key={item}>{item}</option>
						})
					}
				</select>
				<CheckBoxList values={values}
					valueField={this.props.valueField} 
					labelField={this.props.labelField} 
					labelFunction={this.props.labelFunction} 
					selectedItems={this.state.selectedItems}  
					onSelectionChange={this.checkBoxListChangeHandler} />
			</div>;
		}
		else {
			return <CheckBoxList values={this.state.data}
				valueField={this.props.valueField} 
				labelField={this.props.labelField} 
				labelFunction={this.props.labelFunction} 
				selectedItems={this.state.selectedItems}  
				onSelectionChange={this.checkBoxListChangeHandler} />
		}
	}
}