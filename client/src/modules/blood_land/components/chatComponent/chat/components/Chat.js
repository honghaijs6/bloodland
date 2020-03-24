import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Scrollbar from 'react-smooth-scrollbar';
import classNames from 'classnames';
import ChatBubbleList from './ChatBubbleList';
import ChatSearch from './ChatSearch';
import ChatField from './ChatField';
import ChatTopbar from './ChatTopbar';
import { connect } from 'react-redux';

import ChatRoomList from './ChatRoomList';

class Chat extends PureComponent {

    constructor(props) {
        super(props);
        this.state = ({
            searchingValue: ''
        });
    }

    // componentDidUpdate = () => {
    //     const {currentRoom} = this.props;
    //     const{openContacts} = this.state;
    //     if(currentRoom){
    //         this.setState({ openContacts : false});
    //     }
    // }

    static propTypes = {
        currentUser: PropTypes.object.isRequired,
        contacts: PropTypes.array
    };

    state = {
        openContacts: false
    };

    onOpenChat = (contact, e) => {
        e.preventDefault();
        const dialog = this.props.contacts.find((c) => c.userName === contact).messages;
        const messages = dialog ? dialog : null;
        this.setState({
            currentChat: contact,
            currentMessages: messages,
            openContacts: false
        });
    };

    onOpenContacts = () => {
        this.setState({ openContacts: !this.state.openContacts });
    };
    onSearching = (searchValue) => {
        this.setState({
            searchingValue: searchValue
        });
    };

    render() {
        const { searchingValue } = this.state;
        const { currentUser, currentRoom } = this.props;
        let chatClass = classNames({
            'chat': true,
            'chat--open': this.state.openContacts
        });

        let contactsClass = classNames({
            'chat__contact-list': true,
            'chat__contact-list--open': this.state.openContacts
        });


        return (
            <div className={chatClass}>
                <div className={contactsClass}>
                    <ChatSearch onSearching={this.onSearching} />
                    <ChatRoomList searchingValue={searchingValue} onOpenContacts={this.onOpenContacts} />
                </div>
                {currentRoom === undefined ?
                    <div className='chat__dialog'>
                        <ChatTopbar onClick={this.onOpenContacts} />
                        <div className='chat__dialog-select-message'>
                            <p>Select a chat to start messaging</p>
                        </div>
                    </div>
                    :
                    <div className='chat__dialog'>
                        <ChatTopbar contact={currentRoom} currentUser={currentUser}
                            onClick={this.onOpenContacts} />
                        <Scrollbar id="chatbox-content" className='scroll chat__scroll' alwaysShowTracks>
                            <ChatBubbleList />
                        </Scrollbar>
                        <ChatField />
                    </div>
                }
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

const connectedChat = connect(mapStateToProps, null)(Chat);
export default connectedChat;
