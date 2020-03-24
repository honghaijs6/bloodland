import React, { Fragment, PureComponent } from 'react';
import Message from './Message';
export default class MessageList extends PureComponent {
    state = {
        currentMessage: -1
    };
    onHandlePersonalChatMouseOver = (data) => {
        this.props.onHandlePersonalChatMouseOver(data);
    };

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.loadMoreCount !== this.props.loadMoreCount && !this.props.loading) {
    //         this.props.onLoadMoreMessage(nextProps.currentRoom, nextProps.loadMoreCount);
    //     }
    // }

    isBlock = (userName, blockFriendList, currentRoom) => {
        if (typeof blockFriendList === 'undefined') return false;
        let isBlocked = blockFriendList.findIndex(f => currentRoom.includes(f.friend.name)) !== -1 ? true : false;
        isBlocked = isBlocked && currentRoom.includes(userName);
        if (isBlocked) {
            return true;
        } else {
            return false;
        }
    }

    onGetLastMessageOffset = (offset) => {
        this.props.onGetLastMessageOffset(offset);
    };

    changeCurrentMessage = (key) => {
        this.setState({ currentMessage: key })
    };

    onRenderMessage = (messages) => {
        const { blockFriendList, user, currentRoom } = this.props;
        const disabledInputChat = this.isBlock(user.userName, blockFriendList, currentRoom);
        return !disabledInputChat && messages ? messages.map((m, index) => {
            return (
                <Message
                    message={m}
                    isGettingTopMessageOffset = {this.props.isGettingTopMessageOffset}
                    onHandlePersonChatToggle={this.props.onHandlePersonChatToggle}
                    key={index}
                    ms={index}
                    onGetLastMessageOffset = {this.onGetLastMessageOffset}
                    sendKey={this.props.sendKey}
                    onHandlePersonalChatMouseOver={(data) => this.onHandlePersonalChatMouseOver(data)}
                    userName={user.userName}
                    currentMessage={this.state.currentMessage}
                    changeCurrentMessage={this.changeCurrentMessage}
                    n = { this.props.n}
                />
            )
        }) : null;
    };

    render() {
        const { messages } = this.props;
        return (<Fragment>
            {this.onRenderMessage(messages)}
        </Fragment>)
    }
}