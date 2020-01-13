import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'underscore';

// Main CSS: sitevision.less

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
		else if (this.props.htmlContent) {
			this.setState({
				htmlContent: this.props.htmlContent
			});
		}
	}

	componentWillReceiveProps(props) {
		if (props.url) {
			this.fetchContent(props.url);
		}
	}

	fetchContent(url) {
		//console.log(url);
		url = url.replace('http://www.isof.se/','https://frigg.isof.se/sagendatabas/api/isofhomepage/')
		//console.log(url);
		var headers = new Headers();
		headers.append('Content-Type', 'text/html');

		fetch(url, {
			method: 'get',
			headers: headers
		}).then(function(response) {
			response.text().then(function(text) {
				console.log(text);
				this.parseHtml(text);
				console.log('after parseHtml');
			}.bind(this))
		}.bind(this)).catch(function(err) {
			console.log('fetch error');
			console.log(err);
		});
	}

	parseHtml(html) {
		console.log(html);
		var parser = new DOMParser();
		var document = parser.parseFromString(html, 'text/html');
		
		var rubrik = document.getElementById('Rubrik');

		var mainElement = document.getElementsByClassName('pagecontent')[0];

		if (mainElement) {
			var htmlContent = mainElement.innerHTML;
			//console.log(htmlContent);
			htmlContent = htmlContent.replace('src="/images/','src="https://frigg.isof.se/sagendatabas/api/isofhomepage/images/')
			htmlContent = htmlContent.replace('srcset="/images/','srcset="https://frigg.isof.se/sagendatabas/api/isofhomepage/images/')
			htmlContent = htmlContent.replace(', /images/',', https://frigg.isof.se/sagendatabas/api/isofhomepage/images/')
			htmlContent = htmlContent.replace(', /images/',', https://frigg.isof.se/sagendatabas/api/isofhomepage/images/')
			//console.log(htmlContent);
			var scripts = mainElement.getElementsByTagName('script');

			this.setState({
				htmlContent: htmlContent
			}, function() {
				if (!this.props.disableScriptExecution) {
					this.executeScripts(scripts);
				}
			}.bind(this));
		}
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