import React  from 'react';
import TranslateLanguage from "../../../general/TranslateComponent";
import MessageBox from './../../../general/MessageBox';

export const alertPopup = {
    noPopup: 'noPopup',
    getTransferConfirmAlert: 'getTransferConfirmAlert',
    loadingPopup: 'loadingPopup',
    getTransferSuccessAlert: 'getTransferSuccessAlert',
    getTransferUnSuccessAlert: 'getTransferUnSuccessAlert',
    getNotEnoughLimitValueAlert: 'getNotEnoughLimitValueAlert'
};


const translateCoinToBlood = (goldBloodValue , getWithdraw , user , onHandleShowPopup) => {
    const param = {
        wToken: user.wToken,
        amount: goldBloodValue
    };
    getWithdraw(param);
    onHandleShowPopup({status: alertPopup.loadingPopup , goldBloodValue})
};

export const getTransferConfirmAlert = (getTransferConfirmAlertStatus, onHandleClosePopup , goldBloodValue , getWithdraw ,user , onHandleShowPopup) => {
    const modal = getTransferConfirmAlertStatus;
    const mode = "question"; //question //info //customize
    const yesBtn = () => translateCoinToBlood(goldBloodValue , getWithdraw , user , onHandleShowPopup);
    const noBtn = () => onHandleClosePopup();
    const header = <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.alert.getTransferConfirmAlert.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.alert.getTransferConfirmAlert.body'} $_gold={`<span class='text-highlight'>${goldBloodValue}</span>`} />;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};

export const loadingPopup = (isAlertOpen) => {
    const modal = isAlertOpen;
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.alert.loadingPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.alert.loadingPopup.body'}/>;
    return <MessageBox modal={modal} sign={sign} header={header} body={body} />
};


export const getTransferSuccessAlert = (getTransferSuccessAlertStatus , handleHidePopup) => {
    const modal = getTransferSuccessAlertStatus;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.alert.getTransferSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.alert.getTransferSuccessAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getTransferUnSuccessAlert = (getTransferUnSuccessAlertStatus , handleHidePopup) => {
    const modal = getTransferUnSuccessAlertStatus;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.alert.getTransferUnSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.alert.getTransferUnSuccessAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getNotEnoughLimitValueAlert = (getNotEnoughLimitValueAlertStatus , handleHidePopup) => {
    const modal = getNotEnoughLimitValueAlertStatus;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.alert.getTransferUnSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'validation.notEnoughLimitValue'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};