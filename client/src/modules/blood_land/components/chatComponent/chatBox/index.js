import React, {Fragment, PureComponent} from 'react'
import ReactDOM from 'react-dom';
import {connect} from "react-redux";
import {chatActions} from '../../store/actions/chatActions';
import {socketActions} from '../../store/actions/socketActions';
import MessageList from './components/MessageList';
import Controls from './components/Controls';
import {userActions} from "../../store/actions/userActions";
import SendMailPopup from '../blood_land/components/GameUIComponent/Common/SendMailPopup';
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon'
import ChevronRightIcon from 'mdi-react/ChevronRightIcon'
import Swiper from "react-id-swiper";
import {loadingImage} from "../../general/System";

const anotherMessHeight = 55.19512195121951; //pixel
const messHeight = 40.19512195121951 //pixel


class ChatBoxNewUI extends PureComponent {
    constructor(props) {
        super(props);
        this.swiper = null;
        this.TopMessageRef = React.createRef();
        this.messagesEnd = '';
    }

    state = {
        toggle: false,
        dropDown: false,
        personChatPopup: false,
        chatRooms: [{'name': 'all'}],
        sendKey: -1,
        loadMoreCount: 0,
        addFriendStatusBtn: true,
        blockFriendStatusBtn: true,
        currentChatboxHeight: 0,
        showScrollDownBtn: false,
        isScrolling: false,
        isGettingTopMessageOffset: false,
        lastTopOffset: -1,
        x: 0, y: 0,
        oldOffset: 0,
        sendMailModal: false,
        messages: []
    }

    goNext = () => {
        if (this.swiper) {
            this.swiper.slideNext();
        }
    }

    goPrev = () => {
        if (this.swiper) this.swiper.slidePrev()
    }

    onHandleClick = (e) => {
        e.preventDefault();
        this.setState({
            toggle: !this.state.toggle,
            personChatPopup: false
        }, () => this.scrollBack('firstAccess'));

    };


    onGetLastMessageOffset = (offset) => {
        this.setState({lastTopOffset: offset});
    }

    onHandleDropDownClick = () => {
        this.setState({
            dropDown: !this.state.dropDown
        })
    };

    onScrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: "auto"});
    }

    onHandleItemClick = (room) => {
        this.setState({isGettingTopMessageOffset: true});
        const {onLeaveRoom, onJoinRoom, currentRoom, user} = this.props;
        const {chatRooms} = this.state;

        if (room === currentRoom) return;
        let isExist = chatRooms.find(r => r.name === room);
        if (isExist === undefined) {
            chatRooms.push({'name': room});
            this.setState({
                chatRooms: chatRooms,
            });
        }
        if (currentRoom) {
            onLeaveRoom(currentRoom);
            onJoinRoom(room, user.userName);
            this.setState({loadMoreCount: 0});
        }
        this.setState({
            toggleChatTabOpen: false
        })
    };

    onHandleCloseClick = (room, preRoom) => {
        let chatRooms = this.state.chatRooms;
        chatRooms = chatRooms.filter(function (item) {
            return item.name !== room
        });
        this.setState({chatRooms});
        const {user, onLeaveRoom, onJoinRoom} = this.props;
        onLeaveRoom(room);
        onJoinRoom(preRoom, user.userName);

    };

    componentDidMount = () => {
        this.props.onJoinRoom('all', this.props.user);
        this.props.onGetFriendListBlockList({userId: this.props.user._id});
        this.props.onGetBeBlockUser({userId: this.props.user._id});

        this.setState({messages: this.props.messages});

        let that = this;
        let objDiv = document.getElementById("chatting-contents");

        const elem = ReactDOM.findDOMNode(this.refs.elementToFire);
        elem.addEventListener('scroll', function (event) {
            if (objDiv.scrollTop === 0 && !that.props.loading && that.props.n !== -1) {
                that.setState({oldOffset: objDiv.scrollHeight});
                that.props.onLoadMoreMessage(that.props.currentRoom, that.props.n, that.props.messages.length - 1);
            }
        }, false);
        this.scrollBack();
    };


    onHandlePersonalChatMouseOver = (data) => {
        setTimeout(() => this.setState({personChatPopup: true}), 0);
        const {username, ms, y, x} = data;
        this.props.checkStatusByUserName({
            userId: typeof this.props.user._id !== 'undefined' ? this.props.user._id : '',
            friendName: username
        });
        this.setState({
            sendKey: ms,
            personChatName: username,
            y, x
        });
    };

    onHandlePersonChatLeave = () => {
        setTimeout(() => {
            this.setState({
                sendKey: -1,
                personChatPopup: false
            })
        })
    };

    onHandlePersonChatToggle = () => {

        const {personChatName, chatRooms} = this.state;
        const {user, onLeaveRoom, onJoinRoom, currentRoom, recentlyChatUser, onAddRecentlyChatUser} = this.props;

        let newRoom = '';
        if (user.userName > personChatName) {
            newRoom = `${personChatName}-${user.userName}`
        } else {
            newRoom = `${user.userName}-${personChatName}`
        }

        if (currentRoom && currentRoom !== newRoom) {
            onLeaveRoom(currentRoom);
            onJoinRoom(newRoom, user.userName);
            this.setState({loadMoreCount: 0});
            let isExist = chatRooms.find(room => room.name === newRoom);
            if (isExist === undefined) {
                chatRooms.push({'name': newRoom});
                this.setState({chatRooms: chatRooms});
            }

            if (Array.isArray(recentlyChatUser) && recentlyChatUser.length > 0) {
                let isExistRecently = recentlyChatUser.find(room => room.name === newRoom);
                if (isExistRecently === undefined) {
                    onAddRecentlyChatUser({'name': newRoom});
                }
            }
        }
        this.setState({
            personChatPopup: false
        });
        this.onHandlePersonChatLeave();
    };




    scrollBack = (mode) => {
        let objDiv = document.getElementById("chatting-contents");
        if (mode === 'firstAccess') {
            objDiv.style.scrollBehavior = 'auto';
            objDiv.scrollTop = (objDiv.scrollHeight);
        } else {
            objDiv.style.scrollBehavior = 'smooth';
            objDiv.scrollTop = (objDiv.scrollHeight);
        }

        // this.setState({ showScrollDownBtn: false });
    };


    onRenderDropdownChatRoom = (chatRooms, toggleChatTabOpen) => {
        let {user, currentRoom, notifications} = this.props;

        if (typeof notifications === 'undefined') {
            notifications = [];
        } else {
            notifications = notifications.filter(roomName => roomName.includes(user.userName));
        }


        return chatRooms.map((r, index) => {
            let isActive = currentRoom === r.name;
            let isReceiveMessage = notifications.find(nt => nt === r.name);

            let displayRoomName = r.name.includes(user.userName) ? r.name.replace(user.userName, '').replace('-', '') : r.name;
            return (
                <div key={index}
                     className={`tab-container ${isActive ? 'active' : ''}  ${typeof isReceiveMessage !== 'undefined' ? 'notification' : ''}   `}>
                    <div className="room-name" onClick={() => this.onHandleItemClick(r.name)}>
                        {displayRoomName === 'all'
                            ? '모든'
                            : displayRoomName.length > 4
                                ? displayRoomName.substring(0, 4) + '...'
                                : displayRoomName}
                        {/* {r.name} */}
                    </div>
                    <div className='tabs-close' onClick={() => this.onHandleCloseClick(r.name, 'all')}>
                        <span className='lnr lnr-cross' style={{display: r.name !== 'all' ? 'block' : 'none'}}/>
                    </div>
                </div>

            )
        })


    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.infoStatusByUsername) {
            const {infoStatusByUsername: {statusFriend, statusBlock}} = nextProps;
            this.setState({addFriendStatusBtn: !statusFriend});
            this.setState({blockFriendStatusBtn: !statusBlock});
        }


        if (typeof this.props.notifications !== 'undefined' && typeof nextProps.notifications !== 'undefined' && nextProps.notifications.length > 0) {

            let blockFriendList = nextProps.users.blockFriendList;

            let userNoti = nextProps.notifications.filter(nt => {
                return nt.includes(nextProps.user.userName);
            })

            userNoti = userNoti.filter(nt => !blockFriendList.find(f => nt.includes(f.friend.name)));

            if (userNoti.length > 0) {

                let newChatRooms = this.state.chatRooms;
                for (let nt of userNoti) {
                    let isExistInChatRooms = newChatRooms.findIndex(room => room.name === nt);
                    if (isExistInChatRooms === -1) {
                        newChatRooms.push({name: nt});
                    }
                }

                this.setState({chatRooms: newChatRooms});
            }

            let notiFromBlockUser = nextProps.notifications.filter(nt => blockFriendList.find(f => nt.includes(f.friend.name)));
            if (notiFromBlockUser.length > 0) this.props.onClearNotifications(notiFromBlockUser);
        }


    }

    onMouseScroll = (e) => {
        this.onHandlePersonChatLeave();
    }

    getOldOffsetTop = (currentMessages, prevTopMessIndex) => {
        const {userName} = this.props.user;
        let offsetTop = 0;

        for (let i = prevTopMessIndex; i < currentMessages.length; i++) {
            if (currentMessages[i].user.userName === userName) {
                offsetTop += messHeight;
            } else {
                offsetTop += anotherMessHeight;
            }
        }
        return offsetTop
    };


    componentDidUpdate = (prevProps, prevState) => {

        if (typeof prevProps.messages !== 'undefined' && typeof this.props.messages !== 'undefined' && prevProps.messages.length !== this.props.messages.length) {
            let OldObjDiv = document.getElementById("chatting-contents");

            if (this.props.n !== 1) {

                let scrollTo = OldObjDiv.scrollTop = OldObjDiv.scrollHeight - prevState.oldOffset;
                this.setState({oldOffset: scrollTo});
            }

            if (this.props.messages.length - prevProps.messages.length === 1) {
                let delta = OldObjDiv.scrollHeight - OldObjDiv.scrollTop
                if (delta < 250) OldObjDiv.scrollTop = OldObjDiv.scrollHeight;
                else if (this.props.messages[this.props.messages.length - 1].user.userName === this.props.user.userName) {
                    OldObjDiv.scrollTop = OldObjDiv.scrollHeight;
                }

            }
            let filterMessages = this.filterBlockMessages(this.props.messages, this.props.user.userName);
            if (this.props.messages.length > 0 && filterMessages.length !== this.props.messages.length) {
                this.setState({messages: filterMessages});
            }
        }


        //lọc notifications


    };

    onHandleAddFriend = (e) => {
        e.preventDefault();
        const {infoStatusByUsername: {friendId, friendName}, user: {_id}} = this.props;
        this.setState({
            personChatPopup: false
        });
        this.props.resetChatSearch(true);
        this.props.addFriend(_id, [{'userId': friendId, 'name': friendName}]);
    };

    onHandleBlockFriend = (e) => {
        e.preventDefault();
        const {infoStatusByUsername: {friendId, friendName}, user: {_id}} = this.props;
        this.setState({
            personChatPopup: false
        });
        this.props.resetChatSearch(true);
        this.props.blockFriend(_id, [{'userId': friendId, 'name': friendName}]);
    };

    onHandleUnBlockFriend = (e) => {
        e.preventDefault();
        const {infoStatusByUsername: {friendId, friendName}, user: {_id}} = this.props;
        this.setState({
            personChatPopup: false
        });
        this.props.resetChatSearch(true);

        this.props.onUnBlockFriend(
            {
                userId: _id,
                unblockFriends: [
                    {'userId': friendId, 'name': friendName}
                ]
            }
        );

    }

    onRenderScrollBottomButton = (showScrollDownBtn) => {
        return showScrollDownBtn
            ? <div class="scroll-to-bottom-alert" onClick={this.scrollBack}>Tin nhắn mới</div>
            : '';
    };

    onHandleSendMail = (toggle) => {
        this.setState({
            sentMailOpen: toggle !== 0,
            personChatPopup: false
        })
    };
    onHandleNavigationClick = (e) => {
        e.preventDefault();
        this.setState({
            toggleChatTabOpen: !this.state.toggleChatTabOpen
        })
    }
    checkSent = (data) => {
        if (data === 'sent') {
            this.setState({
                data: 'sent'
            })
        }
        setTimeout(() => {
            this.setState({
                data: 'noSent'
            })
        })
    };


    onHandleChatTabs = (chatRooms, toggleChatTabOpen) => {
        let newRoom = chatRooms;
        const params = {
            slidesPerView: 3,
            spaceBetween: 0,
            rebuildOnUpdate: false,
        };


        return (
            <React.Fragment>
                <div className="chat-tabs" style={{
                    justifyContent: 'flex-start',
                    marginLeft: newRoom.length > 3 ? '1.5%' : '5.5%',
                    marginRight: newRoom.length > 3 ? '4%' : '0%'
                }}>
                    {newRoom.length > 3 ? <ChevronLeftIcon onClick={this.goPrev}/> : ''}
                    {newRoom.length > 3
                        ?
                        <Swiper {...params} ref={node => {
                            if (node) this.swiper = node.swiper
                        }}>
                            {this.onRenderDropdownChatRoom(newRoom, toggleChatTabOpen)}
                        </Swiper>
                        // <React.Fragment>
                        //     {this.onRenderDropdownChatRoom(newRoom, toggleChatTabOpen)}
                        // </React.Fragment>
                        :
                        <React.Fragment>
                            {this.onRenderDropdownChatRoom(newRoom, toggleChatTabOpen)}
                        </React.Fragment>

                    }
                    {newRoom.length > 3 ? <ChevronRightIcon onClick={this.goNext}/> : ''}
                </div>
            </React.Fragment>
        );
    };

    handleShowSendMailPopup = () => {
        this.setState({
            sendMailModal: true,
            personChatPopup: false
        });
    };

    handleHideSendMailPopup = () => {
        this.setState({
            sendMailModal: false,
        });
    };


    filterBlockMessages = (messages, userName) => {
        if (typeof messages === 'undefined')
            return [];
        else
            return messages.filter(m => !m.noDisplayUsers.includes(userName));
    }

    isBlock = (userName, blockFriendList, personChatName) => {
        if (typeof userName === 'undefined' || typeof blockFriendList === 'undefined' || typeof personChatName === 'undefined') return false;
        let isBlocked = blockFriendList.findIndex(f => personChatName === f.friend.name) !== -1 ? true : false;

        return isBlocked;
    }


    renderPersonToggleButtons = () => {
        const {addFriendStatusBtn, blockFriendStatusBtn, sentMailOpen, y, x, personChatName} = this.state;
        const {user, users} = this.props;
        const isBlocked = this.isBlock(user.userName, users.blockFriendList, personChatName);
        return (
            <div className='chat-actions-group-2'
                 style={{top: (window.innerHeight - y < 102 ? y - 60 : y - 10) + 'px', left: (x - 10) + 'px'}}
                 onMouseLeave={() => this.onHandlePersonChatLeave()}>
                {
                    isBlocked
                        ?
                        <Fragment>
                            <div className="chanban" onClick={(e) => this.onHandleUnBlockFriend(e)}>해제</div>
                        </Fragment>
                        :
                        <Fragment>
                            <div onClick={(e) => this.onHandlePersonChatToggle(e)}>귓속말</div>
                            <div onClick={() => this.handleShowSendMailPopup()}>편지 보내기</div>
                            <div style={{display: !addFriendStatusBtn ? 'none' : 'block'}}
                                 onClick={(e) => this.onHandleAddFriend(e)}>친구 추가
                            </div>
                            {blockFriendStatusBtn && <div onClick={(e) => this.onHandleBlockFriend(e)}>친구 차단</div>}
                        </Fragment>

                }


            </div>
        );
    }

    isBlockRoom = (userName, blockFriendList, currentRoom, beBlockUsers) => {


        if (typeof blockFriendList === 'undefined') return false;
        let isBlocked = blockFriendList.find(f => currentRoom.includes(f.friend.name));

        return typeof isBlocked === 'undefined' ? false : true;

    }

    //
    render() {
        const {loadMoreCount, toggle, dropDown, personChatPopup, chatRooms, addFriendStatusBtn, personChatName, blockFriendStatusBtn, sentMailOpen, y} = this.state;
        const {messages, user, notifications, currentRoom, recentlyChatUser, infoStatusByUsername, users, beBlockUsers} = this.props;
        const {toggleChatTabOpen} = this.state;
        const filterMessages = this.filterBlockMessages(messages, user.userName);
        const isBlockRoom = this.isBlockRoom(user.userName, users.blockFriendList, currentRoom, beBlockUsers);

        return (
            <Fragment>
                <button className='chat-toggle-btn'
                        onClick={(e) => this.onHandleClick(e)}>
                    <img src={loadingImage('/images/game-ui/chat-icon.svg')}/>
                </button>
                <div className="chatting-box-ui" ref="elem" style={{display: toggle ? 'block' : 'none'}}>
                    <div className='title-container'>
                        {this.onHandleChatTabs(chatRooms, toggleChatTabOpen)}
                        <div className='close-container'>
                            <div className='chatting-close' onClick={(e) => this.onHandleClick(e)}>
                                <span className='lnr lnr-cross'/>
                            </div>
                        </div>
                    </div>
                    <div className='chatting-contents' id="chatting-contents" ref="elementToFire"
                         onWheel={this.onMouseScroll}>
                        <MessageList
                            blockFriendList={users.blockFriendList}
                            data={this.state.data}
                            scrollBack={this.scrollBack}
                            messages={filterMessages}
                            loading={this.props.loading}
                            user={user}
                            n={this.props.n}
                            currentRoom={currentRoom}
                            onLoadMoreMessage={this.props.onLoadMoreMessage}
                            loadMoreCount={loadMoreCount}
                            sendKey={this.state.sendKey}
                            onHandlePersonalChatMouseOver={this.onHandlePersonalChatMouseOver}
                            onLeaveRoom={this.onLeaveRoom}
                            onHandlePersonChatToggle={this.onHandlePersonChatToggle}
                            onGetLastMessageOffset={this.onGetLastMessageOffset}
                            isGettingTopMessageOffset={this.state.isGettingTopMessageOffset}
                        />
                        <div style={{float: "left", clear: "both"}}
                             ref={(el) => {
                                 this.messagesEnd = el;
                             }}>
                        </div>
                    </div>
                    <div className="chatting-control">
                        {!isBlockRoom
                            ?
                            <Controls
                                blockFriendList={users.blockFriendList}
                                scrollBack={this.scrollBack}
                                checkSent={(data) => this.checkSent(data)}
                                dropDown={dropDown}
                                currentRoom={currentRoom}
                                chatRooms={chatRooms}
                                user={user}
                                recentlyChatUser={recentlyChatUser}
                                notifications={notifications}
                                onHandleDropDownClick={this.onHandleDropDownClick}
                                onHandleItemClick={this.onHandleItemClick}
                                onSendMessage={this.props.onSendMessage}
                            />
                            :
                            <div className="csschudo">차단된 상대와는 대화할 수 없습니다</div>
                        }


                    </div>
                    {
                        personChatPopup ? this.renderPersonToggleButtons() : null
                    }
                </div>

                {infoStatusByUsername && this.state.sendMailModal &&
                <SendMailPopup friendList={null} sendMailModal={this.state.sendMailModal}
                               toId={infoStatusByUsername.friendId}
                               toName={infoStatusByUsername.friendName}
                               handleShowSendMailPopup={this.handleShowSendMailPopup}
                               handleHideSendMailPopup={this.handleHideSendMailPopup}
                />}
            </Fragment>
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.authentication.user,
    users: state.users,
    messages: state.chatRooms.messages,
    currentRoom: state.chatRooms.currentRoom,
    recentlyChatUser: state.chatRooms.recentlyChatUser,
    infoStatusByUsername: state.users.infoStatusByUsername,
    loading: state.chatRooms.loading,
    n: state.chatRooms.n,
    notifications: state.chatRooms.notifications
});
const mapDispatchToProps = (dispatch) => ({
    addFriend: (userId, friendList) => dispatch(userActions.addFriend({
        userId: userId,
        friendList: friendList
    })),
    blockFriend: (userId, blockList) => dispatch(userActions.blockFriend({
        userId: userId,
        blockList: blockList
    })),
    checkStatusByUserName: (param) => dispatch(userActions.checkStatusByUserName(param)),
    onJoinRoom: (roomName, user) => dispatch(chatActions.joinRoomRequest(roomName, user)),
    onLeaveRoom: (roomName) => dispatch(chatActions.leaveRoomRequest(roomName)),
    onAddRecentlyChatUser: (user) => dispatch(chatActions.addRecentlyChatUser(user)),
    onSendMessage: (message) => dispatch(socketActions.sendMessage(message)),
    onLoadMoreMessage: (currentRoom, n, topMessIndex) => dispatch(chatActions.loadMore(currentRoom, n, topMessIndex)),
    onGetFriendListBlockList: (param) => dispatch(userActions.getFriendListBlockList(param)),
    onGetBeBlockUser: (param) => dispatch(userActions.getBeBlockedUser(param)),
    onClearNotifications: (param) => dispatch(chatActions.clearNotifications(param)),
    onUnBlockFriend: (param) => dispatch(userActions.unBlockFriend(param))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatBoxNewUI)
