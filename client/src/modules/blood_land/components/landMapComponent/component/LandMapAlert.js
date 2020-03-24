import {loadingImage, QuadKeyToLatLong} from "../../general/System";
import {Modal} from "reactstrap";
import React, {Fragment} from "react";
// import moment from "moment";
import GoogleMap from 'google-map-react';
import TranslateLanguage from "../../general/TranslateComponent";


const onHandleMoveToMap = (lands, syncCenterMap, onHandleHideLandCertificate) => {
    const {quadKey} = lands;
    const center = QuadKeyToLatLong(quadKey);
    syncCenterMap(center, quadKey.length - 2, quadKey);
    onHandleHideLandCertificate();
};


export const getCertificateAlertPopup = (isOpenCertificateImage, tile, onHandleHideCertificateImage, user, landInfo) => {
    const {status, info} = landInfo;
    //console.log('landInfo', landInfo)
    if (status && info) {
        const { purchaseDateFormat, latlng: { lat, lng } } = info;
        //const {purchaseDate} = lands[0];
        //const purchaseDateFormat = moment(purchaseDate).format('DD-MM-YYYY');
        return (
            <Modal isOpen={isOpenCertificateImage} backdrop="static"
                   className={`custom-modal modal--certificate`}>
                <span className="lnr lnr-cross lnr-custom-close" onClick={() => onHandleHideCertificateImage()}/>
                <div className='certificate'>
                    <div className='certificate-content'>
                        <div>
                            ID
                            : {user && user.wId && user.wId === info.user.wId ? info.user.wId : formatCharacter(info.user.wId)}
                        </div>
                        <div style={{display: 'flex'}}>
                            <div>LOCATION :</div>
                            <div>
                                Latitude {lat} <br/>
                                Longitude {lng}
                            </div>
                        </div>
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
const formatCharacter = (name) => {
    if(!name) return "";
    const nameLength = name && name.length;
    return name.slice(0, Math.ceil(nameLength * 0.3)).padEnd(nameLength, 'X');
};

const landCertificateInfoRender = (landInfo, user, syncCenterMap, onHandleHideLandCertificate, onHandleShowCertificateImage) => {
    if (landInfo) {

        const {status,info } = landInfo;
        //console.log('info', info)
        if(status){
            const {purchaseDateFormat , quadKey , purchasePrice , initialPrice,txid, latlng: { lat, lng } } = info;
            //const gps = QuadKeyToLatLong(quadKey);
            //const purchaseDateFormat = moment(purchaseDate).format('YYYY.MM.DD');
            return (
                <Fragment>
                    <div className='custom-modal-body'>
                        <div className='land-certificate-grid-container'>
                            <div className="cell bottom-border"><TranslateLanguage direct={'menuTab.myLand.certified.selectedLand'}/></div>
                            <div className="cell bottom-border"><TranslateLanguage direct={'menuTab.myLand.certified.content'}/></div>

                            <div className="cell top-padding"><TranslateLanguage direct={'menuTab.myLand.certified.ownInfo'}/></div>
                                {/*<div className="cell top-padding">{formatCharacter(info.user.wId) }</div>*/}
                             <div className="cell top-padding">{user.wId === info.user.wId ?info.user.wId : formatCharacter(info.user.wId)}</div>

                            <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.firstLandPrice'}/></div>
                            <div className="cell">{initialPrice.toLocaleString()} Blood</div>

                            <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.purchasedPrice'}/></div>
                            <div className="cell">{purchasePrice.toLocaleString()} Blood</div>

                            <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.datePurchase'}/></div>
                            <div className="cell">{purchaseDateFormat}</div>

                            <div className="cell bottom-padding"><TranslateLanguage direct={'menuTab.myLand.certified.hashInfo'}/></div>
                            {/* <div className="cell hash-key">{user._id === _id ? findLand && findLand.txid : 'xxxxxxxxxxxxxx'}</div> */}
                                <div className="cell hash-key">{formatCharacter(txid)}</div>

                            <div className="cell top-border top-padding"><TranslateLanguage direct={'menuTab.myLand.certified.cellInfo'}/></div>
                            <div className="cell top-border top-padding">
                                <div>Quadkey : {quadKey}</div>
                                <div><TranslateLanguage direct={'menuTab.myLand.certified.GPSCoor'}/> : {lat}(<TranslateLanguage direct={'menuTab.myLand.certified.latitude'}/>), 
                                                                                                        {lng}(<TranslateLanguage direct={'menuTab.myLand.certified.longitude'}/>)
                                </div>
                                <div className='img-quadkey-lammao'>
                                    <div className='google-map-lite'>
                                        <GoogleMap  center={[lat, lng]}
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
                                        <div className='cell-center' onClick={() => onHandleMoveToMap(info, syncCenterMap, onHandleHideLandCertificate)}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='certification-lammao' onClick={() => onHandleShowCertificateImage()}>
                        <img src={process.env.PUBLIC_URL + `/images/bloodland-ui/certificate-sample.png`} alt=''/>
                    </div>
                    <div className='custom-modal-footer-action-group' style={{height: '52px'}}>
                        <button onClick={() => onHandleHideLandCertificate()}>
                            <img src={process.env.PUBLIC_URL + `/images/game-ui/sm-close.svg`} alt=''/>
                            <div>
                                <TranslateLanguage direct={'menuTab.myLand.certified.closeBtn'}/>
                            </div>
                        </button>
                    </div>
                </Fragment>
            )
        }
    }
};

export const landCertificationPopup = (isOpenLandCertificate,landInfo , user,syncCenterMap, onHandleHideLandCertificate, onHandleShowCertificateImage) => {
    return (
        <Modal isOpen={isOpenLandCertificate} backdrop="static" className={`custom-modal modal--land-centificate`}>
            <div className='custom-modal-header'>
                <img src={loadingImage('/images/game-ui/tab2/nav3.svg')} alt=''/>
                <TranslateLanguage direct={'menuTab.myLand.certified'}/>
                <span className="lnr lnr-cross lnr-custom-close" onClick={() => onHandleHideLandCertificate()}/>
            </div>
            { !landInfo && !user ? <div>Loading</div> : 
            landCertificateInfoRender(landInfo,user, syncCenterMap, onHandleHideLandCertificate, onHandleShowCertificateImage)}
        </Modal>
    );
}
