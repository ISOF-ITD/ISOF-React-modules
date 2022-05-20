import React from 'react';

import config from './../../../scripts/config.js';

// Main CSS: ui-components/timeslots-audio-player.less

export default class TimeslotsAudioPlayer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentTime: 0,
			data: [],
			inner_hits: []
		};
	}

	componentDidMount() {
		window.l = window.l || function(str) { return str; };

		window.eventBus.addEventListener('audio.duration', function(event) {
			this.setState({
				currentTime: event.target.record.id == this.props.document.id ? Math.floor(event.target.duration) : -1
			});
		}.bind(this));

		if (this.props.data) {
			this.setState({
				data: this.props.data,
				inner_hits: this.props.inner_hits || null,
				document: this.props.document
			});
		}
	}


	render() {
		var player = this;

		var timeslots = this.state.data.timeslots;

		var hasHit = false;

		if (this.state.inner_hits) {
			try {
				this.state.inner_hits.media.hits.hits[0].inner_hits['media.timeslots'].hits.hits.forEach((hit, i) => {
					timeslots[hit._nested._nested.offset].text = hit.highlight['media.timeslots.text'][0];

					timeslots[hit._nested._nested.offset].hit = true;
				});

				hasHit = true;
			}
			catch(e) {
				hasHit = false;
			}
		}

		return (
			<div className="timeslots-audio-player">
				<div>{this.state.data.title}</div>
				<div>
					<button className="button play" onClick={(event) => {
						window.eventBus.dispatch('audio.playaudio', {
							record: {
								id: this.state.document.id,
								title: this.state.document.title,
							},
							audio: {
								source: this.state.data.source
							}
						});
					}}>Spela</button>
				</div>
				{
					timeslots && <div className="timeslots">
						{
							timeslots.map((time) => <div  onClick={() => {
								window.eventBus.dispatch('audio.playaudio', {
									record: {
										id: this.state.document.id,
										title: this.state.document.title,
									},
									audio: {
										source: this.state.data.source
									},
									seek: time.start
								});
							}} className={'item '+(time.start < this.state.currentTime && time.end > this.state.currentTime ? 'selected' : '')+(hasHit && time.hit ? ' hit' : '')+(hasHit && !time.hit ? ' minimized' : '')}>
								<div className="time">{time.start_str}</div>
								<p dangerouslySetInnerHTML={{__html: time.text}} />
								{
									!this.props.preview && time.images && time.images.length > 0 &&
									<div style={{marginTop: '20px'}}>
										{
											time.images.map(function(image, imgIndex) {
												return <img style={{maxWidth: '100px', marginRight: '20px', cursor: 'pointer'}}
													src={'http://'+image.image}
													key={imgIndex}
													onClick={function(event) {
														event.stopPropagation()

														if (window.eventBus) {
															window.eventBus.dispatch('overlay.viewimage', {
																imageUrl: 'http://'+image.image,
																fullUrl: true,
																type: 'image'
															});
														}
													}}/>
											})
										}
									</div>
								}
							</div>)
						}
					</div>
				}
			</div>
		);
	}
}
