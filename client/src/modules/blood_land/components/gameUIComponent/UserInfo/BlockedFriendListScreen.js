import React, {Fragment, Component} from 'react';
import classnames from 'classnames';
import connect from "react-redux/es/connect/connect";
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import Tooltip from "../../general/Tooltip";
import MessageBox from './../../general/MessageBox';

class BlockedFriendListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            currentScreen: this.screen.list,
            currentPopupScreen: this.popupScreen.noPopup,
            checkAll: false,
            count: 1
        };
    }

    screen = {
        list: 'list',
        detail: 'detail'
    };

    loadData() {
        const {user: {_id}} = this.props;
        this.props.getFriendListBlockList(_id);
    }

    componentWillMount() {
        this.loadData();
    }
    
    componentDidUpdate(prevProps){

        const {blockFriendList,unBlockStatus} = this.props;
        if(blockFriendList !== prevProps.blockFriendList){
            this.setState({friendList: blockFriendList , checkAll: false});
        }
        if(unBlockStatus !== prevProps.unBlockStatus){
            if(typeof unBlockStatus !== "undefined"){
                if(unBlockStatus){
                    this.handleShowPopup(this.popupScreen.unblockSuccess);
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

    handleShowPopup = (popupScreen) => {
        this.setState({
            currentPopupScreen: popupScreen,
            modal: true,
        });
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            modal: false
        });
    };

    doCheckAllAndUpdateLists = () => {
        let {friendList, checkAll} = this.state;

        friendList = friendList.map((f, i) => {
            f.checked = !checkAll
            return f;
        });

        this.setState({
            friendList: friendList,
            checkAll: !checkAll
        });
    };

    doCheckAndUpdateLists = (item) => {
        let {friendList} = this.state;

        friendList = friendList.map(f => {
            if (item === f.friend.userId){
                f.checked = !f.checked;
            }
            return f;
        });

        this.setState({
            friendList: friendList,
            checkAll: friendList.filter(i=>i.checked).length === this.state.friendList.length
        });
    };

    getDefaultScreen = () => {
        return (
            <Fragment>
                <div className='screen-title'>
                    <img src={loadingImage('/images/game-ui/tab1/nav3-2.svg')} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.user.friend.blockList.getDefaultScreen.title'}/>
                    </div>
                </div>
                {this.screen.list === this.state.currentScreen ? this.getBlockList() : ''}
            </Fragment>
        );
    };
    
    render() {
        const defaultScreen = this.getDefaultScreen();
        const modalPopup = this.getModalPopup();
        return (
            <Fragment>
                {defaultScreen}
                {modalPopup}
            </Fragment>
        );
    }

    getNoInfoView = () => {
        return (
            <Fragment>
                <div className='friend-warning-screen'>
                    <div className='warning'><div className="lnr lnr-warning lnr-custom-close"/>
                        <TranslateLanguage direct={'menuTab.user.friend.blockList.getNoInfoView.noInformation'}/>
                    </div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.friend.blockList.getNoInfoView.backBtn'}/>
                        </div>
                        <Tooltip descLang={'menuTab.user.friend.tooltip.backButton'}/>
                    </button>
                </div>
            </Fragment>
        );
    };

    loading = () =>{
        return (
            <div className='friend-warning-screen'>
                <div className="lds-roller">
                    <div/><div/><div/><div/><div/><div/><div/><div/>
                </div>
            </div>
        );
    }

    checkBeforeUnblockConfirm = () =>{
        const {friendList} = this.state;
        const checkStatus = friendList && friendList.some(f => f.checked );
        console.log('checkStatus',checkStatus)
        if(!checkStatus) {
            return this.handleShowPopup(this.popupScreen.noSelection);
        }
        this.handleShowPopup(this.popupScreen.unblockConfirm);
    }

    renderBlockList = () =>{
        const {friendList, checkAll} = this.state;
        const checkAllClass = classnames({
            'mail-item-checkbox': true,
            'checked': checkAll
        });
        return (
            <Fragment>
                <div className='friend-ui-screen'>
                    <ul className='friend-list'>
                        <li className='mail-item-check-all'>
                            <div className={checkAllClass} onClick={() => this.doCheckAllAndUpdateLists()}/>
                            <div className='mail-item-title'>
                                <TranslateLanguage direct={'menuTab.user.friend.blockList.getBlockList.selectAll'}/>
                            </div>
                        </li>
                        {friendList && friendList.map(({checked, friend: {userId, name}}) => {
                            const checkItemClass = classnames({
                                'mail-item-checkbox': true,
                                'checked': checked
                            });
                            return <li key={userId} onClick={() => this.doCheckAndUpdateLists(userId)}>
                                        <div className={checkItemClass} />
                                        <div className='mail-item'>
                                            <div className='mail-item-user'>{name}</div>
                                        </div>
                                    </li>
                        })
                        }
                    </ul>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.friend.blockList.getBlockList.backBtn'}/>
                        </div>
                        <Tooltip descLang={'menuTab.user.friend.tooltip.backButton'}/>
                    </button>
                    <button onClick={() => this.checkBeforeUnblockConfirm()}>
                        <img src='/images/bloodland-ui/btn-unblockfriend.png' alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.friend.blockList.getBlockList.unBlockBtn'}/>
                        </div>
                        <Tooltip descLang={'menuTab.user.friend.tooltip.unBlockButton'}/>
                    </button>
                </div>
            </Fragment> 
        )
    }
    
    getBlockList = () => {
        const { friendList } = this.state;
        return friendList ? friendList.length === 0 ? this.getNoInfoView() : this.renderBlockList() :this.loading();
    };

    popupScreen = {
        noPopup: "noPopup",
        unblockSuccess: "unblockSuccess",
        unblockConfirm: "unblockConfirm",
        noSelection: "noSelection",
    };

    getModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.unblockConfirm === this.state.currentPopupScreen && this.getUnBlockConfirmAlertPopup()}
                {this.popupScreen.unblockSuccess === this.state.currentPopupScreen && this.getUnBlockSuccessAlertPopup()}
                {this.popupScreen.noSelection    === this.state.currentPopupScreen && this.getNoSelectionAlertPopup()}
            </Fragment>
        );
    };
    
    handleUnblockConfirm = () => {
        const {friendList} = this.state;
        const {user: {_id}} = this.props;
        let unblockFriends = [];
        friendList.map(f => {
            if (f.checked) {
                unblockFriends.push(f.friend);
            }
            return null;
        });
        this.props.unBlockFriend(_id, unblockFriends);
        this.handleHidePopup();
    };

    getUnBlockConfirmAlertPopup = () => {
        const {modal} = this.state;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.handleUnblockConfirm();
        const noBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'menuTab.user.friend.blockList.alert.getUnBlockConfirmAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.user.friend.blockList.alert.getUnBlockConfirmAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getUnBlockSuccessAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => {
            this.props.resetStatus();
            this.handleHidePopup()
        };
        const header = <TranslateLanguage direct={'menuTab.user.friend.blockList.alert.getUnBlockSuccessAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.user.friend.blockList.alert.getUnBlockSuccessAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    }

    getNoSelectionAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseUnSuccessAlertPopup.header'}/>;;
        const body = <TranslateLanguage direct={'menuTab.user.friend.blockList.getBlockList.unBlockUserUnselectedAlertContent'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    }
}

function mapStateToProps(state) {
    const {authentication: {user}} = state;
    const {blockFriendList,unBlockStatus} = state.users;
    return {
        user,
        blockFriendList,unBlockStatus
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        unBlockFriend: (userId, unblockFriends) => dispatch(userActions.unBlockFriend({userId,unblockFriends})),
        getFriendListBlockList: (userId) => dispatch(userActions.getFriendListBlockList({userId})),
        resetStatus : () => dispatch(userActions.resetStatus())
    };
};

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(BlockedFriendListScreen);
export default connectedPage;
