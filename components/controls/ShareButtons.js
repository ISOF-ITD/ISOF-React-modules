import React from 'react';

import config from './../../../scripts/config.js';

export default class RecordView extends React.Component {
	componentDidMount() {
		if (!this.props.manualInit) {
			this.initialize();
		}
		else {
			console.log('manualInit');
		}
	}

	initialize() {
		console.log('Initialize');

		if (this.initialized) {
			return;
		}

		var fbInit = function() {
			try {
				console.log('Trying to initialise FB.');
				if (FB) {
					console.log('FB found, initializing.');
					FB.XFBML.parse();

					this.fbInitialized = true;

					if (this.fbInitialized && this.twitterInitialized) {
						this.initialized = true;
					}
				}
			}
			catch (e) {
				console.log('FB initialization failed, retry in 2000 ms.')
				setTimeout(fbInit, 2000);
			}
		}.bind(this);

		fbInit();

		var twitterInit = function() {
			try {
				console.log('Trying to initialise twttr.');
				if (twttr) {
					console.log('twttr found, initializing.');
					twttr.widgets.load();

					this.twitterInitialized = true;

					if (this.fbInitialized && this.twitterInitialized) {
						this.initialized = true;
					}
				}
			}
			catch (e) {
				console.log('twttr initialization failed, retry in 2000 ms.')
				setTimeout(twitterInit, 2000);
			}
		}.bind(this);

		twitterInit();
	}

	render() {
		return <div className="share-buttons">
			<div className="fb-share-button u-cf" 
				data-href={this.props.path} 
				data-layout="button_count"></div>
			<a className="twitter-share-button"
				href={'https://twitter.com/intent/tweet?text='+(this.props.text || '')+'&url='+this.props.path}><span style={{display: 'none'}}>Tweet</span></a>
		</div>;
	}
}