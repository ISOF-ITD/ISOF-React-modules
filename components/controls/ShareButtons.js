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
	}

	render() {
		return <div className="fb-share-button u-cf" style={{overflow: 'hidden', height: '20px'}} 
			data-href={this.props.path} 
			data-layout="button_count"></div>;
	}
}