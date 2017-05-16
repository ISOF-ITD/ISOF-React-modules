import React from 'react';
import ReactDOM from 'react-dom';

export default class AutocompleteInput extends React.Component {
	constructor(props) {
		super(props);

		this.inputValueChangeHandler = this.inputValueChangeHandler.bind(this);
		this.inputBlurHandler = this.inputBlurHandler.bind(this);
		this.inputKeyDownHandler = this.inputKeyDownHandler.bind(this);

		this.state = {
			inputValue: props.value || '',
			data: [],
			listIndex: -1
		};
	}

	componentWillReceiveProps(props) {
		if (props.value && props.value != this.state.inputValue) {
			this.setState({
				inputValue: props.value
			});
		}
	}

	inputValueChangeHandler(event) {
		if (event.target.value == '') {
			this.setState({
				inputValue: '',
				data: [],
				listIndex: -1
			});

			if (this.props.onChange) {
				this.props.onChange({
					target: {
						value: ''
					}
				});
			}
		}
		else {
			this.setState({
				inputValue: event.target.value
			}, function() {
				this.fetchData(this.state.inputValue);

				if (this.props.onChange) {
					this.props.onChange({
						target: {
							value: this.state.inputValue
						}
					});
				}
			}.bind(this));
		}
	}

	inputKeyDownHandler(event) {
		if (event.keyCode == 38) { // up
			if (this.state.listIndex > 0) {
				this.setState({
					listIndex: this.state.listIndex-1,
					inputValue: this.props.valueField ? this.state.data[this.state.listIndex-1][this.props.valueField] : this.state.data[this.state.listIndex-1]
				}, function() {
					if (this.props.onChange) {
						this.props.onChange({
							target: {
								value: this.state.inputValue
							}
						});
					}
				}.bind(this));
			}
		}
		if (event.keyCode == 40) { // ner
			if (this.state.listIndex < this.state.data.length) {
				this.setState({
					listIndex: this.state.listIndex+1,
					inputValue: this.props.valueField ? this.state.data[this.state.listIndex+1][this.props.valueField] : this.state.data[this.state.listIndex+1]
				}, function() {
					if (this.props.onChange) {
						this.props.onChange({
							target: {
								value: this.state.inputValue
							}
						});
					}
				}.bind(this));
			}
		}
		if (event.keyCode == 13) { // enter
			this.setState({
				listIndex: -1,
				data: []
			}, function() {
				if (this.props.onEnter) {
					this.props.onEnter();
				}
			}.bind(this));
		}

	}

	inputBlurHandler() {
		setTimeout(function() {
			this.setState({
				data: [],
				listIndex: -1
			});
		}.bind(this), 200);
	}

	itemClickHandler(item) {
		this.setState({
			inputValue: item
		}, function() {
			if (this.props.onChange) {
				this.props.onChange({
					target: {
						value: this.state.inputValue
					}
				});
			}
		}.bind(this));
	}

	fetchData(str) {
		if (!this.waitingForFetch) {
			this.waitingForFetch = true;

			fetch(this.props.searchUrl+str)
				.then(function(response) {
					return response.json()
				})
				.then(function(json) {
					this.setState({
						data: json.data,
						listIndex: -1
					});
					this.waitingForFetch = false;
				}.bind(this))
				.catch(function(ex) {
					console.log('parsing failed', ex)
				})
			;
		}
	}

	render() {
		var items = this.state.data.map(function(item, index) {
			return <div className={'item'+(this.state.listIndex == index ? ' selected' : '')} 
				key={index} 
				onClick={this.itemClickHandler.bind(this, this.props.valueField ? item[this.props.valueField] : item)}>
				{
					this.props.listLabelFormatFunc ? this.props.listLabelFormatFunc(item) : this.props.valueField ? item[this.props.valueField] : item
				}
			</div>
		}.bind(this));
		return <div ref="container" className="autocomplete-input">
			<input className={this.props.inputClassName} 
				type="text" 
				value={this.state.inputValue} 
				onChange={this.inputValueChangeHandler}
				onBlur={this.inputBlurHandler}
				onKeyDown={this.inputKeyDownHandler} />
			{
				items.length > 0 &&
				<div className="autocomplete-list">
					{items}
				</div>
			}
		</div>
	}
}