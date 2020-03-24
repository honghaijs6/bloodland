import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

// RULE : Room's name of 2 User
// Example : John - Ben => Ben-John

class ChatRoom extends PureComponent {
    static propTypes = {
        contact: PropTypes.object.isRequired,
        active: PropTypes.bool,
    };

    onJoinRoom = () => {
        this.props.onOpenContacts();
        const { contact, currentRoom, type, currentUser } = this.props;
        let roomName = contact.name;

        if (type === 'user') {
            //contact.name is a user we want to chat in case type is user
            if (currentUser.userName > contact.name) {
                roomName = `${contact.name}-${currentUser.userName}`
            } else {
                roomName = `${currentUser.userName}-${contact.name}`
            }
        }

        if (currentRoom) { // if joined some room, leave room when join another room
            this.props.onLeaveRoom(currentRoom);
        } // else do nothing
        this.props.onJoinRoom(roomName);

    }

    render() {
        let contactClass = classNames({
            'chat__contact': true,
            'chat__contact--active': false
        });

        const { contact } = this.props;
        let imageAsBase64='';
        if (contact.image) {
            imageAsBase64 = new Buffer.from(contact.image.data.data).toString('base64');
        }


        const style = contact.status === "Online" ? {
            backgroundColor: '#00ff00'
        }
            : {
                backgroundColor: '#c0c0c0'
            }
        return (
            <div className={contactClass} onClick={this.onJoinRoom}>
                <div className='chat__contact-avatar'>
                    <img src={`data:image/jpeg;base64, ${imageAsBase64}`} />
                </div>
                <div className='chat__contact-preview'>
                    <p className='chat__contact-name'>
                        {contact.name}
                        <span style={style} className="chat__contact-status"></span>
                    </p>
                    <p className='chat__contact-post'>{contact.status}</p>

                    {/* <p className='chat__contact-last-message'>{lastMessage}</p>  */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.authentication.user
    }
};

const connectChatRoom = connect(mapStateToProps, null)(ChatRoom);
export default connectChatRoom;