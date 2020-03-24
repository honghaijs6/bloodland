import React, { PureComponent } from 'react';
import Scrollbar from 'react-smooth-scrollbar';
import ChatRoom from './ChatRoom';
import { connect } from 'react-redux';
import { userActions } from './../../../store/actions/userActions'
import { chatActions } from './../../../store/actions/chatActions'
class ChatRoomList extends PureComponent {

    componentDidMount = () => {
        this.props.onGetAllChatRooms();
        this.props.onGetAllUsers();   
         
    };

    onOpenContacts = () => {
        this.props.onOpenContacts();
    };

    onRenderChatRooms = () => {

        // && r.roomType === 'public'
        const { searchingValue } = this.props;
        const { chatRooms, currentRoom } = this.props.chatRooms;
        const { onJoinRoom, onLeaveRoom } = this.props;
        let result = null;
        if (chatRooms) {
            result = chatRooms.filter(
                r => r.name.includes(searchingValue) 
            ).map((roomContact, index) => {
                return <a key={index}>
                    <ChatRoom
                        contact={roomContact}
                        onJoinRoom={onJoinRoom}
                        onLeaveRoom={onLeaveRoom}
                        currentRoom={currentRoom}
                        type="room"
                        onOpenContacts={this.onOpenContacts}
                    />
                </a>
            });
        }
        return result;
    };

    onRenderUsers = () => {
        const { searchingValue } = this.props;
        const { users, currentUser } = this.props;
        const { currentRoom } = this.props.chatRooms;
        const { onJoinRoom, onLeaveRoom } = this.props;
        const onlineUsers = this.props.onlineUsers ? this.props.onlineUsers : [];
        let result = null;
        if (users) {
            // lọc chính mình ra khỏi danh sách user và lọc ra những user nếu có nhập từ khóa tìm kiếm
            result = users.filter(
                user => user.userName !== currentUser.userName && user.userName.includes(searchingValue)
            );

            // lọc ra những user có tồn tại trong onlineUsers để cập nhật Online & Offline
            for (let i = 0; i < result.length; i++) {
                let eachUser = result[i];
                for(let j =0;j<onlineUsers.length;j++){
                    eachUser["status"] = "Offline";
                    if(onlineUsers[j].userName === eachUser.userName){
                        eachUser["status"] = "Online";
                        break;
                    }           
                }
            }
            // render Components
            result = result.map((user, index) => {
                let contact = {
                    name: user.userName,
                    status:user.status,
                    image: user.avatar
                };
                return <a key={index}>
                    <ChatRoom
                        contact={contact}
                        onJoinRoom={onJoinRoom}
                        currentRoom={currentRoom}
                        type="user"
                        onOpenContacts={this.onOpenContacts}
                    />
                </a>
            });
        }
        return result;
    };

    render() {

        return (
            <div className='chat__contacts'>
                <Scrollbar className='scroll chat__contacts-scroll' alwaysShowTracks>
                    <p className="cates">Rooms</p>
                    {
                        this.onRenderChatRooms()
                    }
                    <hr />
                    <p className="cates">Users</p>
                    {
                        this.onRenderUsers()
                    }
                </Scrollbar>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onGetAllChatRooms: () => {
            dispatch(chatActions.getAll());
        },
        onJoinRoom: (roomName) => {
            dispatch(chatActions.joinRoomRequest(roomName));
        },
        onLeaveRoom: (roomName) => {
            dispatch(chatActions.leaveRoomRequest(roomName));
        },
        onGetAllUsers: () => {
            dispatch(userActions.getAll());
        }
    }

};

const mapStateToProps = (state) => {
    return {
        chatRooms: state.chatRooms,
        users: state.users.users,
        currentUser: state.authentication.user,
        onlineUsers: state.chatRooms.onlineUsers
    }
};

const connectedChatRoomList = connect(mapStateToProps, mapDispatchToProps)(ChatRoomList);
export default connectedChatRoomList;