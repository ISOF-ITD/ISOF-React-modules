// a react component for the transcription form for the Uppteckningsblankett
// (the form used for the transcription of the Uppteckningsblankett)

import React from 'react';

export default class Fritext extends React.Component {

    render() {
        return (
            <div className='transcriptionform fritext'>
                <div className="mark-above-img">
                    <label htmlFor="transcription_text" className="u-full-width margin-bottom-zero">Text:</label>
                    <textarea id="transcription_text" name="messageInput" className="u-full-width margin-bottom-minimal" defaultValue={this.props.messageInput} onChange={this.props.inputChangeHandler}></textarea>
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