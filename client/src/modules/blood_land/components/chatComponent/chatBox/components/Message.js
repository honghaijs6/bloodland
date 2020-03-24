import React, { Fragment, PureComponent } from 'react';
import cryptTo from 'crypto';
import emojione from 'emojione';
import html_to_react from 'html-to-react'

const HtmlToReactParser = html_to_react.Parser;
const htmlToReactParser = new HtmlToReactParser();

export default class Message extends PureComponent {
    state = {
        active: false
    };

    onHandlePersonalChatMouseOver = (e) => {

        const { message, userName } = this.props;
        if (userName !== message.user.userName) {
            const data = {
                username: message.user.userName,
                ms: this.props.ms,
                y: e.nativeEvent.y,
                x: e.nativeEvent.x
            };

            this.props.changeCurrentMessage(this.props.ms);
            this.props.onHandlePersonalChatMouseOver(data);
        }
    };

    onHandleText = (messageData) => {
        let text = emojione.toImage(messageData);
        return htmlToReactParser.parse(text);
    };

    onDecrypt(algorithm, password, text) {
        let decipher = cryptTo.createDecipher(algorithm, password)
        let dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }

    render() {
        const algorithm = 'aes-256-ctr';
        const password = 'd6F3Efeq';
        const { message, userName } = this.props;


        return (
            <Fragment>
                {message && message.user.userName === userName ? <div className='chat-content-item-right'>
                    <div className="chat-container" onClick={(e) => this.onHandlePersonalChatMouseOver(e)}>
                        <div className='chat-content'>
                            <div className='content'>
                                {this.onHandleText(this.onDecrypt(algorithm, password, message.body))}
                            </div>
                        </div>
                    </div>
                </div> :
                    <div className='chat-content-item-left'>
                        <div className="chat-container" onClick={(e) => this.onHandlePersonalChatMouseOver(e)}>
                            <div className='username-hint'>
                                {
                                    message.user && typeof message.user.userName !== 'undefined'
                                        ? message.user.userName.length > 20
                                            ? message.user.userName.substring(0, 19) + '...'
                                            : message.user.userName
                                        : ''
                                }
                            </div>
                            <div className='chat-content'>
                                <div className='content'>
                                    {this.onHandleText(this.onDecrypt(algorithm, password, message.body))}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Fragment>
        )
    }
}
