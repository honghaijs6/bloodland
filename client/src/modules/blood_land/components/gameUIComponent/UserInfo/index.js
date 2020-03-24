import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import classNames from 'classnames';
import NoticeScreen from './NoticeScreen';
import SentMailBoxScreen from './SentMailBoxScreen';
import ReceivedMailBoxScreen from './ReceivedMailBoxScreen';
import FriendListScreen from './FriendListScreen';
import BlockedFriendListScreen from './BlockedFriendListScreen';
import ProfileScreen from './ProfileScreen';
import {notificationAction} from "../../../../../store/actions/commonActions/notifyActions";
import FriendSearch from './FriendSearch';
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent"
import Tooltip from './../../general/Tooltip';
import { LazyImage } from "react-lazy-images";
import { userActions } from '../../../../../helpers/importModule';
import IdentityCard from "../Common/IdentityCard";

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            currentScreen: this.screen.default,
            currentPopupScreen: this.popupScreen.noPopup,
            currentDropdownItem: this.dropdownValue.noDropdown,
            lastScreen: 0,
            alertStatus: false,
            toggle: false,
            level2Dropdown: false,
            alert: {
                title: '',
                content: '',
                functions: [],
            }
        };
    }

    componentDidMount = () => {
        // console.log('userinfo this.props.notice',this.props.notice);
        const {notice} = this.props;
        if(notice === 'pending'){
            this.handleChangeScreen(this.screen.info);
        }
    };

    screen = {
        default: 'default',
        info: 'info',
        receivedMail: 'receivedMail',
        sentMail: 'sentMail',
        friendlist: 'friendlist',
        blocklist: 'blocklist'
    };

    popupScreen = {
        noPopup: 'noPopup',
        landPrices: 'landPrices',
    }

    dropdownValue = {
        noDropdown: 'noDropdown',
        myMail: 'myMail',
        myFriend: 'myFriend',
        myProfile: 'myProfile',
    }

    handleChangeScreen = (screen) => {
        // console.log('screen',screen);
        this.setState({
            lastScreen: this.state.currentScreen,
            currentScreen: screen,
        });
    };

    handleDropdown = (item) => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            currentDropdownItem: item === this.state.currentDropdownItem ? this.dropdownValue.noDropdown : item,
        });
    };

    handleShowPopup = (popupScreen) => {
        this.setState({
            currentDropdownItem: this.dropdownValue.noDropdown,
            currentPopupScreen: popupScreen,
            modal: !this.state.modal,
        });
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            modal: false
        });
    };

    getActiveDropdownClass = (dropdown) => {
        let gameTabItemClass = classNames({
            'active': dropdown === this.state.currentDropdownItem
        });
        return gameTabItemClass;
    }

    getMyMailScreen = () => {
        const {user:{_id}} = this.props;
        return (
            <Fragment>
                <li className='menu-level-2' onClick={() => {
                    this.props.haveNewMails(_id);
                    this.handleChangeScreen(this.screen.receivedMail);
                }}>
                    <div><img src={loadingImage('/images/game-ui/tab1/nav2-1.svg')} alt=''/>
                        <TranslateLanguage direct={'menuTab.user.email.receive'}/>
                    </div>
                </li>
                <li className='menu-level-2' onClick={() => this.handleChangeScreen(this.screen.sentMail)}>
                    <div><img src={loadingImage('/images/game-ui/tab1/nav2-2.svg')} alt=''/>
                        <TranslateLanguage direct={'menuTab.user.email.sent'}/>
                    </div>
                </li>
                <li className='break-line'/>
            </Fragment>)
    }

    getMyFriendScreen = () => {
        return (
            <Fragment>
                <li className={`menu-level-2 ${this.state.level2Dropdown ? 'active' : ''}`}
                    onClick={() => this.setState({level2Dropdown: !this.state.level2Dropdown})}>
                    <div><img src={loadingImage('/images/game-ui/tab1/nav3-3.svg')} alt=''/>
                        <TranslateLanguage direct={'menuTab.user.friend.friendSearch'}/>
                    </div>
                </li>
                {
                    this.state.level2Dropdown &&
                    <li className='no-hover'><FriendSearch /></li>
                }
                <li className='menu-level-2' onClick={() => this.handleChangeScreen(this.screen.friendlist)}>
                    <div><img src={loadingImage('/images/game-ui/tab1/nav3-1.svg')} alt=''/>
                        <TranslateLanguage direct={'menuTab.user.friend.friendList'}/>
                    </div>
                </li>
                <li className='menu-level-2' onClick={() => this.handleChangeScreen(this.screen.blocklist)}>
                    <div><img src={loadingImage('/images/game-ui/tab1/nav3-2.svg')} alt=''/>
                        <TranslateLanguage direct={'menuTab.user.friend.blockList'}/>
                    </div>
                </li>
                <li className='break-line'/>
            </Fragment>)
    }

    getScreenByValue = (value) => {
        switch (value) {
            case this.screen.info:
                return <NoticeScreen handleChangeScreen={this.handleChangeScreen}/>;
            case this.screen.receivedMail:
                return <ReceivedMailBoxScreen handleChangeScreen={this.handleChangeScreen}/>;
            case this.screen.sentMail:
                return <SentMailBoxScreen handleChangeScreen={this.handleChangeScreen}/>;
            case this.screen.friendlist:
                return <FriendListScreen handleChangeScreen={this.handleChangeScreen}/>;
            case this.screen.blocklist:
                return <BlockedFriendListScreen handleChangeScreen={this.handleChangeScreen}/>;
            case this.dropdownValue.myProfile:
                return <ProfileScreen/>;
            default:
                return '';
        }
    }

    loadingImg = (ref) => {
        return (
            <div ref={ref} className="lds-ellipsis img-loading">
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
        )
    };

    getDefaultScreen = () => {
        const {newMails,user:{_id}} = this.props;
        return (
            <ul className='function-menu'>
                {/* {this.props.notice === 'open' || this.props.notice === 'pending' ? <LandmarkNotifyComponent status={statusNotice}/> : */}
                    <Fragment>
                        <IdentityCard/>
                        <li onClick={() => this.handleChangeScreen(this.screen.info)}>
                            <LazyImage src={loadingImage('/images/game-ui/tab1/nav1.svg')}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="notify" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.user.notify'}/>
                            </div>
                            <Tooltip nameLang={'menuTab.user.notify.tooltip.name'} descLang={'menuTab.user.notify.tooltip.desc'} />
                            {/* {notifies && notifiesCheck.length !== 0 ? <div className="alert-dot"/> : null} */}
                        </li>
                        <li className={this.getActiveDropdownClass(this.dropdownValue.myMail)}
                            onClick={() => {
                                this.props.haveNewMails(_id);
                                this.handleDropdown(this.dropdownValue.myMail)
                            }}>
                            {newMails && newMails.unreads > 0 && <div className='has-new'>NEW</div>}
                            <div className='expand-icon'/>
                            <LazyImage src={loadingImage('/images/game-ui/tab1/nav2.svg')}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps}  alt="email" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.user.email'}/>
                            </div>
                            <Tooltip nameLang={'menuTab.user.email.tooltip.name'} descLang={'menuTab.user.email.tooltip.desc'} />
                        </li>
                        {this.dropdownValue.myMail === this.state.currentDropdownItem && this.getMyMailScreen()}
                        <li className={this.getActiveDropdownClass(this.dropdownValue.myFriend)}
                            onClick={() => this.handleDropdown(this.dropdownValue.myFriend)}>
                            <div className='expand-icon'/>
                            <LazyImage src={loadingImage('/images/game-ui/tab1/nav3.svg')}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="friend" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.user.friend'}/>
                            </div>
                            <Tooltip nameLang={'menuTab.user.friend.tooltip.name'} descLang={'menuTab.user.friend.tooltip.desc'} />
                        </li>
                        {this.dropdownValue.myFriend === this.state.currentDropdownItem && this.getMyFriendScreen()}
                        <li className={this.getActiveDropdownClass(this.dropdownValue.myProfile)}
                            onClick={() => this.handleDropdown(this.dropdownValue.myProfile)}>
                            <div className='expand-icon'/>
                            <LazyImage src={loadingImage('/images/game-ui/tab1/nav5.svg')}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps}  alt="information" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.user.information'}/>
                            </div>
                            <Tooltip nameLang={'menuTab.user.information.tooltip.name'} descLang={'menuTab.user.information.tooltip.desc'} />
                        </li>
                        {this.dropdownValue.myProfile === this.state.currentDropdownItem && this.getScreenByValue(this.dropdownValue.myProfile)}
                    </Fragment>
                {/* } */}
            </ul>
        );
    };

    render() {
        // const modalPopup = this.getModalPopup();
        return (
            <Fragment>
                {this.screen.default === this.state.currentScreen && this.getDefaultScreen()}
                {this.screen.info === this.state.currentScreen && this.getScreenByValue(this.screen.info)}
                {this.screen.receivedMail === this.state.currentScreen && this.getScreenByValue(this.screen.receivedMail)}
                {this.screen.sentMail === this.state.currentScreen && this.getScreenByValue(this.screen.sentMail)}
                {this.screen.friendlist === this.state.currentScreen && this.getScreenByValue(this.screen.friendlist)}
                {this.screen.blocklist === this.state.currentScreen && this.getScreenByValue(this.screen.blocklist)}
            </Fragment>
        );
    }

}

function mapStateToProps(state) {
    const {authentication: {user}, notify: {notifies , notice }, users: {newMails}} = state;
    return {
        user,
        notifies,
        newMails,
        notice
    };
}

const mapDispatchToProps = (dispatch) => ({
    onGetUserNotifications: (id) => dispatch(notificationAction.getById(id)),
    haveNewMails: (userId) => dispatch(userActions.haveNewMails({userId})),
});
const connectedPage = connect(mapStateToProps, mapDispatchToProps)(UserInfo);
export default connectedPage;