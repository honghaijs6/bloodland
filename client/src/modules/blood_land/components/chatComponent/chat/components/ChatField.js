import React, { PureComponent } from 'react';
import ImagePlusIcon from 'mdi-react/ImagePlusIcon';
import { socketActions } from './../../../store/actions/socketActions'
import { connect } from 'react-redux';
import $ from 'jquery';
import { QrcodeIcon } from 'mdi-react';
import crypto from 'crypto';
import { chatActions } from '../../../store/actions/chatActions';
import bad_words from './bad_words';
window.jQuery = $;
window.$ = $;
global.jQuery = $;
require('emojionearea/dist/emojionearea.min.css');
require('emojionearea/dist/emojionearea.min.js');

const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';

function badWordsFilter(bad_words, sourceStr) {
    var regex = new RegExp(bad_words.join("|"), 'gi');
    return sourceStr.replace(regex, function (match) { return match.replace(/./g, '*'); });
}

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

var globalCurrentRoom;

class ChatField extends PureComponent {
    constructor(props) {
        super(props);
        this.state = ({
            type: 'text',
            chatField: '',
            isToggleQR: false
        })
    }

    componentDidUpdate = () => {
        globalCurrentRoom = this.props.currentRoom;
    };

    componentDidMount = () => {
       

        $("#emojioneArea").emojioneArea({
            standalone: true,
            saveEmojisAs: "shortname",
            pickerPosition: "top",
            tonesStyle: "square",
            autocomplete: false,
            shortcuts: false,
            useInternalCDN: true
        });

        const { onSendMessage } = this.props;
        const { currentRoom, currentUser } = this.props;

        globalCurrentRoom = currentRoom;
        $("#emojioneArea").data("emojioneArea").editor.on("keydown", function (e) {
            if (e.which === 13) {
                let el = $("#emojioneArea").emojioneArea();
                let chatContent = el[0].emojioneArea.getText();
                if (chatContent.length < 1) {
                    alert("Error ne");
                }
                else {
                    let filterResult = badWordsFilter(bad_words,chatContent);
                    let message = {
                        roomName: globalCurrentRoom,
                        user: {
                            userName: currentUser.userName,
                            avatar: 'none'
                        },
                        data: encrypt(filterResult),
                        type: 'text',
                        date: new Date()
                    };

                    onSendMessage(message);
                }
                el[0].emojioneArea.setText('');
                return false;
            }
        });
    };



    
    onHandleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    // onSubmit = (e) => {
    //     const { currentRoom, currentUser } = this.props;
    //     const { chatField } = this.state;
    //     e.preventDefault();
    //     if (chatField.length < 1) {
    //         window.alert("error");
    //     }
    //     else {

    //         let message = {
    //             roomName: currentRoom,
    //             user: {
    //                 userName: currentUser.userName,
    //                 avatar: 'none'
    //             },
    //             data: chatField,
    //             type: 'text',
    //             date: new Date()
    //         }
    //         this.props.onSendMessage(message);

    //     }
    //     this.onClearChatField();
    //     // if(e.key == 'Enter'){
    //     // }
    // }

    // onClearChatField = () => {
    //     this.setState({
    //         chatField: ''
    //     });
    // }

    onToggleQR = (e) => {
        e.preventDefault();
        const { isToggleQR } = this.state;
        this.setState({
            isToggleQR: !isToggleQR
        });
    };


    onSubmitQRCode = (e) => {
        const { QRCodeValue } = this.state;
        const { onSendMessage } = this.props;
        const { currentRoom, currentUser } = this.props;
        e.preventDefault();
        if (QRCodeValue.length < 1) {
            window.alert("Error");
        }
        else {
            let message = {
                roomName: currentRoom,
                user: {
                    userName: currentUser.userName,
                    avatar: 'none'
                },
                type: 'qrcode',
                data: encrypt(QRCodeValue)
            };
            onSendMessage(message);
            this.setState({ isToggleQR: false, QRCodeValue: '' });
        }
    };

    onDisplayQRCode = () => {
        const { isToggleQR, QRCodeValue } = this.state;
        return isToggleQR
            ? <div class="qr-code">
                QR Code value
            <input type="text" name="QRCodeValue" value={QRCodeValue} onChange={this.onHandleChange} />
                <button onClick={this.onSubmitQRCode}>Send</button>
            </div>
            : '';
    };

    onClickImagePlus = (e) => {
        e.preventDefault();
        document.getElementById("image-file").click();
    };

    onHandleFileSelect = (e) => {
        const { onSendMessage } = this.props;
        const { currentRoom, currentUser } = this.props;
        let selectedFile = e.target.files[0];

        //   window.event.preventDefault();
        //  let user = {
        //     userName: userName,
        //     avatar: 'none'
        // }

        chatActions.uploadImage(selectedFile)
        .then(res => {

            let message = {
                roomName: currentRoom,
                user: {
                    userName: currentUser.userName,
                    avatar: 'none'
                },
                type: 'image',
                data: encrypt(`image-${selectedFile.name}`)
            };

            if (res.status && res.status === 200) {
                onSendMessage(message);
            } else {
                onSendMessage(message);
            }
            document.getElementById("image-file").value = "";
        })
        .catch(err => {
            // console.log(err);
        })
    };

    onEnter = (e) => {
        // console.log(e);
    };

    render() {
        return (
            <div className='chat__text-field' >
                <form autoComplete="off" className='chat__form' >
                    <input id="emojioneArea" className='chat__field-input' placeholder="Type here..." onKeyPress={this.onEnter} />
                    <div className='chat__field-controls'>
                        <button className='chat__icon-button' onClick={this.onToggleQR}>
                            <QrcodeIcon />
                        </button>
                        <input type="file" id="image-file" onChange={this.onHandleFileSelect} />
                        {this.onDisplayQRCode()}
                        <button className='chat__icon-button' onClick={this.onClickImagePlus}>
                            <ImagePlusIcon />
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentRoom: state.chatRooms.currentRoom,
        currentUser: state.authentication.user
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        onSendMessage: (message) => {
            dispatch(socketActions.sendMessage(message))
        }
    }
};

const connectedChatField = connect(mapStateToProps, mapDispatchToProps)(ChatField);
export default connectedChatField;