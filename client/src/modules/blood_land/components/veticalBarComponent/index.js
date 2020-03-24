import React, {Component, Fragment} from 'react';
import classNames from 'classnames';
import connect from "react-redux/es/connect/connect";
import {Modal} from 'reactstrap';
import UserInfo from "../gameUIComponent/UserInfo";
import MyLand from "../gameUIComponent/MyLand";
import Wallet from "./Wallet";
import LandTrading from "../gameUIComponent/LandTrading";
import CharacterInventory from "./InventoryComponent/CharacterInventory";
import ItemsInventory from "./InventoryComponent/ItemsInventory";
import GiftsInventory from "./InventoryComponent/RandomBoxInventory";
import Bitamin from "./Bitamin";
import LandForbid from "../gameUIComponent/LandForbid";
import Setting from "./settingComponent/SettingScreen";
import {userActions} from "../../../../store/actions/commonActions/userActions";
import Shop from './Shop';
import alertActions from '../../../../store/actions/commonActions/alertActions';
import {settingActions} from '../../../../store/actions/commonActions/settingActions';
import {apiLand} from '../../../../helpers/config';
import {loadingImage} from "../general/System";
import throttle from 'lodash.throttle'
import TranslateLanguage from "../general/TranslateComponent";
import {notificationAction} from "../../../../store/actions/commonActions/notifyActions";
import MessageBox from './../general/MessageBox';
import { LazyImage } from 'react-lazy-images';

class GameUI extends Component {
    constructor(props) {
        super(props);
        this.handleShowWithCheckingGameMode = throttle(this.handleShowWithCheckingGameMode, 400);
        this.handleShow = throttle(this.handleShow, 400);
        this.state = {
            modal: false,
            open: false,
            gameUIShow: false,
            currentScreen: this.screen.noScreen,
            currentPopupScreen: this.screen.noScreen,
            hideSticker: false,
            selectedTiles: [],
            showTabs: true,
            cart: [],
            childScreen: 0,
            user: null,
            logoHover: false,
            noticeToggle: false,
        };
    }

    screen = {
        noScreen: "noScreen",
        userInfo: "userInfo",
        myland: "myland",
        wallet: "wallet",
        landTrade: "landTrade",
        characterInventory: "characterInventory",
        itemsInventory: "itemsInventory",
        giftInventory: "giftInventory",
        landForbid: "landForbid",
        bitamin: 'bitamin',
    };

    handleShowWithCheckingGameMode = (screen) => {
        if (
            screen === this.screen.myland ||
            screen === this.screen.characterInventory ||
            screen === this.screen.itemsInventory ||
            screen === this.screen.giftInventory
        ) {
            this.props.toggleGame(true);
        } else {
            this.props.toggleGame(false);
        }
        this.handleShow(screen);
    };

    popupScreen = {
        noPopup: 'noPopup',
        shop: 'shop',
        logout: 'logout',
        setting: 'setting',
    };

    componentDidMount(){
        const {user:{_id},haveNewMails} = this.props;
        haveNewMails(_id);
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.notice !== this.props.notice) {
            if (this.props.notice === 'open') {
                // console.log('gameui this.props.notice',this.props.notice);
                this.handleShow(this.screen.userInfo);
                const notice = 'pending';
                this.props.onHandleOpenNotify(notice);
            }
        }
        if (typeof this.props.alert.screen !== 'undefined' && this.props.alert.screen !== -1) {
            this.handleShowPopup(this.props.alert.screen);
            this.props.closePopup()
        }
        if (this.props.gameMode === false) {
            if (
                this.state.currentScreen === this.screen.characterInventory ||
                this.state.currentScreen === this.screen.itemsInventory ||
                this.state.currentScreen === this.screen.giftInventory
            ) {
                this.handleHide();
            }
        } else {
            if (
                this.state.currentScreen === this.screen.landTrade
            ) {
                this.handleHide();
            }
        }

    };

    handleShowPopup = (popupScreen) => {
        this.setState({
            currentPopupScreen: popupScreen,
            modal: true,
        });
        setTimeout(() => {
            this.handleHide();
        }, 200);
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            currentScreen: this.screen.noScreen,
            open: false,
            modal: false
        });
    };

    handleShow = (screen) => {
        const notice = 'close';
        this.props.onHandleOpenNotify(notice)
        if (this.state.currentScreen === screen) {
            // this.loadData();
            setTimeout(function () {
                this.setState({gameUIShow: true});
            }.bind(this), 0.000000001);

            setTimeout(function () {
                this.setState({currentScreen: this.screen.noScreen, open: true});
            }.bind(this), 0.000001);

            setTimeout(function () {
                this.setState({currentScreen: screen, open: true});
            }.bind(this), 0.000001);
        } else {
            setTimeout(function () {
                this.setState({gameUIShow: true});
            }.bind(this), 0.000000001);

            setTimeout(function () {
                this.setState({currentScreen: screen, open: true});
            }.bind(this), 0.000001);
        }
    };

    handleHide = () => {
        setTimeout(function () {
            this.setState({open: false});
        }.bind(this), 0.000001);

        setTimeout(function () {
            this.setState({gameUIShow: false});
        }.bind(this), 100);

        const currentScreen = this.state.currentScreen;

        setTimeout(function () {
            if (currentScreen === this.state.currentScreen && !this.state.open)
                this.setState({currentScreen: this.screen.noScreen, gameUIShow: false});
        }.bind(this), 100);
    };

    getScreenByValue = (value) => {
        switch (value) {
            case this.screen.userInfo:
                return <UserInfo handleHide={this.handleHide} />;
            case this.screen.landTrade:
                return <LandTrading handleHide={this.handleHide}/>;
            case this.screen.wallet:
                return <Wallet handleHide={this.handleHide}/>;
            case this.screen.myland:
                return <MyLand handleHide={this.handleHide} handleShowPopup={this.handleShowPopup}
                               popupScreen={this.popupScreen}/>;
            case this.screen.characterInventory:
                return <CharacterInventory handleHide={this.handleHide} handleShowPopup={this.handleShowPopup}/>;
            case this.screen.itemsInventory:
                return <ItemsInventory handleHide={this.handleHide}/>;
            case this.screen.giftInventory:
                return <GiftsInventory handleHide={this.handleHide}/>;
            case this.screen.bitamin:
                return <Bitamin handleHide={this.handleHide}/>;
            case this.screen.landForbid:
                return <LandForbid handleHide={this.handleHide}/>;
            default:
                return '';
        }
    };

    getActiveTabItemClass = (screen) => {
        return classNames({
            'active': screen === this.state.currentScreen,
            'game-mode': (
                screen === this.screen.characterInventory ||
                screen === this.screen.itemsInventory ||
                screen === this.screen.giftInventory
            ) && !this.props.settingReducer.gameMode,
        });
    };

    getActiveTabItemClass2 = (screen) => {
        return classNames({
            'active': screen === this.state.currentScreen,
            'game-mode': (
                screen === this.screen.landTrade
            ) && this.props.settingReducer.gameMode,
        });
    };

    getActivePopupTabItemClass = (popup) => {
        return classNames({
            'active': popup === this.state.currentPopupScreen,
            'game-mode': (popup === this.popupScreen.shop
            ) && !this.props.settingReducer.gameMode
        });
    };

    handleHideAlertPopup = () => {
        this.setState({
            modalAlertPopup: false,

        });
        setTimeout(() => {
            this.setState({
                totalHighest: false
            })
        }, 1000)
    };

    getNavImgUrl = tabCode => {
        return {
            IMG: loadingImage(`/images/game-ui/tabs/tab${tabCode}.svg`),
            SELECTED_IMG: loadingImage(`/images/game-ui/tabs/tab${tabCode}-selected.svg`)
        }
    };
    
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
        const gameTabContentClass = classNames({
            'game-tab-content': true,
            'game-tab-content--hidden': !this.state.open
        });
        const gameUIShowContentClass = classNames({
            'game-ui': true,
            'game-ui--show-content': this.state.gameUIShow
        });
        const {newMails,user:{_id}} = this.props;

        return (
            <div className={gameUIShowContentClass}>
                <div className={gameTabContentClass} id={gameTabContentClass}>
                    <div className='hide-panel' onClick={() => this.handleHide()}>
                        <div className='hide-icon'/>
                    </div>
                    {this.getScreenByValue(this.state.currentScreen)}
                </div>
                <div className='game-navigator'>
                    <div className='logo-game'
                         onMouseOver={() => this.setState({logoHover: true})}
                         onMouseLeave={() => this.setState({logoHover: false})}>
                        <a target="_blank" rel="noopener noreferrer" href='https://wallet.blood.land/'>
                            {this.state.logoHover ?
                                <img src={loadingImage('/images/game-ui/wallet-logo-hover.svg')} alt=''/> :
                                <img src={loadingImage('/images/game-ui/wallet-logo.svg')} alt=''/>}
                        </a>
                    </div>

                    <ul className='game-tabs'>
                        <li className={this.getActiveTabItemClass(this.screen.userInfo)}
                            onClick={() => {
                                this.props.haveNewMails(_id);
                                this.handleShow(this.screen.userInfo);
                            }}>
                            <LazyImage src={this.getNavImgUrl(1).IMG}
                                placeholder={({ ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="user-tab" />} />
                            {newMails && newMails.unreads > 0 && <div className='has-new'>NEW</div>}
                            <div>
                                <TranslateLanguage direct={'menuTab.user'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.wallet)}
                            onClick={() => this.handleShow(this.screen.wallet)}>
                            <LazyImage src={this.getNavImgUrl(3).IMG} 
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="wallet-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.wallet'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.bitamin)}
                            onClick={() => this.handleShow(this.screen.bitamin)}>
                                
                            <LazyImage src={this.getNavImgUrl(11).IMG}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps}  alt="bitamin-tab" />} />

                            <div>
                                <TranslateLanguage direct={'menuTab.bitamin'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.myland)}
                            onClick={() => this.handleShow(this.screen.myland)}>                                
                            <LazyImage src={this.getNavImgUrl(2).IMG}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps}  alt="myLand-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.myLand'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass2(this.screen.landTrade)}
                            onClick={() => !this.props.settingReducer.gameMode && this.handleShowWithCheckingGameMode(this.screen.landTrade)}>
                            <LazyImage src={this.getNavImgUrl(4).IMG}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps}  alt="transaction-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.transaction'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.characterInventory)}
                            onClick={() => this.props.settingReducer.gameMode && this.handleShowWithCheckingGameMode(this.screen.characterInventory)}>
                            <LazyImage src={this.getNavImgUrl(5).IMG}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="characters-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.characters'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.itemsInventory)}
                            onClick={() => this.props.settingReducer.gameMode && this.handleShowWithCheckingGameMode(this.screen.itemsInventory)}>
                            <LazyImage src={this.getNavImgUrl(6).IMG}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps}  alt="items-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.items'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.giftInventory)}
                            onClick={() => this.props.settingReducer.gameMode && this.handleShowWithCheckingGameMode(this.screen.giftInventory)}>
                            <LazyImage src={this.getNavImgUrl(10).IMG}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="randomBox-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.randomBox'}/>
                            </div>
                        </li>
                        <li className={this.getActivePopupTabItemClass(this.popupScreen.shop)}
                            onClick={() => this.props.settingReducer.gameMode && this.handleShowPopupShop()}>
                            <LazyImage src={this.getNavImgUrl(7).IMG}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="shop-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.shop'}/>
                            </div>
                        </li>
                        {this.props.user.role === "manager" &&
                        <li className={this.getActiveTabItemClass(this.screen.landForbid)}
                            onClick={() => this.handleShowWithCheckingGameMode(this.screen.landForbid)}>
                            <LazyImage src={this.getNavImgUrl(2).IMG}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="landforbid-tab" />} />
                            <div>금지 된 땅</div>
                            {/* <div className="tooltip-info">
                                    <TranslateLanguage direct={'menuTab.shop'}/>
                                </div> */}
                        </li>
                        }
                    </ul>
                    <ul className='game-tabs2'>
                        <li onClick={() => this.handleShowPopup(this.popupScreen.logout)}>
                            <LazyImage src={this.getNavImgUrl(8).IMG}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="logout-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.logOut'}/>
                            </div>
                            {/* <div className="tooltip-info">
                                <TranslateLanguage direct={'menuTab.logOut'}/>
                            </div> */}
                        </li>
                        <li onClick={() => this.handleShowPopup(this.popupScreen.setting)}>
                            <LazyImage src={this.getNavImgUrl(9).IMG}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="setting-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.setting'}/>
                            </div>
                            {/* <div className="tooltip-info">
                                <TranslateLanguage direct={'menuTab.setting'}/>
                            </div> */}
                        </li>
                    </ul>
                </div>
            </div>
        )
    };

    render() {
        const defaultScreen = this.getDefaultScreen();
        const modalPopup = this.getModalPopup();
        const notice = this.getNotificationInfo();
        const {noticeToggle} = this.state;
        return (
            <Fragment>
                {defaultScreen}
                {modalPopup}
                {noticeToggle && notice}
            </Fragment>
        );
    }

    getNotificationInfo = () => {
        return (
            <div className='notice-info'>
                {/*<marquee>*/}
                {/*    이것은 샘플 알림입니다. 이것은 샘플 알림입니다. 이것은 샘플 알림입니다. 이것은 샘플 알림입니다. 이것은 샘플 알림입니다. 이것은 샘플 알림입니다.*/}
                {/*</marquee>*/}
            </div>
        )
    };

    getModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.shop === this.state.currentPopupScreen ? this.getShopPopup() : ''}
                {this.popupScreen.logout === this.state.currentPopupScreen ? this.getLogoutAlertPopup() : ''}
                {this.popupScreen.setting === this.state.currentPopupScreen ? this.getSettingPopup() : ''}
            </Fragment>
        );
    };

    doLogout = () => {
        (apiLand === 'http://127.0.0.1:5001' || apiLand === 'http://127.0.0.1:5002' || apiLand === 'http://127.0.0.1:5003') ? this.props.userLogout() : this.props.userLogoutWallet();
    };

    getShopPopup = () => {
        return <Shop isOpen={this.state.modal} handleShowPopup={this.handleShowPopup}
                     handleHidePopup={this.handleHidePopup} popupScreen={this.popupScreen}/>
    };

    handleShowPopupShop = () => {
        this.handleShowPopup(this.popupScreen.shop);
    };

    getLogoutAlertPopup = () => {
        const {modal} = this.state;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.doLogout();
        const noBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'menuTab.logOut.alert.getLogoutAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.logOut.alert.getLogoutAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
    };

    getSettingPopup = () => {
        return (
            <Modal isOpen={this.state.modal} backdrop="static" className={`custom-modal modal--setting`}>
                <div className='custom-modal-header'>
                    <TranslateLanguage direct={'menuTab.setting'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.handleHidePopup()}/>
                </div>
                <div className='custom-modal-body'>
                    <Setting/>
                </div>
                {/* Ver. 0.1.1903261400 */}
                {process.env.VERSION_DATE_NOW}
                <div style={{fontSize: '10px', color: 'rgba(36,36,36,0.5)'}}>{process.env.VERSION_TIME}</div>
                <div className='custom-modal-footer'>
                    <button onClick={() => this.handleHidePopup()}>
                        <TranslateLanguage direct={'menuTab.setting.close'}/></button>
                </div>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    const {map, settingReducer, alert, authentication: {user}, users: {receivedList}, notify: {notice},users:{newMails}} = state;
    return {
        map,
        settingReducer,
        alert,
        user,
        receivedList,
        notice,
        newMails
    };
}

const mapDispatchToProps = (dispatch) => ({
    userLogout: () => dispatch(userActions.logout()),
    haveNewMails: (userId) => dispatch(userActions.haveNewMails({userId})),
    userLogoutWallet: () => dispatch(userActions.logoutWallet()),
    closePopup: () => dispatch(alertActions.closePopup()),
    toggleGame: (mode) => dispatch(settingActions.toggleGameMode(mode)),
    onHandleOpenNotify: (notice) => dispatch(notificationAction.onOpenNotify(notice))
});

const connectedFunctionPage = connect(mapStateToProps, mapDispatchToProps)(GameUI);
export default connectedFunctionPage;
