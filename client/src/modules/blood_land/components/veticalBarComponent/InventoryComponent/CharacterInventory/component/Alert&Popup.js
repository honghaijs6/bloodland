import MessageBox from "../../../../general/MessageBox";
import TranslateLanguage from "../../../../../components/general/TranslateComponent";
import React from "react";


export const alertPopup = {
    noPopup: 'noPopup',
    loadingPopup: 'loadingPopup',
    combineTreePopup: 'combineTreePopup',
    getConfirmCombineSinglePopup: 'getConfirmCombineSinglePopup',
    getConfirmCombineMultiPopup: 'getConfirmCombineMultiPopup',
    notEnoughMinimumMoneyPopup: 'notEnoughMinimumMoneyPopup',
    getSingleCombineTreeResultPopup: 'getSingleCombineTreeResultPopup',
    getMultiCombineTreeResultPopup: 'getMultiCombineTreeResultPopup',
    getCombineFailAlert: 'getCombineFailAlert',
    getNotHaveAnyTreeInventoryAlert: 'getNotHaveAnyTreeInventoryAlert'
};

//loading
export const loadingPopup = (isAlertOpen) => {
    const modal = isAlertOpen;
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'menuTab.shop.alert.loadingPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.shop.alert.loadingPopup.body'}/>;
    return <MessageBox modal={modal} sign={sign} header={header} body={body} />
};

//getConfirmCombineSinglePopup
export const getConfirmCombineSinglePopup = (handleHidePopup,isAlertOpen , handleConfirmCombineSingle ,language) => {
    const modal = isAlertOpen;
    const mode = "question"; //question //info //customize
    const yesBtn = () => handleConfirmCombineSingle();
    const noBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'treeCombine.alert.getConfirmCombineSinglePopup.header'} />;
    const body = <TranslateLanguage direct={'treeCombine.alert.getConfirmCombineSinglePopup.body'} />;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};

//getConfirmCombineMultiPopup
export const getConfirmCombineMultiPopup = (handleHidePopup,isAlertOpen , itemSelected , handleConfirmBuyItem,language) => {
    const modal = isAlertOpen;
    const mode = "question"; //question //info //customize
    const yesBtn = () => handleConfirmBuyItem();
    const noBtn = () => handleHidePopup();
    // const header = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseConfirmPopup.header'}/>;
    // const body = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseConfirmPopup.body'} />;
    const header = <TranslateLanguage direct={'treeCombine.alert.getConfirmCombineMultiPopup.header'} />;
    const body = <TranslateLanguage direct={'treeCombine.alert.getConfirmCombineMultiPopup.body'} />;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};

// not enough minimum money required
export const getNotEnoughMinimumMoneyAlert = (handleHidePopup,isAlertOpen) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'treeCombine.alert.getNotEnoughMinimumMoneyAlert.header'} />;
    const body = <TranslateLanguage direct={'treeCombine.alert.getNotEnoughMinimumMoneyAlert.body'} />;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

// dont have any tree in inventory
export const getNotHaveTreeInventoryAlert = (handleHidePopup,isAlertOpen) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'treeCombine.alert.getNotHaveTreeInventoryAlert.header'} />;
    const body = <TranslateLanguage direct={'treeCombine.alert.getNotHaveTreeInventoryAlert.body'} />;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};


// combine fail
export const getCombineFailAlert = (handleHidePopup,isAlertOpen) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header =  <TranslateLanguage direct={'treeCombine.alert.getCombineFailAlert.header'} />;
    const body = <TranslateLanguage direct={'treeCombine.alert.getCombineFailAlert.body'} />;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

