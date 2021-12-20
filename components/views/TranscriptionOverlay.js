import React from 'react';
import config from './../../../scripts/config.js';
import ImageMap from './ImageMap';

import ContributeInfoButton from './ContributeInfoButton';
import FeedbackButton from './FeedbackButton';
import TranscriptionHelpButton from './TranscriptionHelpButton';
// Main CSS: ui-components/overlay.less
// ImageMap CSS: ui-components/image-map.less

export default class TranscriptionOverlay extends React.Component {
	constructor(props) {
		super(props);

		this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);

		this.inputChangeHandler = this.inputChangeHandler.bind(this);

		this.mediaImageClickHandler = this.mediaImageClickHandler.bind(this);

		this.sendButtonClickHandler = this.sendButtonClickHandler.bind(this);

		this.state = {
			visible: false,
			informantNameInput: '',
			informantBirthDateInput: '',
			informantBirthPlaceInput: '',
			informantInformationInput: '',
			messageInput: '',
			messageCommentInput: '',
			nameInput: '',
			emailInput: '',
			messageSent: false,
			messageOnFailure: '',
			currentImage: null
		};

		if (window.eventBus) {
			//console.log('TranscriptionOverlay window.eventBus');
			window.eventBus.addEventListener('overlay.transcribe', function(event) {
				this.setState({
					visible: true,
					type: event.target.type,
					title: event.target.title,
					id: event.target.id,
					url: event.target.url,
					images: event.target.images,
					imageIndex: 0
				});
				this.transcribeStart(event.target.id);
			}.bind(this));
			window.eventBus.addEventListener('overlay.hide', function(event) {
				this.setState({
					visible: false
				});
			}.bind(this));
		}
	}

	transcribeStart(recordid) {
		//console.log(this.state);
		//console.log('transcribeStart' + recordid);

		var data = {
			recordid: recordid,
		};

		var formData = new FormData();
		formData.append("json", JSON.stringify(data) );

		fetch(config.restApiUrl+'transcribestart/', {
			method: "POST",
			body: formData
		})
		.then(function(response) {
			return response.json()
		}).then(function(json) {
			var responseSuccess = false;
			if (json.success) {
				if (json.success == 'true') {
					responseSuccess = true;
					this.setState({
						// Do not show any message:
						messageSent: false
					})
				}
			}
			if (!responseSuccess) {
				var messageOnFailure = 'Failure!';
				if (json.message) {
					messageOnFailure = json.message;
				}
				this.setState({
					// show message:
					messageSent: true,
					messageOnFailure: messageOnFailure
				})
			}
		}.bind(this));
	}

	closeButtonClickHandler() {
		this.setState({
			visible: false,		
			informantName: '',
			informantBirthDate: '',
			informantBirthPlace: '',
			informantInformation: '',
			title: '',
			message: '',
			messageComment: '',
			messageOnFailure: '',
		});
	}

	mediaImageClickHandler(event) {
		this.setState({
			imageIndex: event.currentTarget.dataset.index
		});
	}

	inputChangeHandler(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	sendButtonClickHandler() {
		//console.log(this.state);
		let text = this.state.messageInput;
		let isMinimum2Words = text.trim().indexOf(' ') != -1;
		if (!isMinimum2Words) {
			alert(l('Avskriften kan inte sparas. Fältet "Text" ska innehålla en avskrift!'));
		}
		else {
			var data = {
				url: this.state.url,
				recordid: this.state.id,
				recordtitle: this.state.title,
				from_email: this.state.emailInput,
				from_name: this.state.nameInput,
				subject: "Crowdsource: Transkribering",
				informantName: this.state.informantNameInput,
				informantBirthDate: this.state.informantBirthDateInput,
				informantBirthPlace: this.state.informantBirthPlaceInput,
				informantInformation: this.state.informantInformationInput,
				message: this.state.messageInput,
				messageComment: this.state.messageCommentInput,
			}
	/*			message: this.state.title+'\n'+
					this.state.url+'\n\n'+
					'Från: '+this.state.nameInput+' ('+this.state.emailInput+')\n\n'+
					this.state.messageInput
	*/		

			var formData = new FormData();
			formData.append("json", JSON.stringify(data) );
			// console.log('formData' + formData);

			fetch(config.restApiUrl+'transcribe/', {
				method: "POST",
				body: formData
			})
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				if (json.success) {
					this.setState({
						// Show thank you message:
						messageSent: true,
						// Clear transcribe fields:
						messageInput: ''
					})
				} else {
						// Show message:
						console.log('Server does not repond for: ' + this.state.url);
				}
			}.bind(this));
		}
	}

	UNSAFE_componentWillReceiveProps() {
		this.setState({
			messageSent: false,
			informantNameInput: '',
			informantBirthDateInput: '',
			informantBirthPlaceInput: '',
			informantInformationInput: '',
			messageInput: '',
			messageCommentInput: '',
			messageOnFailure: '',
		});
	}

	render() {
		let _props = this.props;

		if (this.state.messageSent) {
			var message = 'Tack för din avskrift som nu skickats till Institutet för språk och folkminnen. Efter granskning kommer den att publiceras i denna applikation.'
			if (this.state.messageOnFailure) {
				message = this.state.messageOnFailure;
			}
			var overlayContent = <div>
				<p>{l(message)}</p>
				<p><br/><button className="button-primary" onClick={this.closeButtonClickHandler}>Stäng</button></p>
			</div>;
		}
		else {
			if (this.state.images && this.state.images.length > 0) {
				var imageItems = this.state.images.map(function(mediaItem, index) {
					if (mediaItem.source.indexOf('.pdf') == -1) {
						return <img data-index={index} key={index} className="image-item" data-image={mediaItem.source} onClick={this.mediaImageClickHandler} src={config.imageUrl+mediaItem.source} alt="" />;
					}
				}.bind(this));
			}

			var overlayContent = <div className="row">

				<div className="four columns">
					{/*
					<p><a href="https://www.isof.se/om-oss/kartor/sagenkartan/transkribera.html"><strong>{l('Läs mer om att skriva av.')}</strong></a><br/><br/></p>

					<hr/>

					*/}

					<div className="row">
					<label htmlFor="transcription_informantname" className="six columns">Berättat av:</label>
					<label htmlFor="transcription_informantbirthdate" className="two columns">Född år:</label>
					<label htmlFor="transcription_informantbirthplace" className="four columns">Född i:</label>
					</div>

					<div className="row">
						<div className="mark-below-img">
						<input id="transcription_informantname" name="informantNameInput" className="six columns" type="text" value={this.state.informantNameInput} onChange={this.inputChangeHandler} />
						{//
						//	<figure>
						 //   <img src="img/ifgh-card-upperpart-name.png" width="400" height="100" alt="photo"></img>
						//</figure>
						//
					}
						</div>

						<div className="mark-below-img">
						<input id="transcription_informantbirthdate" name="informantBirthDateInput" className="two columns" type="text" value={this.state.informantBirthDateInput} onChange={this.inputChangeHandler} />
						{//
						//	<figure>
						 //   <img src="img/ifgh-card-upperpart-birthyear.png" width="400" height="100" alt="photo"></img>
						//</figure>
						//
					}
						</div>

						<div className="mark-below-img">
						<input id="transcription_informantbirthplace" name="informantBirthPlaceInput" className="four columns" type="text" value={this.state.informantBirthPlaceInput} onChange={this.inputChangeHandler} />
						{//
						//	<figure>
						//    <img src="img/ifgh-card-upperpart-birthplace.png" width="400" height="100" alt="photo"></img>
						//	<div id="circle3"></div>
						//</figure>
						//
					}
						</div>
					</div>

					<label htmlFor="transcription_informant" className="u-full-width margin-bottom-zero">Fält under berättat av:</label>
					<input id="transcription_informant" name="informantInformationInput" className="u-full-width margin-bottom-minimal" type="text" value={this.state.informantInformationInput} onChange={this.inputChangeHandler} />

					<div className="mark-above-img">
						<label htmlFor="transcription_title" className="u-full-width margin-bottom-zero">Titel:</label>
						<input id="transcription_title" name="title" className="u-full-width margin-bottom-minimal" type="text" value={this.state.title} onChange={this.inputChangeHandler} />
						{//
						//	<figure>
						//    <img src="img/ifgh-card-upperpart-title.png" width="400" height="100" alt="photo"></img>
						//	</figure>
						//	
					}
					</div>

					<div className="mark-above-img">
						<label htmlFor="transcription_text" className="u-full-width margin-bottom-zero">Text:</label>
						<textarea id="transcription_text" name="messageInput" className="u-full-width margin-bottom-minimal" value={this.state.messageInput} onChange={this.inputChangeHandler} style={{height: 380}}></textarea>
						{//
						//	<figure>
						//    <img src="img/ifgh-card-upperpart-text.png" width="400" height="100" alt="photo"></img>
						//</figure>
						//
					}
					</div>

					<label htmlFor="transcription_comment" className="u-full-width margin-bottom-zero">{l('Kommentar till avskriften:')}</label>
					<input id="transcription_comment" name="messageCommentInput" className="u-full-width margin-bottom-minimal" type="text" value={this.state.messageCommentInput} onChange={this.inputChangeHandler} />
					<p>{l('Vill du att vi anger att det är du som har skrivit av uppteckningen? Ange i så fall ditt namn och din e-postadress nedan. Vi hanterar personuppgifter enligt dataskyddsförordningen. ')}<a href="https://www.isof.se/om-oss/behandling-av-personuppgifter.html"><strong>{l('Läs mer.')}</strong></a></p>

					<label htmlFor="transcription_name">Ditt namn (frivilligt):</label>
					<input id="transcription_name" autoComplete="name" name="nameInput" className="u-full-width" type="text" value={this.state.nameInput} onChange={this.inputChangeHandler} />
					<label htmlFor="transcription_email">Din e-post adress (frivilligt):</label>
					<input id="transcription_email" autoComplete="" name="emailInput" className="u-full-width" type="email" value={this.state.emailInput} onChange={this.inputChangeHandler} />

					<button className="button-primary" onClick={this.sendButtonClickHandler}>Skicka</button>
				</div>

				<div className="eight columns">

					<ImageMap image={this.state.images ? config.imageUrl+this.state.images[this.state.imageIndex].source : null} />

					<div className="image-list">
						{imageItems}
					</div>
				</div>

			</div>;
		}

		return <div className={'overlay-container'+(this.state.visible ? ' visible' : '')}>
			<div className="overlay-window large">

				<div className="overlay-header">
					{l('Skriv av')} {this.state.title}
					<button title="stäng" className="close-button white" onClick={this.closeButtonClickHandler}></button>
					{
						!config.siteOptions.hideContactButton &&
						<FeedbackButton title={this.state.title} type="Uppteckning" {..._props}/>
					}
					{
						!config.siteOptions.hideContactButton &&
						<ContributeInfoButton title={this.state.title} type="Uppteckning" {..._props}/>
						//<ContributeInfoButton title={this.state.data.title} type="Sägen" />
					}
					{
						!config.siteOptions.hideContactButton &&
						<TranscriptionHelpButton title={this.state.title} type="Uppteckning" {..._props}/>
					}
				</div>

				{overlayContent}

			</div>
		</div>;
	}
}
