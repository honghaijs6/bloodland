import React, {Fragment, Component} from 'react';
import classnames from 'classnames';
import connect from "react-redux/es/connect/connect";
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import SendMailPopup from '../Common/SendMailPopup';
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import Tooltip from "../../general/Tooltip";
import MessageBox from './../../general/MessageBox';

class FriendListScreen extends Component {
    constructor() {
        super();
        this.state = {
            modal: false,
            currentScreen: this.screen.list,
            currentPopupScreen: this.popupScreen.noPopup,
            success: true,
            userInfo: null,
            checkAll: false,
            mailReceiver: null,
            count: 1,
            sendMailModal: false,
        };
    }

    screen = {
        list: 'list',
        detail: 'detail'
    };

    componentWillMount() {
        const {user: {_id}} = this.props;
        this.props.getFriendListBlockList(_id);
    }
    
    componentDidUpdate(prevProps){

        const {friendList,unFriendStatus,
            blockStatus} = this.props;
        if(friendList !== prevProps.friendList){
            this.setState({friendList , checkAll: false});
        }
        if(unFriendStatus !== prevProps.unFriendStatus){
            if(typeof unFriendStatus !== "undefined"){
                if(unFriendStatus){
                    this.handleShowPopup(this.popupScreen.deleteSuccess);
                }
                else{

                }
            }
        }
        if(blockStatus !== prevProps.blockStatus){
            if(typeof blockStatus !== "undefined"){
                if(blockStatus){
                    this.handleShowPopup(this.popupScreen.blockSuccess);
                }
                else{

                }
            }
        }
    }

    handleChangeScreen = (screen) => {
        this.setState({
            currentScreen: screen
        });
    };

    handleShowPopup = (screen) => {
        this.setState({
            currentPopupScreen: screen,
            modal: true
        });
    };


    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            modal: false
        });
    };


    handleShowSendMailPopup = () => {
        this.setState({
            sendMailModal: true,
        });
    };

    handleHideSendMailPopup = () => {
        this.setState({
            sendMailModal: false,
        });
    };

    doCheckAllAndUpdateLists = () => {
        let {friendList, checkAll} = this.state;

        if (checkAll) {

            let updateFriendList = friendList.map(f => {
                f.checked = false;
                return f;
            });
            this.setState({
                friendList: updateFriendList,
                checkAll: false
            });
        } else {
            let updateFriendList = friendList.map(f => {
                f.checked = true;
                return f;
            });
            this.setState({
                friendList: updateFriendList,
                checkAll: true
            });
        }


    };

    doCheckAndUpdateLists = (e, item) => {
        e.preventDefault();
        let {friendList} = this.state;
        friendList = friendList.map(array => {
            if (array.friend.userId === item) {
                array.checked = !array.checked
            }
            if (!array.checked) {
                this.setState({
                    checkAll: false
                })
            }
            return array;
        });

        if (friendList.filter(f => f.checked).length === friendList.length) {
            this.setState({checkAll: true});
        }


        this.setState({
            friendList,
            checkAll: friendList.filter(i=>i.checked).length === this.state.friendList.length
        });

    };


    getNoInfoView = () => {
        return (
            <Fragment>
                <div className='friend-warning-screen'>
                    <div className='warning'><div className="lnr lnr-warning lnr-custom-close"/>
                        <TranslateLanguage direct={'menuTab.user.friend.friendList.getNoInfoView.noInformation'}/>
                    </div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.friend.friendList.getNoInfoView.backBtn'}/>
                        </div>
                        <Tooltip descLang={'menuTab.user.friend.tooltip.backButton'}/>
                    </button>
                </div>
            </Fragment>
        );
    };

    getDefaultScreen = () => {
        return (
            <Fragment>
                <div className='screen-title'>
                    <img src={loadingImage('/images/game-ui/tab1/nav3-1.svg')} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.user.friend.friendList.getDefaultScreen.title'}/>
                    </div>
                </div>
                {this.getListFriend()}
            </Fragment>
        );
    };


    deleteUsers = () =>{
        const {friendList} = this.state;
        const checkStatus = friendList && friendList.some(({checked}) => checked);
        if(checkStatus){
            this.setState({
                noSelectionAlertBody: <TranslateLanguage direct={'menuTab.user.friend.friendList.getListFriend.deleteUserUnselectedAlertContent'}/>
            });
            this.handleShowPopup(this.popupScreen.deleteConfirm);
        }
        else{
            this.handleShowPopup(this.popupScreen.noSelection);
        }
    }

    blockUsers = () =>{
        const {friendList} = this.state;
        const checkStatus = friendList && friendList.some(({checked}) => checked);
        if(checkStatus){
            this.setState({
                noSelectionAlertBody: <TranslateLanguage direct={'menuTab.user.friend.friendList.getListFriend.blockUserUnselectedAlertContent'}/>
            });
            this.handleShowPopup(this.popupScreen.blockConfirm);
        }
        else{
            this.handleShowPopup(this.popupScreen.noSelection);
        }
    }
    mailUsers = () =>{
        const {friendList} = this.state;
        const checkStatus = friendList && friendList.some(({checked}) => checked);
        if(checkStatus){
            this.setState({
                noSelectionAlertBody: <TranslateLanguage direct={'menuTab.user.friend.friendList.getListFriend.sendMailUnselectedAlertContent'}/>
            });
            this.handleShowSendMailPopup();
        }
        else{
            this.handleShowPopup(this.popupScreen.noSelection);
        }
    }

    getLoadingView = () =>{
        return <div className='friend-warning-screen'>
                    <div className="lds-roller">
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                    </div>
                </div>
    }

    renderFriends = () =>{
        const {friendList, checkAll} = this.state;
        const checkAllClass = classnames({
            'mail-item-checkbox': true,
            'checked': checkAll
        });
        return (
            <Fragment>
                    <div className='friend-ui-screen'>
                        <ul className='friend-list'>
                            <li className='mail-item-check-all' onClick={(e) => this.doCheckAllAndUpdateLists(e)}>
                                <div className={checkAllClass}></div>
                                <div className='mail-item-title'>
                                    <TranslateLanguage direct={'menuTab.user.friend.friendList.getListFriend.selectAll'}/>
                                </div>
                            </li>
                            {friendList && friendList.map(({checked, friend: {name, userId}}) => {
                                const checkItemClass = classnames({
                                    'mail-item-checkbox': true,
                                    'checked': checked
                                });
                                return <li key={userId} onClick={(e) => this.doCheckAndUpdateLists(e, userId)}>
                                            <div className={checkItemClass} />
                                            <div className='mail-item'>
                                                <div className='mail-item-user'>{name}</div>
                                            </div>
                                        </li>
                            })}

                        </ul>
                    </div>
                    <div className='action-group'>
                        <button onClick={() => this.props.handleChangeScreen('default')}>
                            <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                            <div>
                                <TranslateLanguage direct={'menuTab.user.friend.friendList.getListFriend.backBtn'}/>
                            </div>
                            <Tooltip descLang={'menuTab.user.friend.tooltip.backButton'}/>
                        </button>
                        <button onClick={() => this.deleteUsers()}>
                            <img src={loadingImage(`/images/game-ui/sm-recycle.svg`)} alt=''/>
                            <div>
                                <TranslateLanguage direct={'menuTab.user.friend.friendList.getListFriend.deleteBtn'}/>
                            </div>
                            <Tooltip descLang={'menuTab.user.friend.tooltip.deleteButton'}/>
                        </button>
                        <button onClick={() => this.blockUsers()}>
                            <img src='/images/bloodland-ui/btn-blockfriend.png' alt=''/>
                            <div>
                                <TranslateLanguage direct={'menuTab.user.friend.friendList.getListFriend.blockBtn'}/>
                            </div>
                            <Tooltip descLang={'menuTab.user.friend.tooltip.blockButton'}/>
                        </button>
                        <button onClick={() => this.mailUsers()}>
                            <img src='/images/bloodland-ui/mail-read-icon.png' alt=''/>
                            <div>
                                <TranslateLanguage direct={'menuTab.user.friend.friendList.getListFriend.mailBtn'}/>
                            </div>
                            <Tooltip descLang={'menuTab.user.friend.tooltip.mailButton'}/>
                        </button>
                    </div>
                </Fragment>
        )
    }

    getListFriend = () => {
        const {friendList} = this.state;
        return friendList ? friendList.length === 0 ? this.getNoInfoView() : this.renderFriends() : this.getLoadingView();
    };

    popupScreen = {
        noPopup: "noPopup",
        reply: "reply",
        deleteSuccess: "deleteSuccess",
        blockSuccess: "blockSuccess",
        deleteConfirm: "deleteConfirm",
        blockConfirm: "blockConfirm",
        noSelection:"noSelection"
    };

    getModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.deleteConfirm === this.state.currentPopupScreen  && this.getDeleteConfirmAlertPopup()}
                {this.popupScreen.deleteSuccess === this.state.currentPopupScreen  && this.getDeleteSuccessAlertPopup()}
                {this.popupScreen.blockConfirm  === this.state.currentPopupScreen  && this.getBlockConfirmAlertPopup()}
                {this.popupScreen.blockSuccess  === this.state.currentPopupScreen  && this.getBlockSuccessAlertPopup()}
                {this.popupScreen.noSelection   === this.state.currentPopupScreen  && this.getNoSelectionAlertPopup()}
            </Fragment>
        );
    };

    handleUnfriend = () => {
        let {friendList} = this.state;
        const {user: {_id}} = this.props;
        friendList = friendList.filter(f => f.checked === true).map(({friend}) => {
            return {"userId": friend.userId, "name": friend.name}
        });
        this.props.unFriend({userId: _id, friendList});
        this.handleHidePopup()
    };

    handleBlockfriend = () => {
        let {friendList} = this.state;
        const {user: {_id}} = this.props;
        const blockList = friendList.filter(f => f.checked === true).map(({friend}) => {
            return {"userId": friend.userId, "name": friend.name}
        });
        this.props.blockFriend({userId: _id, blockList});
        this.handleHidePopup()
    };

    getNoSelectionAlertPopup = () => {
        const {modal,noSelectionAlertBody} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseUnSuccessAlertPopup.header'}/>;
        const body = noSelectionAlertBody;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getDeleteConfirmAlertPopup = () => {
        const {modal} = this.state;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.handleUnfriend();
        const noBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getDeleteConfirmAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getDeleteConfirmAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getDeleteSuccessAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => {
            this.props.resetStatus();
            this.handleHidePopup();
        };
        const header = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getDeleteSuccessAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getDeleteSuccessAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getBlockConfirmAlertPopup = () => {
        const {modal} = this.state;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.handleBlockfriend();
        const noBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getBlockConfirmAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getBlockConfirmAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getBlockSuccessAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => {
            this.props.resetStatus();
            this.handleHidePopup()
        };
        const header = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getBlockSuccessAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getBlockSuccessAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getSendMailPopup = () => {
        const {sendMailModal,userInfo,friendList} = this.state;
        return sendMailModal && <SendMailPopup  label='friendlist' 
                                                sendMailModal={sendMailModal}
                                                toId={userInfo ? userInfo.userId : null}
                                                toName={userInfo ? userInfo.name : null}
                                                handleShowSendMailPopup={this.handleShowSendMailPopup}
                                                handleHideSendMailPopup={this.handleHideSendMailPopup}
                                                friendList={friendList}
                                            />;
    };

    render(){
        const defaultScreen = this.getDefaultScreen();
        const modalPopup = this.getModalPopup();
        const sendMailPopup = this.getSendMailPopup();
        return (
            <Fragment>
                {defaultScreen}
                {modalPopup}
                {sendMailPopup}
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    const {authentication: {user}} = state;
    const {friendList,unFriendStatus,blockStatus} = state.users;
    return {
        user,
        friendList,
        unFriendStatus,
        blockStatus
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        blockFriend: (param) => dispatch(userActions.blockFriend(param)),
        unFriend: (param) => dispatch(userActions.unFriend(param)),
        getFriendListBlockList: (userId) => dispatch(userActions.getFriendListBlockList({userId})),
        resetStatus : () => dispatch(userActions.resetStatus())
    };
};

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(FriendListScreen);
export default connectedPage;