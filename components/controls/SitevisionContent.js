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
			this.fetchContent();
		}
	}

	componentWillReceiveProps(props) {
	}

	fetchContent() {
		var headers = new Headers();
		headers.append('Content-Type', 'text/html');

		fetch(this.props.url, {
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

	addLinkPrefix(element, linkPrefix) {
		var anchors = element.getElementsByTagName('a');
		_.each(anchors, function(anchor) {
			anchor.href = linkPrefix+anchor.pathname;
		});

		var images = element.getElementsByTagName('img');
		_.each(images, function(image) {

		});

		return element;
	}

	processHtml(htmlContent) {
		var replaceAll = function(str, find, replace) {
			var regex; 
			for (var i = 0; i < find.length; i++) {
				regex = new RegExp(find[i], "g");
				str = str.replace(regex, replace[i]);
			}
			return str;
		};

		var find = ['sv-column-10', 'sv-column-11', 'sv-column-12', 'sv-column-1', 'sv-column-2', 'sv-column-3', 'sv-column-4', 'sv-column-5', 'sv-column-6', 'sv-column-7', 'sv-column-8', 'sv-column-9']
		var repl = ['ten columns', 'eleven columns', 'twelve columns', 'one columns', 'two columns', 'three columns', 'four columns', 'five columns', 'six columns', 'seven columns', 'eight columns', 'nine columns']

		return replaceAll(htmlContent, find, repl);
	}

	parseHtml(html) {
		var parser = new DOMParser();
		var document = parser.parseFromString(html, 'text/html');
		
		var rubrik = document.getElementById('Rubrik');

		var mainElement = rubrik.parentElement.parentElement;

		if (this.props.linkPrefix) {
//			mainElement = this.addLinkPrefix(mainElement, this.props.linkPrefix);
		}

		var htmlContent = mainElement.innerHTML;

		this.setState({
			htmlContent: htmlContent
		});
	}

	render() {
		return <div className="sitevision-content">
			<div className="sv-fluid-grid main-grid" dangerouslySetInnerHTML={{__html: this.state.htmlContent}} />
		</div>;
	}
}