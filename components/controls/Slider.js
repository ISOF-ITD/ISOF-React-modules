import React from 'react';
import ReactDOM from 'react-dom';
import noUiSlider from 'nouislider';

export default class Slider extends React.Component {
	constructor(props) {
		super(props);

		this.sliderChangeHandler = this.sliderChangeHandler.bind(this);
	}

	componentDidMount() {
		this.slider = noUiSlider.create(this.refs.sliderContainer, {
			start: this.props.start || [0, 10],
			behaviour: 'drag',
			connect: true,
			tooltips: true,
			format: {
				to: function ( value ) {
					return Math.round(value);
				},
				from: function ( value ) {
					return Math.round(value);
				}
			},
			range: this.props.range || {
				min: 0,
				max: 10
			}
		});

		this.slider.on('change', this.sliderChangeHandler)
	}

	componentWillReceiveProps(props) {
		if (props.enabled && props.enabled == true) {
			this.refs.sliderContainer.removeAttribute('disabled');
		}
		else {
			this.refs.sliderContainer.setAttribute('disabled', true);
		}
	}

	sliderChangeHandler(event) {
		if (this.props.onChange) {
			this.props.onChange({
				target: {
					name: this.props.inputName || '',
					type: 'slider',
					value: event
				}
			});
		}
	}

	render() {
		return <div className="slider-container">
			<div ref="sliderContainer"></div>
		</div>;
	}
}