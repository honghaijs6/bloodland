import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import MessageBox from './../../general/MessageBox';


class FriendSearch extends Component {
    constructor() {
        super();
        this.state = {
            modal: false,
            img: this.addFriendBtn,
            searchText: '',
            modalAlertPopup: false,
            currentAlertPopUp: this.alertPopupScreen.noPopup,
        };
    }

    componentWillReceiveProps(nextProps) {
        const {foundFriends} = nextProps;
        this.setState({foundFriends})
    }

    alertPopupScreen = {
        noPopup: 20,
        addFriendAlert: 24,
        addFriendSuccessAlert: 25,
        addFriendFailureAlert: 26,
    };

    handleShowAlertPopup = (screen) => {
        this.setState({
            currentAlertPopUp: screen,
            modalAlertPopup: true,
        });
    };

    handleHideAlertPopup = () => {
        this.setState({
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            modalAlertPopup: false,
        });
    };

    addFriend = (foundFriends) => {
        this.setState({userInfo: {userName: foundFriends[0].userName, id: foundFriends[0]._id}});
        this.handleShowAlertPopup(this.alertPopupScreen.addFriendAlert);
    }


    addFriendBtn = loadingImage('/images/game-ui/add-btn.svg');
    addFriendHoverBtn = loadingImage('/images/game-ui/add-btn-hover.svg');

    onHandleCheckFriend = () => {
        this.setState({
            checkFriendAlert: true
        });
        this.props.findFriend({userName: this.state.searchText, currentUserId: this.props.user._id});
    };
    onHandleKeyPress = (e) => {
        if(e.keyCode === 13){
            this.onHandleCheckFriend()
        }
    }
    getDefaultScreen() {
        const {foundFriends,checkFriendAlert} = this.state;
        return (
            <div className='add-friend-dropdown' >
                <input value={this.state.searchText} onKeyDown={(e) => this.onHandleKeyPress(e)}
                       onChange={(e) => this.setState({searchText: e.target.value, checkFriendAlert: false})}/>
                <button className='search-friend-btn' onClick={() => this.onHandleCheckFriend()} >
                    <TranslateLanguage direct={'menuTab.user.friend.friendSearch.getDefaultScreen.title'}/>
                </button>
                <div className='exist-friend'>
                    {
                        typeof foundFriends !== 'undefined' && checkFriendAlert && (foundFriends.status === 'empty' || foundFriends.status === 'self') && 
                        //!this.props.resetChat &&
                        <div className='friend-item'>
                            <div className='friend-alert'>
                                <TranslateLanguage direct={'menuTab.user.friend.friendSearch.getDefaultScreen.notFound'}/>
                            </div>
                        </div>
                    }
                    {
                        typeof foundFriends !== 'undefined' && checkFriendAlert && foundFriends.status === 'block' && 
                        //!this.props.resetChat &&
                        <div className='friend-item'>
                            <div className='friend-alert'>
                                <TranslateLanguage direct={'menuTab.user.friend.friendSearch.getDefaultScreen.blocked'}/>
                            </div>
                        </div>
                    }
                    {
                        typeof foundFriends !== 'undefined' && checkFriendAlert && foundFriends.status === 'friend' && 
                        //!this.props.resetChat &&
                        <div className='friend-item'>
                            <div className='friend-alert'>
                                <TranslateLanguage direct={'menuTab.user.friend.friendSearch.getDefaultScreen.foundFriends'}/>
                            </div>
                        </div>
                    }
                    {
                        typeof foundFriends !== 'undefined' && foundFriends.foundUser.length > 0 && foundFriends.status === 'normal' &&
                        //&& !this.props.resetChat &&
                        <div className='friend-item'>
                            <div className='friend-name'>{foundFriends.foundUser[0].userName}
                            </div>
                            <div className='add-friend-btn' onClick={() => this.addFriend(foundFriends.foundUser)}
                                 onMouseEnter={() => this.setState({img: this.addFriendHoverBtn})}
                                 onMouseOver={() => this.setState({img: this.addFriendHoverBtn})}
                                 onMouseOut={() => this.setState({img: this.addFriendBtn})}
                                 onMouseLeave={() => this.setState({img: this.addFriendBtn})}
                            >
                                <img src={this.state.img} alt=''/>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }


    render() {
        const alertPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {this.getDefaultScreen()}
                {alertPopup}
            </Fragment>
        );
    }


    handleAddFriend = () => {
        const {userInfo: {userName, id}} = this.state;
        const {user: {_id}} = this.props;
        if (id === _id) {
            this.handleShowAlertPopup(this.alertPopupScreen.addFriendFailureAlert);
        } else {
            this.props.addFriend(_id, [{'userId': id, 'name': userName}]);
            this.handleShowAlertPopup(this.alertPopupScreen.addFriendSuccessAlert);
        }
        // this.handleHideAlertPopup();
        this.props.findFriend({userName: this.state.searchText, currentUserId: this.props.user._id});
    };

    getAlertModalPopup = () => {
        return (
            <Fragment>
                {this.alertPopupScreen.addFriendAlert === this.state.currentAlertPopUp && this.getAddFriendAlertAlertPopup()}
                {this.alertPopupScreen.addFriendSuccessAlert === this.state.currentAlertPopUp && this.getAddFriendSuccessAlertPopup()}
                {this.alertPopupScreen.addFriendFailureAlert === this.state.currentAlertPopUp && this.getAddFriendFailureAlertPopup()}
            </Fragment>
        );
    };

    handleHideAlertAndReload(){
        this.handleHideAlertPopup();
        this.onHandleCheckFriend();
    }
    
    getAddFriendAlertAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.handleAddFriend();
        const noBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'menuTab.user.friend.friendSearch.alert.getAddFriendAlertAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.user.friend.friendSearch.alert.getAddFriendAlertAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getAddFriendSuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertAndReload();
        const header = <TranslateLanguage direct={'menuTab.user.friend.friendSearch.alert.getAddFriendSuccessAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.user.friend.friendSearch.alert.getAddFriendSuccessAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    }

    getAddFriendFailureAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'menuTab.user.friend.friendSearch.alert.getAddFriendFailureAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.user.friend.friendSearch.alert.getAddFriendFailureAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    }
}

function mapStateToProps(state) {
    const {authentication: {user}, users: {foundFriends}} = state;
    return {
        user, foundFriends
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        addFriend: (userId, friendList) => dispatch(userActions.addFriend({userId, friendList})),
        findFriend: (param) => dispatch(userActions.findFriend(param)),
    };
};

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(FriendSearch);
export default connectedPage;
