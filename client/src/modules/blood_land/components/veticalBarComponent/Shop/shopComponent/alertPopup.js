import React from 'react';
import TranslateLanguage from './../../../general/TranslateComponent';
import MessageBox from '../../../general/MessageBox';
import ReactDOMServer from 'react-dom/server';
import ItemTranslate from '../../../general/ItemTranslate';


export const alertPopup = {
    noPopup: 'noPopup',
    alertQuantity: 'alertQuantity',
    alertBloodRecharge: 'alertBloodRecharge',
    alertConfirmPurchaseItem: 'alertConfirmPurchaseItem',
    loadingPopup: 'loadingPopup',
    buyItemShopSuccess: 'buyItemShopSuccess',
    buyItemShopUnSuccess: 'buyItemShopUnSuccess',
    limitBuyItemPopup: 'limitBuyItemPopup',
    buyAllAmountSuccess : 'buyAllAmountSuccess'
};

export const getQuantityAlertPopup = (handleHidePopup , isAlertOpen) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.shop.alert.getQuantityAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.shop.alert.getQuantityAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};


export const getRechargeAlertPopup = (handleHidePopup,isAlertOpen) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.shop.alert.getRechargeAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.shop.alert.getRechargeAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getPurchaseConfirmPopup = (handleHidePopup,isAlertOpen , itemSelected , handleConfirmBuyItem,language) => {
    const modal = isAlertOpen;
    const mode = "question"; //question //info //customize
    const yesBtn = () => handleConfirmBuyItem();
    const noBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseConfirmPopup.header'}/>;
    const item = ReactDOMServer.renderToString(<ItemTranslate itemSelected={itemSelected} name={true} decoClass='translation'  language={language} />);
    const $_item = `<span class='text-highlight'>${item}</span>`;
    const body = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseConfirmPopup.body'} $_item={$_item} />;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};

export const loadingPopup = (handleHidePopup,isAlertOpen) => {
    const modal = isAlertOpen;
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'menuTab.shop.alert.loadingPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.shop.alert.loadingPopup.body'}/>;
    return <MessageBox modal={modal} sign={sign} header={header} body={body} />
};

export const getPurchaseSuccessAlertPopup = (handleHidePopup,isAlertOpen) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseSuccessAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseSuccessAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getPurchaseUnSuccessAlertPopup = (handleHidePopup,isAlertOpen) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseUnSuccessAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseUnSuccessAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getLimitBuyItemPopup = (handleHidePopup,isAlertOpen) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.shop.alert.getLimitBuyItemPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.shop.alert.getLimitBuyItemPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};


export const getBuyAllAmountPopup = (handleHidePopup,isAlertOpen,canBuyAmount,buyQuantity) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.shop.alert.getBuyAllAmountPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.shop.alert.getBuyAllAmountPopup.body'} $_selected={canBuyAmount} $_total={buyQuantity} />;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}
