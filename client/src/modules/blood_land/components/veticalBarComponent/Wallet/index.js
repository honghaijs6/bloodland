import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import GameUICommon from '../../gameUIComponent/Common/IdentityCard';
import classNames from 'classnames';
import TransferScreen from './component/TransferScreen';
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import Tooltip from './../../general/Tooltip';
import { LazyImage } from 'react-lazy-images';

class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            currentScreen: this.screen.default,
            currentPopupScreen: this.popupScreen.noPopup,
            currentDropdownItem: this.dropdownValue.noDropdown,
            lastScreen: 0,
            logoHover: false,
            logoHover2: false
        };
    }

    screen = {
        default: 0,
    };

    popupScreen = {
        noPopup: 10,
        recharge: 11,
        gameCoinToBlood: 12,

    };

    dropdownValue = {
        noDropdown: 20,
        transfer: 22,
    };

    componentDidMount = () => {
        const {user} = this.props;
        if (user) {
            const {wToken} = user;
            this.props.getWalletInfo({wToken});
        }
    };


    handleChangeScreen = (screen) => {
        this.setState({
            lastScreen: this.state.currentScreen,
            currentScreen: screen,
        });
    };


    handleShowPopup = (popupScreen) => {
        this.setState({
            currentDropdownItem: this.dropdownValue.noDropdown,
            currentPopupScreen: popupScreen,
            modal: true
        });
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            modal: false
        });
    };


    getActivePopupClass = (popupScreen) => {
        return classNames({
            'active': popupScreen === this.state.currentPopupScreen
        });
    };


    goToMyWallet = () => {
        window.open("https://wallet.blood.land/", "_blank");
    };

    loading = () => {
        return (
            <div className="lds-ellipsis">
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
        )
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
        const {wallet} = this.props;
        return (
            <ul className='function-menu'>
                <GameUICommon/>
                <li className='no-hover'>
                    <div className='my-blood-coin'>
                        <div className='blood-coin'>
                            <LazyImage src={loadingImage('/images/game-ui/cell.svg')}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="blood" />}  />
                            <div><TranslateLanguage direct={'menuTab.wallet.blood'}/></div>
                        </div>
                        {wallet && wallet.info ?
                            <div className='blood-coin-value'>
                                <TranslateLanguage direct={'menuTab.wallet.value'}/>
                                <span>{parseFloat(wallet.info.goldBlood).toLocaleString()}</span></div> :
                            <div className='blood-coin-value'><TranslateLanguage direct={'menuTab.wallet.value'}/> <span>{this.loading()}</span></div>}
                    </div>
                </li>
                <li onClick={() => this.goToMyWallet()}>
                    <LazyImage src={loadingImage('/images/game-ui/tab3/nav1.svg')}
                            placeholder={({ imageProps, ref }) => (
                                this.loadingImg(ref)
                            )}
                            actual={({ imageProps }) => <img {...imageProps} alt="walletToBlood" />} />
                    <div><TranslateLanguage direct={'menuTab.wallet.walletToBlood'}/></div>
                    <Tooltip nameLang={'menuTab.wallet.walletToBlood.toolTip.name'} descLang={'menuTab.wallet.walletToBlood.toolTip.desc'} />
                </li>
                <li className={this.getActivePopupClass(this.popupScreen.gameCoinToBlood)} onClick={() => this.handleShowPopup(this.popupScreen.gameCoinToBlood)}>
                    <LazyImage src={loadingImage('/images/game-ui/tab3/nav2.svg')}
                            placeholder={({ imageProps, ref }) => (
                                this.loadingImg(ref)
                            )}
                            actual={({ imageProps }) => <img {...imageProps} alt="bloodToWallet" />} />
                    <div><TranslateLanguage direct={'menuTab.wallet.bloodToWallet'}/></div>
                    <Tooltip nameLang={'menuTab.wallet.bloodToWallet.toolTip.name'} descLang={'menuTab.wallet.bloodToWallet.toolTip.desc'} />
                </li>
            </ul>
        );
    };

    render() {
        const modalPopup = this.getModalPopup();
        return (
            <Fragment>
                {this.screen.default === this.state.currentScreen && this.getDefaultScreen()}
                {modalPopup}
            </Fragment>
        );
    }

    getModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.gameCoinToBlood === this.state.currentPopupScreen && this.getGameCoinToBloodPopup()}
            </Fragment>
        );
    };


    getGameCoinToBloodPopup = () => {
        return <TransferScreen modal={this.state.modal} handleHidePopup={this.handleHidePopup}/>
    }
}

function mapStateToProps(state) {
    const {authentication: {user}, wallet} = state;
    return {
        user,
        wallet
    };
}

const mapDispatchToProps = (dispatch) => ({
    getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param))
});

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(Wallet);
export default connectedPage;
