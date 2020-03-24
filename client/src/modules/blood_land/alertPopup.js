import TranslateLanguage from "./components/general/TranslateComponent";
import React from "react";
import MessageBox from './components/general/MessageBox';


export const alertPopup = {
    chromeDetectedAlert: "chromeDetectedAlert",
    noPopup: "noPopup",
    wIdAlert: "wIdAlert",
    tokenErrorAlert: 'tokenErrorAlert'
};
export const getTokenErrorAlert = (statusTokenExpiredAlert) => {
    const modal = statusTokenExpiredAlert;
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => this.handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getTokenErrorAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.getTokenErrorAlert.body'}/>;
    return <MessageBox modal={modal} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getChromeDetectAlert = (chromeDetectedAlertStatus) => {
    const modal = chromeDetectedAlertStatus;
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => this.handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getWIdExistAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.getChromeDetectAlert.body'}/>;
    return <MessageBox modal={modal} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getWIdExistAlert = (wIdExistAlert) => {
    const modal = wIdExistAlert;
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => window.location.href = 'https://wallet.blood.land';
    const header = <TranslateLanguage direct={'alert.getWIdExistAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.getWIdExistAlert.body'}/>;
    return <MessageBox modal={modal} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};