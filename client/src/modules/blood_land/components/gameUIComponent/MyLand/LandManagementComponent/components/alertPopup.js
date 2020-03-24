import React from 'react';
import {
    MessageBox,
    TranslateLanguage
} from '../../../../../../../helpers/importModule';

export const alertPopup = {
    noPopup: 'noPopup',
    deletedCateAlert: 'deletedCateAlert',
    deletedCateSuccessAlert: 'deletedCateSuccessAlert',
    addFolderAlert: 'addFolderAlert',
    errorInputAlert: 'errorInputAlert',
    noSelectedLandToSellAlert: 'noSelectedLandToSellAlert',
    noSelectedLandToDeleteAlert: 'noSelectedLandToDeleteAlert'
};

export const getErrorInputAlertPopup = ({modalAlertPopup,handleHideAlertPopup}) =>{
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = "알림";
    const body = "올바른 폴더명을 입력해주세요."
    //  Vui lòng nhập tên thư mục chính xác
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

export const getDeletedCateAlertPopup = ({modalAlertPopup,confirmDeleteSelectedCat,handleHideAlertPopup}) =>{
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const sign = "delete"; //blood //success //error //delete //loading
    const yesBtn = () => confirmDeleteSelectedCat();
    const noBtn = () => handleHideAlertPopup();
    const header =
        <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle.delete'}/>
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle.confirmDelete'}/>
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}
                       sign={sign}/>;
};

export const getDeletedCateSuccessAlertPopup = ({modalAlertPopup,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getDeletedCateSuccessAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.getDeletedCateSuccessAlertPopup.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

export const getNoSelectedLandToSellAlertPopup = ({modalAlertPopup,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getNoSelectedLandToSellAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.getNoSelectedLandToSellAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

export const getNoSelectedLandToDeleteAlertPopup = ({modalAlertPopup,handleHideAlertPopup}) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getNoSelectedLandToSellAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle.selectFolder.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};