import React from 'react';
import {
    MessageBox,
    TranslateLanguage
} from '../../../../../../../../../helpers/importModule';

export const alertPopup = {
    noPopup: 'noPopup',
    noSelectionAlert: 'noSelectionAlert',
    noEnoughAmountUsingItemAlert: 'noEnoughAmountUsingItemAlert',
    usingItemConfirmAlert: 'usingItemConfirmAlert',
    usingItemSuccessAlert: 'usingItemSuccessAlert',
    usingItemUnsuccessAlert: 'usingItemUnsuccessAlert',
    closeConfirmAlert: 'closeConfirmAlert',
    goToShopConfirmAlert: 'goToShopConfirmAlert',
    noTreeSelection: 'noTreeSelection',
    loadingAlert: 'loadingAlert',
    enoughNutritionAlert: 'enoughNutritionAlert',
    leftWaterDeadAlert: 'leftWaterDeadAlert',
    noEnoughMoneyAlert: 'noEnoughMoneyAlert',
    landHaveBtaminTreeAlert: 'landHaveBtaminTreeAlert'
};


export const getNoSelectionAlert = ({modalAlertPopup,handleHideAlertPopup}) => {
    // console.log('getNoSelectionAlert 1')
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header =  <TranslateLanguage direct={'alert.nutrients.getNoSelectionAlert.header'}/>;
    const body =    <TranslateLanguage direct={'alert.nutrients.getNoSelectionAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};


export const getNoEnoughAmountUsingItemAlertPopup = ({modalAlertPopup,checkGoldBloodAndUseItem,handleHideAlertPopup,neededGoldBlood}) => {
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const sign = "blood"; //blood //success //error //delete //loading
    const yesBtn = () => checkGoldBloodAndUseItem(neededGoldBlood);
    const noBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.nutrients.getNoEnoughAmountUsingItemAlertPopup.header'}/>
    const $_blood= `<span class='text-highlight'>${neededGoldBlood}</span>`;
    const body = <TranslateLanguage direct={'alert.nutrients.getNoEnoughAmountUsingItemAlertPopup.body'} $_blood={$_blood} />;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} sign={sign} />;
};

export const getUsingItemConfirmAlertPopup = ({modalAlertPopup,useItem,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const yesBtn = () => useItem();
    const noBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.nutrients.getUsingItemConfirmAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.nutrients.getUsingItemConfirmAlertPopup.body'}/>
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};

export const getUsingItemSuccessAlert = ({modalAlertPopup,confirmSuccess}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => confirmSuccess();
    const header = <TranslateLanguage direct={'alert.nutrients.getUsingItemSuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.nutrients.getUsingItemSuccessAlert.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getUsingItemUnsuccessAlert = ({modalAlertPopup,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.nutrients.getUsingItemUnsuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.nutrients.getUsingItemUnsuccessAlert.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getNoTreeSelection = ({modalAlertPopup,handleHideAllPopup}) => {
    //console.log("getNoTreeSelection");
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header =
    <TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.notice'}/>
    const body = 
    <TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.selectLand'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getPlantTreeBefore = ({modalAlertPopup,handleHideAllPopup}) => {
    //console.log("getPlantTreeBefore");
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.notice'}/>
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.plantTreeBefore'}/>
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
export const getLoadingPopup = ({modalAlertPopup}) => {
    const modal = modalAlertPopup;
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'alert.loadingPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.loadingPopup.body'}/>
    return <MessageBox modal={modal} sign={sign} header={header} body={body} />
};

export const getEnoughNutritionAlert = ({modalAlertPopup,handleHideAllPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header = <TranslateLanguage direct={'alert.nutrients.getEnoughNutritionAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.nutrients.getEnoughNutritionAlert.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getLeftWaterDeadAlertPopup = ({modalAlertPopup,confirmSuccess}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => confirmSuccess();
    const header = <TranslateLanguage direct={'alert.nutrients.getLeftWaterDeadAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.nutrients.getLeftWaterDeadAlertPopup.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export const getNoEnoughMoneyAlertPopup = ({modalAlertPopup,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.nutrients.getNoEnoughMoneyAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.nutrients.getNoEnoughMoneyAlertPopup.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getLoading = ({modalPopup}) => {
    const modal = modalPopup;
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'alert.loadingPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.loadingPopup.body'}/>;
    return <MessageBox modal={modal} sign={sign} header={header} body={body} />
};