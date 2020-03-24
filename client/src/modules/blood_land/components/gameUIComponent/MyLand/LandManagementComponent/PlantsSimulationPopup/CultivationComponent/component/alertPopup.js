import React from 'react';
import {
    MessageBox,
    TranslateLanguage
} from '../../../../../../../../../helpers/importModule';

export const alertPopup = {
    noPopup: 'noPopup',
    noTreeSelection:'noTreeSelection',
    noSelectionAlert: 'noSelectionAlert',
    noEnoughAmountUsingItemAlert: 'noEnoughAmountUsingItemAlert',
    usingItemConfirmAlert: 'usingItemConfirmAlert',
    usingItemSuccessAlert: 'usingItemSuccessAlert',
    usingItemUnsuccessAlert: 'usingItemUnsuccessAlert',
    closeConfirmAlert: 'closeConfirmAlert',
    treesOnLandAlert:'getTreesOnLandAlert',
    loadingAlert: 'loadingAlert',
};


export const getInitLoadingPopup = ({modalPopup}) => {
    const modal = modalPopup;
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'alert.loadingPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.loadingPopup.body'}/>;
    return <MessageBox modal={modal} sign={sign} header={header} body={body} />;
};

export const getTreesOnLandAlertPopup = ({modalAlertPopup,handleHideAllPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header = <TranslateLanguage direct={'alert.cultivation.getTreesOnLandAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.cultivation.getTreesOnLandAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getNoTreeSelection = ({modalAlertPopup,handleHideAllPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.notice'}/>;
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.selectLand'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getUsingItemConfirmAlertPopup = ({modalAlertPopup,plantTreeApi,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const yesBtn = () => plantTreeApi();
    const noBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.cultivation.getUsingItemConfirmAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.cultivation.getUsingItemConfirmAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
}

export const getNoEnoughAmountUsingItemAlertPopup = ({modalAlertPopup,goToShop,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const yesBtn = () => goToShop();
    const noBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.cultivation.getNoEnoughAmountUsingItemAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.cultivation.getNoEnoughAmountUsingItemAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};

export const getNoSelectionAlert = ({noTreeSelect,modalAlertPopup,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getNoSelectionAlert.header'}/>;
    const body = noTreeSelect ? <TranslateLanguage direct={'alert.getNoSelectionAlert.selectTreeBody'}/> : <TranslateLanguage direct={'alert.getNoSelectionAlert.selectLandBody'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export const getUsingItemSuccessAlert = ({modalAlertPopup,confirmSuccess}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => confirmSuccess();
    const header = <TranslateLanguage direct={'alert.cultivation.getUsingItemSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.cultivation.getUsingItemSuccessAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export const getUsingItemUnsuccessAlert = ({modalAlertPopup,handleHideAlertPopup}) => {

    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.cultivation.getUsingItemUnsuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.cultivation.getUsingItemUnsuccessAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export const getLoadingPopup = ({modalAlertPopup}) => {
    const modal = modalAlertPopup;
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'alert.loadingPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.loadingPopup.body'}/>;
    return <MessageBox modal={modal} sign={sign} header={header} body={body} />
};