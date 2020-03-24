import React, { PureComponent, Fragment } from 'react';
import { Input } from "reactstrap"; // Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle,
import crypto from 'crypto';
import badWordsFilter from './bad_words';
import $ from 'jquery';
import debounce from 'lodash.debounce';
import xssFilters from 'xss-filters';
import {loadingImage} from "../../../general/System";
import MessageBox from './../../../general/MessageBox';

require('emojionearea/dist/emojionearea.min.css');
require('emojionearea/dist/emojionearea.min.js');
const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';

export default class Controls extends PureComponent {
    constructor(props) {
        super(props);
        this.state = ({
            content: '',
            isBlock: false,
            isError: false
        });
        this.onHandlePress = debounce(this.onHandlePress, 300)
    }

    loadEmojiOne = () => {
        return new Promise((resolve, reject) => {
            $("#text-input-area").emojioneArea({
                saveEmojisAs: "shortname",
                inline: true,
                autocomplete: false,
                search: false,
                pickerPosition: "top",

                useInternalCDN: true,
                events:
                {
                    keyup: (editor, event) => this.onHandlePress(editor, event),
                }
            });
            let el = $("#text-input-area").emojioneArea();
            if (el && el[0]) {
                resolve();
            } else {
                reject();
            }
        })
    };
    onHandlePress = (editor, e) => {
        if (e.which === 13) {
            e.preventDefault();

            const { isError } = this.state;
            if(isError) return this.setState({modal:true});

            let chatContent = $('#text-input-area').data("emojioneArea").getText();
            let xssFilter = xssFilters.inHTMLData(chatContent);
            let hashAndFilterBadwords = this.encrypt(badWordsFilter(xssFilter));
            let message = {
                roomName: this.props.currentRoom,
                user: {
                    userName: this.props.user.userName,
                    avatar: 'none',
                    userId: this.props.user._id
                },
                data: hashAndFilterBadwords,
                type: 'text',
                date: new Date()
            };
            if (message.data.length > 0) {
                this.props.onSendMessage(message);
                $('#text-input-area').data("emojioneArea").setText('');
                $('#text-input-area').data("emojioneArea").hidePicker();

            }
            this.props.checkSent('sent')
        }
    }
    componentDidMount = () => {
        // const { blockFriendList, user, currentRoom } = this.props;
        // const disabledInputChat = this.isBlock(user.userName, blockFriendList, currentRoom);
        let that = this;
        $("#text-input-area").emojioneArea({
            saveEmojisAs: "shortname",
            inline: true,
            autocomplete: false,
            search: false,
            pickerPosition: "top",
            useInternalCDN: true,
            events:
            {
                keyup: function (editor, event) {
                    let chatContent = $('#text-input-area').data("emojioneArea").getText();
                    that.onHandlePress(editor, event);
                    if (chatContent.length > 300) {
                        that.setState({ isError: true });
                    }else{
                        that.setState({ isError: false });
                    }
                },
                click: function (editor, event) {
                    this.hidePicker();
                }
            }
        });

        let timer = setInterval(function () {
            if ($("#text-input-area").is(":hidden")) {
                clearInterval(timer);
            }
        }, 2000);
    };

    encrypt = (text) => {
        let cipher = crypto.createCipher(algorithm, password);
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    };

    onHandleItemClick = (e, roomName) => {
        e.preventDefault();
        this.props.onHandleItemClick(roomName);
    };

    onHandleDropDownClick = () => {
        this.props.onHandleDropDownClick();
    };

    componentDidUpdate = (prevProps) => {
        if (prevProps.currentRoom !== this.props.currentRoom) {
            const { blockFriendList, user, currentRoom } = this.props;
            const disabledInputChat = this.isBlock(user.userName, blockFriendList, currentRoom);
            this.setState({ isBlock: disabledInputChat });
        }
    }

    onHandleSubmit = (e) => {
        e.preventDefault();

        const { isError } = this.state;
        if(isError) return this.setState({modal:true});

        let chatContent = $('#text-input-area').data("emojioneArea").getText();
        let xssFilter = xssFilters.inHTMLData(chatContent);
        let hashAndFilterBadwords = this.encrypt(badWordsFilter(xssFilter));
        let message = {
            roomName: this.props.currentRoom,
            user: {
                userName: this.props.user.userName,
                avatar: 'none',
                userId: this.props.user._id
            },
            data: hashAndFilterBadwords,
            type: 'text',
            date: new Date()
        };

        if (message.data.length > 0) {
            this.props.onSendMessage(message);
            $('#text-input-area').data("emojioneArea").setText('');
        }

        this.props.checkSent('sent')
    };

    isBlock = (userName, blockFriendList, currentRoom) => {
        if (typeof blockFriendList === 'undefined') return false;
        let isBlocked = blockFriendList.findIndex(f => currentRoom.includes(f.friend.name)) !== -1 ? true : false;
        isBlocked = isBlocked && currentRoom.includes(userName);
        return isBlocked;
    };

    getErrorAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.setState({modal:false});
        const header = "완료";
        const body   = "문자 수는 300 미만이어야합니다.";
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    }

    render() {
        return (
            <Fragment>
                {this.getErrorAlertPopup()}
                <div className='control-container'>
                    <Input id='text-input-area' className='my-message-input' placeholder="Type something..." />
                    <div className='button-submit' onClick={(e) => this.onHandleSubmit(e)}>
                        <img alt='send' src={loadingImage('/images/game-ui/sm-send.svg')} />
                    </div>
                </div>
            </Fragment>
        );
    }
}
