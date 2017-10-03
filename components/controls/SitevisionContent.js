import React from 'react';
import ReactDOM from 'react-dom';

export default class SitevisionContent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			htmlContent: ''
		};
	}

	componentWillReceiveProps(props) {
	}

	render() {
		return <div />;
	}
}