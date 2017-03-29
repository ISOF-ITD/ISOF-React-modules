import React from 'react';

import config from './../../../scripts/config.js';

export default class RecordView extends React.Component {
	componentDidMount() {
		if (FB) {
			FB.XFBML.parse();
		}
	}

	render() {
		return <div className="fb-share-button u-cf" style={{overflow: 'hidden', height: '20px'}} 
			data-href={config.siteUrl+'#/'+this.props.path} 
			data-layout="button_count"></div>;
	}
}