import React from 'react';
import ShopComponent from "../../../veticalBarComponent/Shop/index"
import MessageBox from './../../../general/MessageBox';
export const alertPopup = {
    noPopup: 'noPopup',
    noSelectedLandAlert: 'noSelectedLandAlert',
    getNoEnoughTreeAlert: 'getNoEnoughTreeAlert',
    getShop: 'getShop'
};


//no selected land
export const getNoSelectionAlert = (isAlertOpen , handleHidePopup) => {
    const modal = isAlertOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = '알림';
    const body = '나무를 심을 랜드를 선택해주세요';
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

//loading
export const getInitLoadingPopup = (isAlertOpen) => {
    
    const modal = isAlertOpen;
    const sign = "loading"; //blood //success //error //delete //loading
    const header = '알림';
    const body = '로딩중입니다 잠시만 기다려주세요';
    return <MessageBox modal={modal} sign={sign} header={header} body={body} />
};
//not enough amount
export const getNoEnoughTreeAlert = (isAlertOpen , handleHidePopup , onHandleShowPopup) => {
    const modal = isAlertOpen;
    const mode = "question"; //question //info //customize
    const yesBtn = () => onHandleShowPopup(alertPopup.getShop);
    const noBtn = () => handleHidePopup();
    const header = '알림';
    const body = '아이템 수량이 부족합니다.<br/>상점으로 이동 하시겠습니까?'
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};

//get shop
export const getShop = (isAlertOpen , handleHidePopup) => {
    return (
        <ShopComponent isOpen={isAlertOpen} handleHidePopup={handleHidePopup}/>
    )
};