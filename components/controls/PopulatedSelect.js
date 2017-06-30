import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

export default class AutocompleteInput extends React.Component {
	constructor(props) {
		super(props);

		this.inputChangeHandler = this.inputChangeHandler.bind(this);

		this.state = {
			inputValue: props.value || '',
			data: []
		};
	}

	componentWillReceiveProps(props) {
		if (props.value && props.value != this.state.inputValue) {
			this.setState({
				inputValue: props.value
			});
		}
	}

	componentDidMount() {
		this.fetchData();
	}

	inputChangeHandler(event) {
		this.setState({
			inputValue: event.target.value
		});

		if (this.props.onChange) {
			this.props.onChange({
				target: {
					name: this.props.inputName || '',
					value: event.target.value
				}
			});
		}
	}

	fetchData() {
		fetch(this.props.dataUrl)
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				this.setState({
					data: json.data
				});
			}.bind(this))
			.catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	render() {
		var dataItems = this.state.data;

		if (this.props.sortOptions) {
			if (this.props.valueField) {
				dataItems = _.sortBy(dataItems, function(item) {
					return item[this.props.valueField];
				}.bind(this));
			}
			else {
				dataItems = dataItems.sort();
			}
		}

		var items = dataItems.map(function(item, index) {
			return <option key={index+1} value={this.props.valueField ? item[this.props.valueField] : item}>
				{this.props.listLabelFormatFunc ? this.props.listLabelFormatFunc(item) : this.props.valueField ? item[this.props.valueField] : item}
			</option>
		}.bind(this));

		items.unshift(<option key="0" value=""></option>);

		return <div ref="container" className="select-input">
			<select className={this.props.inputClassName} 
				type="text" 
				name={this.props.inputName || ''}
				value={this.state.inputValue} 
				onChange={this.inputChangeHandler}>
					{items}
			</select>
		</div>
	}
}