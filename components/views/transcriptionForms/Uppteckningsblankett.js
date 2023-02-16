// a react component for the transcription form for the Uppteckningsblankett
// (the form used for the transcription of the Uppteckningsblankett)

import React from 'react';

export default class Uppteckningsblankett extends React.Component {

    render() {
        return (
            <div className='transcriptionform uppteckningsblankett'>
                <div className="row">
                    <label htmlFor="transcription_informantname" className="six columns">Berättat av:</label>
                    <label htmlFor="transcription_informantbirthdate" className="two columns">Född år:</label>
                    <label htmlFor="transcription_informantbirthplace" className="four columns">Född i:</label>
                </div>

                <div className="row">
                    <div className="mark-below-img">
                        <input id="transcription_informantname" name="informantNameInput" className="six columns" type="text" defaultValue={this.props.informantNameInput} onChange={this.props.inputChangeHandler} />
                        {//
                            //	<figure>
                            //   <img src="img/ifgh-card-upperpart-name.png" width="400" height="100" alt="photo"></img>
                            //</figure>
                            //
                        }
                    </div>

                    <div className="mark-below-img">
                        <input id="transcription_informantbirthdate" name="informantBirthDateInput" className="two columns" type="text" defaultValue={this.props.informantBirthDateInput} onChange={this.props.inputChangeHandler} />
                        {//
                            //	<figure>
                            //   <img src="img/ifgh-card-upperpart-birthyear.png" width="400" height="100" alt="photo"></img>
                            //</figure>
                            //
                        }
                    </div>

                    <div className="mark-below-img">
                        <input id="transcription_informantbirthplace" name="informantBirthPlaceInput" className="four columns" type="text" defaultValue={this.props.informantBirthPlaceInput} onChange={this.props.inputChangeHandler} />
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
                <input id="transcription_informant" name="informantInformationInput" className="u-full-width margin-bottom-minimal" type="text" defaultValue={this.props.informantInformationInput} onChange={this.props.inputChangeHandler} />

                <div className="mark-above-img">
                    <label htmlFor="transcription_title" className="u-full-width margin-bottom-zero">Titel:</label>
                    <input id="transcription_title" name="title" className="u-full-width margin-bottom-minimal" type="text" defaultValue={this.props.title} onChange={this.props.inputChangeHandler} />
                    {//
                        //	<figure>
                        //    <img src="img/ifgh-card-upperpart-title.png" width="400" height="100" alt="photo"></img>
                        //	</figure>
                        //	
                    }
                </div>

                <div className="mark-above-img">
                    <label htmlFor="transcription_text" className="u-full-width margin-bottom-zero">Text:</label>
                    <textarea lang="sv" id="transcription_text" name="messageInput" className="u-full-width margin-bottom-minimal" defaultValue={this.props.messageInput} onChange={this.props.inputChangeHandler}></textarea>
                    {//
                        //	<figure>
                        //    <img src="img/ifgh-card-upperpart-text.png" width="400" height="100" alt="photo"></img>
                        //</figure>
                        //
                    }
                </div>
            </div>
        );
    }


}