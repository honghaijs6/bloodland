import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import emojione from 'emojione';
import html_to_react from 'html-to-react'
import QRCode from 'qrcode.react';
import crypto from 'crypto';

const HtmlToReactParser = html_to_react.Parser;
const htmlToReactParser = new HtmlToReactParser();

const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}


export default class ChatBubble extends PureComponent {



    static propTypes = {
        message: PropTypes.object.isRequired,
        active: PropTypes.bool
    };

   
    onHandleText = (messageData) => {
        let text = emojione.toImage(messageData);
        const reactElement = htmlToReactParser.parse(text);
        return reactElement;
    };

    onOpenImage = (e) => {
       this.props.onOpenImage(e.target.name);
    }

    renderMessageWithTypes = (message) => {
        const { styleClass } = this.props;
        let body = decrypt(message.body);
        switch (message.type) {
            case `text`:
                return (
                    <div className={`chat__bubble-message-wrap ${styleClass}`}>
                        <p className='chat__bubble-contact-name-date'>
                            {message.user.userName}
                            &emsp;
                            <span className='date'>{moment(message.date).format('LT')}</span>
                        </p>
                        <p className='chat__bubble-message'><span className="message-text">{this.onHandleText(body)}</span></p>
                        {/* <p className='chat__bubble-date'>{moment(message.date).format('LT')}</p> */}
                    </div>
                );
            case `image`:
                return (
                    <div className={`chat__bubble-message-wrap ${styleClass} chat__bubble-message-wrap--file`}>
                        <p className='chat__bubble-contact-name-date'>
                            {message.user.userName}
                            &emsp;
                            <span className='date'>{moment(message.date).format('LT')}</span>
                        </p>

                        <img name={`/images/upload/${body}`} src={`/images/upload/${body}`} alt={body} onClick={this.onOpenImage} />
                    </div>
                );
            case `qrcode`:
                return (
                    <div className={`chat__bubble-message-wrap ${styleClass} chat__bubble-message-wrap--file`}>
                        <p className='chat__bubble-contact-name-date'>
                            {message.user.userName}
                            &emsp;
                            <span className='date'>{moment(message.date).format('LT')}</span>
                        </p>
                        <QRCode value={body} />


                    </div>
                );
            default: return '';
        }
    };

    render() {
        const { message, active, styleClass } = this.props;
        let bubbleClass = classNames({
            'chat__bubble': true,
            'chat__bubble--active': active
        });

        return (
            <div className={bubbleClass}>
                {styleClass
                    ? ''
                    : <div className='chat__bubble-avatar'>
                        <img src='images/2.png' alt='ava' />
                    </div>
                }
                {this.renderMessageWithTypes(message)}
              
            </div>
        )
    }
}

// {message.file ?
//     <div className='chat__bubble-message-wrap chat__bubble-message-wrap--file'>
//         <p className='chat__bubble-contact-name'>{contact.name}</p>
//         <img src={message.file.preview} alt={message.message}/>
//         <p className='chat__bubble-date'>{moment(message.date).format('LT')}</p>
//         <div className='chat__bubble-download-wrap'>
//             <p className='chat__bubble-file-name'>
//                 <span>{message.message}</span>
//                 <span>{message.file.size}</span>
//             </p>
//             <a className='chat__bubble-download' href={message.file.preview} download>Download</a>
//         </div>
//     </div>
//     :
//     <div className='chat__bubble-message-wrap'>
//         <p className='chat__bubble-contact-name'>{contact.name}</p>
//         <p className='chat__bubble-message'>{message.message}</p>
//         <p className='chat__bubble-date'>{moment(message.date).format('LT')}</p>
//     </div>
// }