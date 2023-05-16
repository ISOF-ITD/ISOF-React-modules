import React from 'react';

import config from './../../../scripts/config.js';
import clipboard from './../../utils/clipboard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

// Main CSS: ui-components/share-buttons.less

export default class RecordView extends React.Component {
	constructor(props) {
		super(props);

		this.linkClickHandler = this.linkClickHandler.bind(this);
        this.handleCopyLinkClick = this.handleCopyLinkClick.bind(this);
	}

	componentDidMount() {
		if (!this.props.manualInit) {
			setTimeout(function() {
				this.initialize();
			}.bind(this), 500);
		}
	}

	linkClickHandler(event) {
		event.preventDefault();

		if (clipboard.copy(this.props.path)) {
			if (window.eventBus) {
				window.eventBus.dispatch('popup-notification.notify', null, l('Länk har kopierats.'));
			}
		}		
	}

    handleCopyLinkClick(event) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(event.target);
        selection.removeAllRanges();
        selection.addRange(range);
    }

	initialize() {
		if (this.initialized) {
			return;
		}

		var fbInit = function() {
			try {
				if (FB) {
					FB.XFBML.parse();

					this.fbInitialized = true;

					if (this.fbInitialized && this.twitterInitialized) {
						this.initialized = true;
					}
				}
			}
			catch (e) {
				setTimeout(fbInit, 2000);
			}
		}.bind(this);

		fbInit();

		var twitterInit = function() {
			try {
				if (twttr) {
					twttr.widgets.load();

					this.twitterInitialized = true;

					if (this.fbInitialized && this.twitterInitialized) {
						this.initialized = true;
					}
				}
			}
			catch (e) {
				setTimeout(twitterInit, 2000);
			}
		}.bind(this);

		twitterInit();
	}

	render() {
		return <div className="share-buttons">
			{
				this.props.title && this.props.title != '' &&
				<div>
					<label>{this.props.title}</label>
					<div className="u-cf" />
				</div>
			}
			{/* <div className="fb-share-button" 
				data-href={this.props.path} 
				data-layout="button_count">	
			</div>
			<a className="twitter-share-button"
				href={'https://twitter.com/intent/tweet?text='+(this.props.text == undefined ? '' : this.props.text)+'&url='+this.props.path}>
					<span style={{display: 'none'}}>Tweet</span>
			</a> */}
            { !this.props.hideLink &&
                <div>
                    <a onClick={this.linkClickHandler} style={
						{
							cursor: 'pointer',
						}
					}>
                        <FontAwesomeIcon icon={faCopy} />
                    </a>
                    &nbsp;
                    <span className='copy-link' onClick={this.handleCopyLinkClick}>
                        {this.props.path}
                    </span>
                </div>
            }
		</div>;
	}
}