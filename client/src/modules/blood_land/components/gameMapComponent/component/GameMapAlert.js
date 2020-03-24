//alert function
import React from "react";
import {alertPopup} from "./A&PSchema";
import TranslateLanguage from './../../general/TranslateComponent';
import ItemTranslate from './../../general/ItemTranslate';
import MessageBox from './../../general/MessageBox';
import ReactDOMServer from 'react-dom/server';
import {getParticleLands} from "./GameMapFunction";


//trong cay o day khong duoc
export const getPlantingUnsuccessAlert = (modalAlertPopup, handleHideAlertPopup , onHandleGetQuadKeyBitamin) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        handleHideAlertPopup();
        onHandleGetQuadKeyBitamin()
    };
    const header = <TranslateLanguage direct={'alert.getPlantingUnsuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getPlantingUnsuccessAlert.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

//o day da trong cay
export const getAlreadyHaveTreeAlert = (modalAlertPopup, handleHideAlertPopup ) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        handleHideAlertPopup();
    };
    const header = <TranslateLanguage direct={'alert.cultivation.getTreesOnLandAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.cultivation.getTreesOnLandAlertPopup.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

//confirm de trong cay
export const getPlantTreeConfirm = (modalAlertPopup, handleHideAlertPopup, plantData, onMoveCharacterToMap, handleShowAlert, arrayTileEffect , onHandleGetQuadKeyBitamin) => {
    const quadKeys = arrayTileEffect && arrayTileEffect.map(tile => tile.quadKey);
    const {characterData: {quadKey, item: {itemId}}, user: {_id}} = plantData;
    let paramPlantTree = {
        userId: _id,
        items: itemId === 'T10' ? [{
            quadKey: quadKeys[0], itemId, quadKeys
        }] : [{
            quadKey, itemId
        }]
    };
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const yesBtn = () => {
        onMoveCharacterToMap(paramPlantTree);
        handleShowAlert(alertPopup.loadingPopup);
        onHandleGetQuadKeyBitamin()
    };
    const noBtn = () => {
        handleHideAlertPopup();
        onHandleGetQuadKeyBitamin()
    };
    const header = <TranslateLanguage direct={'alert.getPlantTreeConfirm.header'}/>
    const body = <TranslateLanguage direct={'alert.getPlantTreeConfirm.body'}/>
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
};

//confirm su dung item cho cay
export const getUsingItemForTreeConfirm = (modalAlertPopup, handleHideAlertPopup, usingItemData, onHandleUsingItemForTree, handleShowAlert, shops, language) => {
    const {itemData, objectId, user: {_id}} = usingItemData;
    const itemInfo = shops && shops.find(item => item.itemId === itemData.itemId);
    const itemDataParam = {userId: _id, itemId: itemData.itemId, trees: [objectId]};
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const yesBtn = () => {
        onHandleUsingItemForTree(itemDataParam);
        handleShowAlert(alertPopup.loadingPopup);
    }
    const noBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getUsingItemForTreeConfirm.header'}/>

    //itemSelected,name,descriptionForShop,descriptionForDetail,descriptionForInventory,decoClass
    const name = ReactDOMServer.renderToString(<ItemTranslate itemSelected={itemInfo} name={true}
                                                              decoClass='translation' language={language}/>);
    const $_item = `<span class='text-highlight'>${name}</span>`;
    const body = <TranslateLanguage direct={'alert.getUsingItemForTreeConfirm.body'} $_item={$_item}/>;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}
                       $_item={$_item}/>;
};

//confirm dung tien de su dung item
export const getUsingItemByBloodForTreeConfirm = (modalAlertPopup, handleHideAlertPopup, usingItemData, onHandleUsingItemForTree, handleShowAlert, shops, language) => {
    const {itemData, objectId, user: {_id}} = usingItemData;
    const itemDataParam = {userId: _id, itemId: itemData.itemId, trees: [objectId]};
    const itemFind = shops.find(item => item.itemId === itemData.itemId);
    const {price} = itemFind;
    const name = ReactDOMServer.renderToString(<ItemTranslate itemSelected={itemFind} name={true}
                                                              decoClass='translation' language={language}/>);

    const $_item = `<span class='text-highlight'>${name}</span>`;
    const $_price = `<span class='text-highlight'>${price}</span>`;

    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const sign = "blood"; //blood //success //error //delete //loading
    const yesBtn = () => {
        onHandleUsingItemForTree(itemDataParam);
        handleShowAlert(alertPopup.loadingPopup)
    };
    const noBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getUsingItemByBloodForTreeConfirm.header'}/>
    const body = <TranslateLanguage direct={'alert.getUsingItemByBloodForTreeConfirm.body'} $_item={$_item}
                                    $_price={$_price} language={language}/>;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}
                       sign={sign}/>;
};


//pop up trong cay thanh cong
export const getPlantingSuccessAlert = (modalAlertPopup, handleHideAlertPopup, getCharacterInventory, user , onHandleGetQuadKeyBitamin , getAreaObject  , getAreaLand , map) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        handleHideAlertPopup();
        onHandleGetQuadKeyBitamin();
        getCharacterInventory({userId: user._id})
        getParticleLands(map ,  getAreaObject  , user , getAreaLand);
    };
    const header = <TranslateLanguage direct={'alert.getPlantingSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.getPlantingSuccessAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

//su dung cay  khong thanh cong
export const getDroppingTreeUnsuccessAlert = (modalAlertPopup, handleHideAlertPopup, getCharacterInventory, user , onHandleGetQuadKeyBitamin , getAreaObject  , getAreaLand , map) => {

    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        onHandleGetQuadKeyBitamin();
        handleHideAlertPopup();
        getCharacterInventory({userId: user._id});
        getParticleLands(map ,  getAreaObject  , user , getAreaLand);
    };
    const header = <TranslateLanguage direct={'alert.getDroppingTreeUnsuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getDroppingTreeUnsuccessAlert.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

//su dung item thanh cong
const onHandleClickConfirmGetItemSuccessAlert = (handleHideAlertPopup, getItemInventoryByUserId, user, handleShowPopupForTree, itemPopupCultivation, usingItemData, getWalletInfo , map ,  getAreaObject ,  getAreaLand , getCharacterInventoryByUserId) => {
    const {wToken} = user;
    handleHideAlertPopup();
    getItemInventoryByUserId({userId: user._id});
    // Minh tri
    // Update param - 6/4/19
    // ========================================
    getWalletInfo({wToken});
    const id = (itemPopupCultivation && usingItemData.objectId) ? usingItemData.objectId : (itemPopupCultivation && !usingItemData.objectId) ? itemPopupCultivation : usingItemData.objectId;
    getCharacterInventoryByUserId({userId: user._id});
    getParticleLands(map ,  getAreaObject  , user , getAreaLand);
    usingItemData.itemData.itemId === ('I01' || 'I03') && handleShowPopupForTree({
        item: {_id: id},
        checkPopup: alertPopup.cultivationTreePopup
    })
};

export const getItemSuccessAlert = (modalAlertPopup, handleHideAlertPopup, getItemInventoryByUserId, user, handleShowPopupForTree, itemPopupCultivation, usingItemData, getWalletInfo, map ,  getAreaObject ,  getAreaLand ,getCharacterInventoryByUserId) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => onHandleClickConfirmGetItemSuccessAlert(
        handleHideAlertPopup,
        getItemInventoryByUserId,
        user,
        handleShowPopupForTree,
        itemPopupCultivation,
        usingItemData,
        getWalletInfo,
        map,
        getAreaObject ,  getAreaLand , getCharacterInventoryByUserId
    );
    const header = <TranslateLanguage direct={'alert.getItemSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.getItemSuccessAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

//su dung cay  khong thanh cong
export const getDroppingItemUnsuccessAlert = (modalAlertPopup, handleHideAlertPopup) => {

    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getDroppingItemUnsuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getDroppingItemUnsuccessAlert.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

//limit using item nutrition
export const getUseLimitedItemAlert = (modalAlertPopup, handleHideAlertPopup) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getUseLimitedItemAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getUseLimitedItemAlert.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;

};

//Loading
export const loadingPopup = (isAlertOpen) => {

    const modal = isAlertOpen;
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'alert.loadingPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.loadingPopup.body'}/>;
    return <MessageBox modal={modal} sign={sign} header={header} body={body}/>;
};


//check for sale status alert for item
export const checkForSaleStatusAlertForItemPopup = (isAlertOpen, handleHideAlertPopup) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.checkForSaleStatusAlertForItemPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.checkForSaleStatusAlertForItemPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

//Alert check tree already dead
export const getLeftWaterDeadAlertPopup = (checkTreeAlreadyExistAlertStatus, handleHidePopup) => {
    const modal = checkTreeAlreadyExistAlertStatus;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'alert.getLeftWaterDeadAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.getLeftWaterDeadAlertPopup.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;

};

//reacharge popup alert
export const getRechargeAlertPopup = (isAlertOpen, handleHidePopup) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'alert.getRechargeAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.getRechargeAlertPopup.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

//check for sale status alert for character
export const checkForSaleStatusAlertForTreePopup = (isAlertOpen, handleHideAlertPopup, onHandleGetQuadKeyBitamin) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        onHandleGetQuadKeyBitamin();
        handleHideAlertPopup()
    };
    const header = <TranslateLanguage direct={'alert.checkForSaleStatusAlertForItemPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.checkForSaleStatusAlertForItemPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

//alert plant tree first -> nutrient
export const getPlantTreeBeforeNutrient = (modalAlertPopup,handleHideAllPopup) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.notice'}/>
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.plantTreeBefore'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

//alert plant tree first -> removal
export const getPlantTreeBeforeShovel = (modalAlertPopup,handleHideAllPopup) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.notice'}/>
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.plantTreeBefore'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

//alert plant tree first -> water
export const getPlantTreeBeforeDroplet = (modalAlertPopup,handleHideAllPopup) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.water.notice'}/>
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.water.plantTreeBefore'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

