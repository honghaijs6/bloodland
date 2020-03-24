import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import GameUICommon from '../../gameUIComponent/Common/IdentityCard';
import classNames from 'classnames';
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import Tooltip from './../../general/Tooltip';

import BitaminExchange from './bitaminComponent/bitaminExchange';
import BitaminHistory from './bitaminComponent/bitaminHistory';
import { bitaminActions } from '../../../../../store/actions/landActions/bitaminActions';
import { LazyImage } from 'react-lazy-images';

class Bitamin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPopupScreen: this.popupScreen.noPopup,
        };
    }

    componentDidMount = () => {
        const {user} = this.props;
        if (user) {
            const {wToken} = user;
            this.props.getMyBitamin({wToken});
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
            currentPopupScreen: popupScreen
        });
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup
        });
    };


    getActivePopupClass = (popupScreen) => {
        return classNames({
            'active': popupScreen === this.state.currentPopupScreen
        });
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

    
    //vuonglt  6/6/2019 fix bitamin
    getDefaultScreen = () => {
        const {bitamin} = this.props;
        // console.log("bitamin",bitamin);
        return (
            <ul className='function-menu'>
                <GameUICommon/>
                <li className='no-hover'>
                    <div className='my-blood-coin'>
                        <div className='blood-coin'>
                            <LazyImage src={loadingImage('/images/game-ui/bitamin-title.svg')}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="bitamin" />} />
                            <br/>
                            <TranslateLanguage direct={'menuTab.bitamin.myBitamin'}/>
                        </div>
               
                        <div className='blood-coin-value'>
                            <TranslateLanguage direct={'menuTab.bitamin.myBitamin.availableBitamin'}/>
                                { typeof bitamin === "undefined" ? this.loading() : <span> {parseFloat(bitamin).toLocaleString()} </span>}
                        </div> 
                    </div>
                </li>
                <li className={this.getActivePopupClass(this.popupScreen.bitaminExchange)}
                    onClick = {()=>this.handleShowPopup(this.popupScreen.bitaminExchange)} >
                    <LazyImage src={loadingImage('/images/game-ui/tab11/nav1.svg')}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="bitaminExchange" />} />
                    <div><TranslateLanguage direct={'menuTab.bitamin.bitaminExchange'}/></div>
                    <Tooltip nameLang={'menuTab.bitamin.bitaminExchange.toolTip.name'} descLang={'menuTab.bitamin.bitaminExchange.toolTip.desc'} />
                </li>
                <li className={this.getActivePopupClass(this.popupScreen.bitaminExchangeHistory)}
                    onClick = {()=>this.handleShowPopup(this.popupScreen.bitaminExchangeHistory)} >
                    <LazyImage src={loadingImage('/images/game-ui/tab11/nav2.svg')}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="bitaminHistory" />} />
                    <div><TranslateLanguage direct={'menuTab.bitamin.bitaminHistory'}/></div>
                    <Tooltip nameLang={'menuTab.bitamin.bitaminHistory.toolTip.name'} descLang={'menuTab.bitamin.bitaminHistory.toolTip.desc'} />
                </li>
            </ul>
        );
    };

    render() {
        const modalPopup = this.getModalPopup();
        return (
            <Fragment>
                {this.getDefaultScreen()}
                {modalPopup}
            </Fragment>
        );
    }

    popupScreen = {
        noPopup: 'noPopup',
        bitaminExchange: 'bitaminExchange',
        bitaminExchangeHistory: 'bitaminExchangeHistory',
    };

    getModalPopup = () => {
        return (
            <Fragment>
                {this.getBitaminExchangePopup()}
                {this.getBitaminExchangeHistoryPopup()}
            </Fragment>
        );
    };

    getBitaminExchangePopup = () => {
        const {bitamin} = this.props;
        const modal = this.popupScreen.bitaminExchange === this.state.currentPopupScreen ;
        return modal && <BitaminExchange modal={modal} handleHidePopup={this.handleHidePopup} bitamin={bitamin} />;
    }

    getBitaminExchangeHistoryPopup = () => {
        const modal = this.popupScreen.bitaminExchangeHistory === this.state.currentPopupScreen;
        return modal && <BitaminHistory modal={modal} handleHidePopup={this.handleHidePopup}  />;
    }
}

function mapStateToProps(state) {
    const {authentication: {user}, bitaminReducer:{bitamin}} = state;
    return {
        user,
        bitamin
    };
}

const mapDispatchToProps = (dispatch) => ({
    getMyBitamin: (param) => dispatch(bitaminActions.getMyBitamin(param))
});

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(Bitamin);
export default connectedPage;
