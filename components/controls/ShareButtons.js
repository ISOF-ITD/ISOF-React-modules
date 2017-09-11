import React from 'react';

import config from './../../../scripts/config.js';

export default class RecordView extends React.Component {
	componentDidMount() {
		var fbInit = function() {
			try {
				if (FB) {
					FB.XFBML.parse();
				}
			}
			catch (e) {
				setTimeout(fbInit, 2000);
			}
		}

		fbInit();

		var twitterInit = function() {
			try {
				if (twttr) {
					twttr.widgets.load();
				}
			}
			catch (e) {
				setTimeout(twitterInit, 2000);
			}
		}

		twitterInit();
	}

	render() {
		return <div className="share-buttons">
			<div className="fb-share-button u-cf" style={{overflow: 'hidden', height: '20px'}} 
				data-href={this.props.path} 
				data-layout="button_count"></div>
			<a className="twitter-share-button"
				href={'https://twitter.com/intent/tweet?text='+(this.props.text || '')+'&url='+this.props.path}><span style={{display: 'none'}}>Tweet</span></a>
		</div>;
	}
}