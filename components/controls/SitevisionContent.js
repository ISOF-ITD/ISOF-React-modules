import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';

export default class SitevisionContent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			htmlContent: ''
		};
	}

	componentDidMount() {
		if (this.props.url) {
			this.fetchContent(this.props.url);
		}
	}

	componentWillReceiveProps(props) {
		if (props.url) {
			this.fetchContent(props.url);
		}
	}

	fetchContent(url) {
		var headers = new Headers();
		headers.append('Content-Type', 'text/html');

		fetch(url, {
			method: 'get',
			headers: headers
		}).then(function(response) {
			response.text().then(function(text) {
				this.parseHtml(text);
			}.bind(this))
		}.bind(this)).catch(function(err) {
			console.log(err);
		});
	}

	parseHtml(html) {
		var parser = new DOMParser();
		var document = parser.parseFromString(html, 'text/html');
		
		var rubrik = document.getElementById('Rubrik');

		var mainElement = rubrik.parentElement.parentElement;

		var htmlContent = mainElement.innerHTML;

		var scripts = mainElement.getElementsByTagName('script');

		this.setState({
			htmlContent: htmlContent
		}, function() {
			if (!this.props.disableScriptExecution) {
				this.executeScripts(scripts);
			}
		}.bind(this));
	}

	executeScripts(scriptTags) {
		_.each(scriptTags, function(script) {
			Function(script.innerHTML)();
		});
	}

	render() {
		return <div className="sitevision-content">
			<div className="sv-fluid-grid main-grid" dangerouslySetInnerHTML={{__html: this.state.htmlContent}} />
		</div>;
	}
}