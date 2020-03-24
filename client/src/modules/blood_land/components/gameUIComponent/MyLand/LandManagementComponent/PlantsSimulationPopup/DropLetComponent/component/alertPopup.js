import React from 'react';
import {
    MessageBox,
    TranslateLanguage
} from '../../../../../../../../../helpers/importModule';

export const alertPopup = {
    noPopup: 'noPopup',
    noSelectionAlert: 'noSelectionAlert',
    usingItemConfirmAlert: 'usingItemConfirmAlert',
    usingItemSuccessAlert: 'usingItemSuccessAlert',
    usingItemUnsuccessAlert: 'usingItemUnsuccessAlert',
    noTreeSelection: 'noTreeSelection',
    loadingAlert: 'loadingAlert',
    goToShopConfirmAlert: 'goToShopConfirmAlert',
    leftWaterDeadAlert: 'leftWaterDeadAlert',
    getPlantTreeBefore: 'getPlantTreeBefore',
    landHaveBtaminTreeAlert: 'landHaveBtaminTreeAlert'
};

export const getNoSelectionAlert = ({modalAlertPopup,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header =  <TranslateLanguage direct={'alert.droplet.getNoSelectionAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.droplet.getNoSelectionAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getUsingItemConfirmAlertPopup = ({modalAlertPopup,useItem,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const yesBtn = () => useItem();
    const noBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.droplet.getUsingItemConfirmAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.droplet.getUsingItemConfirmAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};

export const getUsingItemSuccessAlert = ({modalAlertPopup,confirmSuccess}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => confirmSuccess();
    const header = <TranslateLanguage direct={'alert.droplet.getUsingItemSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.droplet.getUsingItemSuccessAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getUsingItemUnsuccessAlert = ({modalAlertPopup,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.droplet.getUsingItemUnsuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.droplet.getUsingItemUnsuccessAlert.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getNoTreeSelection = ({modalAlertPopup,handleHideAllPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.water.notice'}/>;
    const body =<TranslateLanguage direct={'menuTab.myLand.landOwned.water.selectLand'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};
export const getLandHaveBtaminTree = ({modalAlertPopup,handleHideAllPopup}) => {
    //console.log("getPlantTreeBefore");
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header =  <TranslateLanguage direct={'alert.getPlantingUnsuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getPlantingUnsuccessAlert.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getPlantTreeBefore = ({modalAlertPopup,handleHideAllPopup}) => {
    //console.log("getPlantTreeBefore");
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.water.notice'}/>
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.water.plantTreeBefore'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getLoadingPopup = ({modalAlertPopup}) => {
    const modal = modalAlertPopup;
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'alert.loadingPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.loadingPopup.body'}/>;
    return <MessageBox modal={modal} sign={sign} header={header} body={body} />
};

export const getLeftWaterDeadAlertPopup = ({modalAlertPopup,confirmSuccess}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => confirmSuccess();
    const header = <TranslateLanguage direct={'alert.droplet.getLeftWaterDeadAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.droplet.getLeftWaterDeadAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};