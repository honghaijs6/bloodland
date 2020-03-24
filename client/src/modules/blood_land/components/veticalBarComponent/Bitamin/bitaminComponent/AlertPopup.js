import React  from 'react';
import TranslateLanguage from "../../../general/TranslateComponent";
import MessageBox from './../../../general/MessageBox';

export const alertPopup = {
    noPopup: 'noPopup',
    loadingPopup: 'loadingPopup',
    getExchangeConfirmAlert: 'getExchangeConfirmAlert',
    getExchangeSuccessAlert: 'getExchangeSuccessAlert',
    getExchangeUnSuccessAlert: 'getExchangeUnSuccessAlert',
    getNotEnoughLimitValueAlert: 'getNotEnoughLimitValueAlert'
};


export const getExchangeConfirmAlert = (isAlertOpen,handleHidePopup,exchangeBitamin) => {
    const modal = isAlertOpen;
    const mode = "question"; //question //info //customize
    const yesBtn = () => exchangeBitamin();
    const noBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'bitamin.bitaminExchange.alert.getExchangeConfirmAlert.header'}/>
    const body = <TranslateLanguage direct={'bitamin.bitaminExchange.alert.getExchangeConfirmAlert.body'}/>
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};

export const loadingPopup = (isAlertOpen) => {
    const modal  = isAlertOpen;
    const sign   = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.alert.loadingPopup.header'}/>;
    const body   = <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.alert.loadingPopup.body'}/>;
    return <MessageBox modal={modal} sign={sign} header={header} body={body} />
};


export const getExchangeSuccessAlert = (isAlertOpen , handleHidePopup) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'bitamin.bitaminExchange.alert.getExchangeSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'bitamin.bitaminExchange.alert.getExchangeSuccessAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getExchangeUnSuccessAlert = (isAlertOpen , handleHidePopup) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'bitamin.bitaminExchange.alert.getExchangeUnSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'bitamin.bitaminExchange.alert.getExchangeUnSuccessAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getNotEnoughLimitValueAlert = (isAlertOpen , handleHidePopup) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'bitamin.bitaminExchange.alert.getNotEnoughLimitValueAlert.header'}/>;
    const body = <TranslateLanguage direct={'bitamin.bitaminExchange.alert.getNotEnoughLimitValueAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};