import React, { PureComponent } from 'react';
import Scrollbar from 'react-smooth-scrollbar';
import { connect } from 'react-redux';
import { userActions } from './../../../store/actions/userActions'
class ChatContactList extends PureComponent {
    componentDidMount = () => {
        this.props.onGetAllUsers();
    };
    onOpenContacts = () => {
        this.props.onOpenContacts();
    };

    render() {
        return (
            <div className='chat__contacts'>
                <Scrollbar className='scroll chat__contacts-scroll' alwaysShowTracks>
                <h1>test</h1>
                </Scrollbar>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onGetAllUsers : () => {
            dispatch(userActions.getAll());
        }
    }
};

const mapStateToProps = (state) => {
    return {
        users:state.users.user
    }
};

const connectedChatContactList = connect(mapStateToProps, mapDispatchToProps)(ChatContactList);
export default connectedChatContactList;
