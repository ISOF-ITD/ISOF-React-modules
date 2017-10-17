import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';

export default class SitevisionContent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			height: 500
		};
	}

	componentDidMount() {
		if (this.props.url) {
			this.setState({
				url: this.props.url,
				height: this.props.height || 500
			});
		}
	}

	componentWillReceiveProps(props) {
		if (props.url) {
			this.setState({
				url: props.url,
				height: props.height || 500
			});
		}
	}

	render() {
		return <div className="pdf-viewer">
			{
				this.state.url &&
				<object data={this.props.url} width="100%" height={this.state.height} type="application/pdf">
					<a href={this.props.url}>Öppna pdf</a>
				</object>
			}
		</div>;
	}
}