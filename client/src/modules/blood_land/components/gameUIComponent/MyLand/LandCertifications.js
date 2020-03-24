import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {Modal} from 'reactstrap';
import {loadingImage, QuadKeyToLatLong} from '../../general/System';
import GoogleMap from 'google-map-react';
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {landActions} from "../../../../../store/actions/landActions/landActions";
import moment from "moment";
import TranslateLanguage from "../../general/TranslateComponent";
import Tooltip from "../../general/Tooltip";


class LandCertifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPopup: false,
            modalAlertPopup: false,
            currentScreen: this.screen.default,
            currentPopupScreen: this.popupScreen.noPopup,
            currentAlertPopUp: this.alertPopupScreen.noPopup
        };
    }

    screen = {
        default: 'default'
    };

    popupScreen = {
        noPopup: 'noPopup',
        landInfo: 'landInfo',
    };

    alertPopupScreen = {
        noPopup: 'noPopup',
        certificateAlert: 'certificateAlert',
    };

    componentDidMount() {
        this.props.getAllLandById(this.props.user._id);
    }
    
    handleChangeScreen = (screen) => {
        this.setState({
            lastScreen: this.state.currentScreen,
            currentScreen: screen,
        });
    };

    handleShowPopup = (popupScreen) => {
        this.setState({
            currentPopupScreen: popupScreen,
            modalPopup: true
        });
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            modalPopup: false
        });
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

    showDetail = (land) => {
        const {quadKey}= land;
        this.props.getLandInfo(quadKey);
        this.handleShowPopup(this.popupScreen.landInfo);
    };


    getNoInfoView = () => {
        return (
            <Fragment>
                <div className='land-certification-warning-screen'>
                    <div className='warning'><div className="lnr lnr-warning lnr-custom-close"/>
                    <TranslateLanguage direct={'menuTab.myLand.certified.getNoInfoView.noInformation'}/>
                    </div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src={process.env.PUBLIC_URL + `/images/game-ui/sm-back.svg`} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.certified.getNoInfoView.backBtn'}/>
                            <Tooltip descLang={'menuTab.myLand.certified.toolTip.backBtn'}/>
                        </div>
                    </button>
                </div>
            </Fragment>
        );
    };

    loading = () => {
        return (
            <div className='land-certification-warning-screen'>
                <div className='screen-loading'>
                    <div className="lds-roller">
                        <div/><div/><div/><div/><div/><div/><div/><div/>
                    </div>
                </div>
            </div>
        )
    };

    renderCertificateList = () =>{
        const {myLands} = this.props;
        return (
            <Fragment>
                <div className='land-certification-ui-screen'>
                    {myLands.map((l, i) => {
                            return <div className='land-certificate-item' key={i} onClick={() => this.showDetail(l)}>{i+1}. {l.name ? l.name : l.quadKey}</div>
                    })}
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src={process.env.PUBLIC_URL + `/images/game-ui/sm-back.svg`} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.certified.backBtn'}/>
                            <Tooltip descLang={'menuTab.myLand.certified.toolTip.backBtn'}/>
                        </div>
                    </button>
                </div>
            </Fragment>
        )
    }

    getDefaultScreen = () => {
        const {myLands} = this.props;
        return (
            <Fragment>
                <div className='screen-title'>
                    <img src={loadingImage('/images/game-ui/tab2/nav3.svg')} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.myLand.certified'}/>
                    </div>
                </div>
                {myLands ?  myLands.length === 0 ? this.getNoInfoView() : this.renderCertificateList() : this.loading()}
            </Fragment>
        );
    };

    render() {
        return (
            <Fragment>
                {this.getDefaultScreen()}
                {this.getLandInfoPopup()}
                {this.getCertificateAlertPopup()}
            </Fragment>
        );
    }

    getLandInfoPopup = () => {
        const {landInfo, user} = this.props;
        // console.log('this.props.landInfo',landInfo);
        const {modalPopup} = this.state;
        if (landInfo) {
            const {status,info} = landInfo;
            if(status){
                const {purchaseDate , quadKey , purchasePrice , initialPrice,txid} = info;
                const gps = QuadKeyToLatLong(quadKey);
                const purchaseDateFormat = moment(purchaseDate).format('YYYY.MM.DD');
                return (
                    <Modal isOpen={modalPopup} backdrop="static"
                           className={`custom-modal modal--land-centificate`}>
                        <div className='custom-modal-header'>
                            <img src={loadingImage('/images/game-ui/tab2/nav3.svg')} alt=''/>
                            <TranslateLanguage direct={'menuTab.myLand.certified'}/>
                            <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.handleHidePopup()}/>
                        </div>
                        <div className='custom-modal-body'>
                            <div className='land-certificate-grid-container'>
                                <div className="cell bottom-border"><TranslateLanguage direct={'menuTab.myLand.certified.selectedLand'}/></div>
                                <div className="cell bottom-border"><TranslateLanguage direct={'menuTab.myLand.certified.content'}/></div>
    
                                <div className="cell top-padding"><TranslateLanguage direct={'menuTab.myLand.certified.ownInfo'}/></div>
                                <div className="cell top-padding">{user && user.wId }</div>
    
                                <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.firstLandPrice'}/></div>
                                <div className="cell">{initialPrice.toLocaleString()} Blood</div>
    
                                <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.purchasedPrice'}/></div>
                                <div className="cell">{purchasePrice.toLocaleString()} Blood</div>
    
                                <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.datePurchase'}/></div>
                                <div className="cell">{purchaseDateFormat}</div>
    
                                <div className="cell bottom-padding"><TranslateLanguage direct={'menuTab.myLand.certified.hashInfo'}/></div>
                                <div className="cell hash-key">{txid}</div>
    
                                <div className="cell top-border top-padding"><TranslateLanguage direct={'menuTab.myLand.certified.cellInfo'}/></div>
                                <div className="cell top-border top-padding">
                                    <div>Quadkey : {quadKey}</div>
                                    <div><TranslateLanguage direct={'menuTab.myLand.certified.GPSCoor'}/> : {gps.lat}(<TranslateLanguage direct={'menuTab.myLand.certified.latitude'}/>), {gps.lng}(<TranslateLanguage direct={'menuTab.myLand.certified.longitude'}/>)</div>
                                    <div className='img-quadkey-lammao'>
                                        <div className='google-map-lite'>
                                            <GoogleMap  center={[gps.lat, gps.lng]}
                                                        zoom={14}
                                                        draggable={false}
                                                        options={{
                                                            fullscreenControl: false,
                                                            disableDoubleClickZoom: true,
                                                            maxZoom: 14,
                                                            minZoom: 14,
                                                            zoomControl: false
                                                        }}> 
                                            </GoogleMap>
                                            <div className='cell-center' onClick={() => this.moveToLand(info)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div className='certification-lammao'
                             onClick={() => this.handleShowAlertPopup(this.alertPopupScreen.certificateAlert)}>
                            <img src={process.env.PUBLIC_URL + `/images/bloodland-ui/certificate-sample.png`} alt=''/>
                        </div>
                        <div className='custom-modal-footer-action-group' style={{height: '52px'}}>
                            <button onClick={() => this.handleHideAllPopup()}>
                                <img src={process.env.PUBLIC_URL + `/images/game-ui/sm-close.svg`} alt=''/>
                                <div><TranslateLanguage direct={'menuTab.myLand.certified.closeBtn'}/> </div>
                            </button>
                        </div>
                    </Modal>
                )
            }
        }
    };

    moveToLand = (land) => {
        const {map} = this.props;
        const {quadKey} = land;
        if(map && map.zoom === 22){
            const center = QuadKeyToLatLong(quadKey);
            this.props.syncCenterMap(center, quadKey.length - 2, quadKey);
            this.handleHideAllPopup();
        }else{
            const center = QuadKeyToLatLong(quadKey);
            this.props.syncCenterMap(center);
            this.handleHideAllPopup();
        }

    };

    getCertificateAlertPopup = () => {
        const {landInfo} = this.props;
        if (landInfo) {
            const {info} = landInfo;
            const gps = info.latlng;
            const {purchaseDateFormat} = info;
            return (
                <Modal isOpen={this.state.modalAlertPopup} backdrop="static"
                       className={`custom-modal modal--certificate`}>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.handleHideAlertPopup()}/>
                    <div className='certificate'>
                        <div className='certificate-content'>
                            <div>
                                ID : {landInfo && landInfo.user ? landInfo.user.wId : "wId User"}
                            </div>
                            <div style={{display: 'flex'}}>
                                <div>LOCATION :</div>
                                <div>
                                    Latitude {gps.lat} <br/>
                                    Longitude {gps.lng}
                                </div>
                            </div>
                            {/* <div>
                            NUMBER OF CELLS : 1
                        </div> */}
                        </div>
                        <div className='certificate-date'>
                            {purchaseDateFormat}
                        </div>
                        <div className='certificate-signature'>
                            {/*<img src={process.env.PUBLIC_URL + `/images/bloodland-ui/sample-signature.png`} alt=''/>*/}
                        </div>
                    </div>
                </Modal>
            )
        }

    };

    handleHideAllPopup = () => {
        this.handleHidePopup();
        this.handleHideAlertPopup();
    }
}


function mapStateToProps(state) {
    const { lands: {myLands,landInfo}, authentication: {user}, map } = state;
    return {
        myLands,
        landInfo, 
        user,
        map
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
        syncCenterMap: (center, zoom, centerQuadKey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadKey)),
        saveLandSelectedPosition: (landSelected) => dispatch(landActions.saveSelectedLandPosition(landSelected)),
        getLandInfo: (quadKey) => dispatch(landActions.getLandInfo({quadKey})),
    };
};

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(LandCertifications);
export default connectedPage;
