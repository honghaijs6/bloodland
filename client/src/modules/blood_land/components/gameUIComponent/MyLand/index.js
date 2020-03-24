import React,{Fragment,Component}  from 'react';
import connect from "react-redux/es/connect/connect";

import Tooltip from './../../general/Tooltip';

import GameUICommon from '../Common/IdentityCard';
import LandManagement from './LandManagementComponent/LandManagement';
import LandSale from './LandSaleComponent/LandSale';
import LandCertifications from './LandCertifications';

import {
    TranslateLanguage,
    loadingImage,
    userActions,
} from '../../../../../helpers/importModule';
import { LazyImage } from 'react-lazy-images';

class MyLands extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            currentScreen: this.screen.default,
        };
    }

    screen = {
        default: 'default',
        landManagement: 'landManagement',
        landSale:'landSale',
        landCertifications:'landCertifications',
    };

    handleChangeScreen = (screen) => {
        this.setState({
            lastScreen: this.state.currentScreen,
            currentScreen: screen,
        });
    };

    getScreenByValue = (value) =>{
        switch (value) {
            case this.screen.landManagement:
                return <LandManagement PREVIOUS_SCREEN={this.screen}  handleChangeScreen={this.handleChangeScreen} handleShowPopup={this.props.handleShowPopup} popupScreen={this.props.popupScreen} />;
            case this.screen.landSale:
                return <LandSale handleChangeScreen={this.handleChangeScreen} />;
            case this.screen.landCertifications:
                return <LandCertifications handleChangeScreen={this.handleChangeScreen} />;
            default:
                return '';
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
        return (
            <ul className='function-menu'>
                    <GameUICommon />
                    <li onClick={() => this.handleChangeScreen(this.screen.landManagement)}>
                        <LazyImage src={loadingImage('/images/game-ui/tab2/nav1.svg')}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps}  alt="landOwned" />} />
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned'}/>
                        </div>
                        <Tooltip nameLang={'menuTab.myLand.landOwned.toolTip.name'} descLang={'menuTab.myLand.landOwned.toolTip.desc'} />
                    </li>
                    <li onClick={() => this.handleChangeScreen(this.screen.landSale)}>
                        <LazyImage src={loadingImage('/images/game-ui/tab2/nav2.svg')}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps}  alt="landSold" />} />
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landSold'}/>
                        </div>
                        <Tooltip nameLang={'menuTab.myLand.landSold.toolTip.name'} descLang={'menuTab.myLand.landSold.toolTip.desc'} />
                    </li>
                    <li onClick={() => this.handleChangeScreen(this.screen.landCertifications)}>
                        <LazyImage src={loadingImage('/images/game-ui/tab2/nav3.svg')}
                                placeholder={({ imageProps, ref }) => (
                                    this.loadingImg(ref)
                                )}
                                actual={({ imageProps }) => <img {...imageProps} alt="certified" />} />
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.certified'}/>
                        </div>
                        <Tooltip nameLang={'menuTab.myLand.certified.toolTip.name'} descLang={'menuTab.myLand.certified.toolTip.desc'} />
                    </li>
            </ul>
        );
    };


    render() {
        return (
            <Fragment>
                {this.screen.default === this.state.currentScreen && this.getDefaultScreen()}
                {this.screen.landManagement === this.state.currentScreen && this.getScreenByValue(this.screen.landManagement)}
                {this.screen.landSale === this.state.currentScreen && this.getScreenByValue(this.screen.landSale)}
                {this.screen.landCertifications === this.state.currentScreen && this.getScreenByValue(this.screen.landCertifications)}
            </Fragment>
        );
    }

}

const mapStateToProps = (state) => {
    const { authentication: {user} } = state;
    return {
        user
    };
};


const connectedPage = connect(mapStateToProps,null)(MyLands);
export default (connectedPage);
