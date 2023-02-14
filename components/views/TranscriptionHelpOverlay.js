import React from 'react';
import config from './../../../scripts/config.js';

// Transcription help support only for transcription support. See also HelpOverlay, ContributeInfoOverlay and FeedbackOverlay.
// Main CSS: ui-components/overlay.less

export default class TranscriptionHelpOverlay extends React.Component {
	constructor(props) {
		////console.log('TranscriptionHelpOverlay');
		super(props);

		this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);

		this.state = {
			visible: false,
			messageInputValue: '',
			nameInputValue: '',
			emailInputValue: '',
			messageSent: false
		};

		////console.log('TranscriptionHelpOverlay before window.eventBus');
		if (window.eventBus) {
			//console.log('TranscriptionHelpOverlay has window.eventBus');
			window.eventBus.addEventListener('overlay.transcriptionhelp', function(event) {
				//console.log('TranscriptionHelpOverlay help');
				this.setState({
					visible: true,
					type: event.target.type,
					title: event.target.title,
					url: event.target.url,
					appUrl: event.target.appUrl,
				});
			}.bind(this));
			window.eventBus.addEventListener('overlay.hide', function(event) {
				this.setState({
					visible: false
				});
			}.bind(this));
		}
	}

	closeButtonClickHandler() {
		this.setState({
			visible: false
		});
	}

	render() {
		if (this.state.messageSent) {
			var overlayContent = <div>
				<p>Meddelande skickat. Tack.</p>
				<p><br/><button className="button-primary" onClick={this.closeButtonClickHandler}>Stäng</button></p>
			</div>;
		}
		else {
			var overlayContent = <div className='helptext'>
				<p>Vill du hjälpa till att tillgängliggöra samlingarna? Här finns möjligheten att skriva av berättelser, t.ex. från en viss ort eller ett visst ämne. Detta gör inte bara berättelserna mer tillgängliga för fler personer utan möjliggör också fritextsökningar.</p>
				<p><strong>Vilken information i vilken ruta? </strong></p>
				Varje textfält som ska fyllas i motsvarar en särskild rad i uppteckningen som du ser på höger sida. Ibland saknas text på vissa rader. Lämna då samma textfält tomt.
				<p><strong>Om berättaren</strong></p>
				Informationen som hör till berättaren börjar med fältet <strong>”Berättat av”</strong>. I det textfältet skriver du in namnet på personen. Ibland kan det stå något mer direkt efter namnet, t.ex. namnet på en gård eller en ort. Ange den informationen istället i fältet <strong>”Fält under berättat av”</strong>. <br/>
				Kortfattat kan man säga att all information om berättaren som inte är ett namn (Berättat av), ett födelseår (Född år), eller en födelseort (Född i) kan skrivas i fältet <strong>”Fält under berättat av”</strong>. 
				<p><strong>Oläsliga ord?</strong></p>
				Om du inte kan läsa något ord på uppteckningen, ange <strong>###</strong> istället för ordet ifråga. Är det flera ord bredvid varandra som inte kan tydas, skriv <strong>###</strong> för varje ord.
				<p><strong>Ny rad?</strong></p>
				Skriv av raderna exakt som de står, även med radbrytningar och stavfel. Överstrukna ord kan ignoreras. Om texten radbryts i uppteckningen, klicka då på Enter för att påbörja en ny rad i textfältet.
				<p><strong>Specialtecken?</strong></p>
				Ibland förekommer specialtecken i uppteckningarna. I den mån du kan, skriv även dessa tecken med i avskriften. Det kan till exempel vara ô, skrivet som ett o med ^ över.
				<p><strong>Text i marginalen?</strong></p>
				Ibland har upptecknaren fortsatt på en mening nedanför raderna på blanketten. Skriv med det i textfältet. Övriga ord eller tecken som ligger i marginalerna men som inte hör till själva uppteckningen, behöver du inte transkribera. Däremot kan du skriva med marginaltexten som en kommentar till uppteckning.
				<p><strong>Flera sidor?</strong></p>
				Består uppteckningen av flera sidor skriver du in samtliga sidor i samma textruta, men markera när du börjar skriva på en annan sida med tecknet <strong>/</strong> (snedstreck). Tryck på Enter innan och efter <strong>/</strong>. Snedstrecket ska alltså stå ensamt på en egen rad. <br/> Sidorna ligger som en lista under den aktuella sidan. Tryck på en sida för att förstora.
				<p><strong>Zooma</strong></p>
				Vill du se ännu tydligare vad det står i uppteckningen? Det går bra att zooma in och ut. Använd zoom-funktionen i övre vänstra hörnet och flytta fokus på sidan genom att röra muspekaren.
				<p><strong>Vilka är personerna som nämns i texten?</strong></p>
				Känner du till någon av personerna som omnämns i uppteckningen och har du eventuellt fotografier eller liknande? Kontakta oss via knappen "Vet du mer" ovanför uppteckningen. Du kan även välja att skriva en kommentar om personen i kommentarsfältet.
				<p><strong>Kommentar till avskriften</strong></p>
				Har du stött på något problem med avskriften eller har du någon annan kommentar till den? Skriv då i kommentarsfältet.
				<p><strong>Vad händer efter att du tryckt på ”Skicka in?”</strong></p>
				Efter kvalitetssäkring kommer texten sedan att publiceras på Folke och införlivas i Isofs digitala arkiv.
				<br/><a href="https://www.isof.se/arkiv-och-insamling/digitala-arkivtjanster/folke/transkribera"><strong>{l('Läs mer om att skriva av.')}</strong></a><br/><br/>
			</div>;
		}

		return <div className={'overlay-container feedback-overlay-container'+(this.state.visible ? ' visible' : '')}>
			<div className="overlay-window">
				
				<div className="overlay-header">
					{l('Instruktioner')}
					<button title="stäng" className="close-button white" onClick={this.closeButtonClickHandler}></button>
				</div>

				{overlayContent}

			</div>
		</div>;
	}
}