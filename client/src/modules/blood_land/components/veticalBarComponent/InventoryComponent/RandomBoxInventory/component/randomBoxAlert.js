import React from "react";
import { usingRandomBoxImage} from "../../asset";
import Draggable from 'react-draggable';
import {getShopImgByItemId} from "../../../../../../../helpers/thumbnails";
import TranslateLanguage from './../../../../general/TranslateComponent';
import MessageBox from './../../../../general/MessageBox';
import ItemTranslate from "../../../../general/ItemTranslate";
import ReactDOMServer from 'react-dom/server';


const randomBoxAlert = {
    noPopup: 'noPopup',
    usingRandomBoxPopup: 'usingRandomBoxPopup',
    usingOneRandomBoxConfirmAlert: 'usingOneRandomBoxConfirmAlert',
    usingAllRandomBoxConfirmAlert: 'usingAllRandomBoxConfirmAlert',
    loadingPopup: 'loadingPopup',
    getOpenRandomBoxUnSuccessAlert: 'getOpenRandomBoxUnSuccessAlert'
};

const randomBoxStyle = {background: `url(${usingRandomBoxImage}) center no-repeat`};


export const loadingPopup = (loadingPopupStatus) => {
    const modal = loadingPopupStatus;
    const sign = "loading"; //blood //success //error //delete //loading
    const header =  <TranslateLanguage direct={'menuTab.randomBox.alert.loadingPopup.header'}/>;
    const body =    <TranslateLanguage direct={'menuTab.randomBox.alert.loadingPopup.body'}/>;
    return <MessageBox modal={modal} sign={sign} header={header} body={body} />
};


const getGiveGifts = (onHandleShowPopup, item) => {
    const openOneBox = {
        currentPopup: randomBoxAlert.usingOneRandomBoxConfirmAlert,
        item
    };
    const openAllBox = {
        currentPopup: randomBoxAlert.usingAllRandomBoxConfirmAlert,
        item
    };
    return (
        <div className='using-items'>
            <div className='item-detail-title'
                 style={randomBoxStyle}>

                <TranslateLanguage direct={'menuTab.randomBox.availableItem'}/>
            </div>
            <div className='item-detail-using-items'>
                {/* item here */}
                <button className='item-btn' onClick={() => onHandleShowPopup(openOneBox)}>
                    <TranslateLanguage direct={'menuTab.randomBox.open1Box'}/>
                </button>
                <button className='item-btn' onClick={() => onHandleShowPopup(openAllBox)}>
                    <TranslateLanguage direct={'menuTab.randomBox.openAll'}/>
                </button>
            </div>
        </div>
    )
};

//popup choose option using RandomBox
export const usingRandomBoxPopup = (item, onHandleHidePopup, onHandleShowPopup,language) => {
    const {randomBoxId} = item;
    return (
        <Draggable handle=".random-box-detail-panels" bounds="parent"
                   defaultPosition={{x: window.innerWidth / 3, y: window.innerHeight / 5}}>
            <div className='random-box-detail-panels'>
                <div className='random-box-detail-panel'>
                    <span className="lnr lnr-cross lnr-custom-close-detail-popup" onClick={() => onHandleHidePopup()}/>
                    <div className='item-detail-1'>
                        <div className='detail-img'>
                            <div className='item-detail-title' style={randomBoxStyle}>
                                <ItemTranslate itemSelected={item} name={true} decoClass='translation'  language={language} />
                            </div>
                            <img src={getShopImgByItemId(randomBoxId)} alt={randomBoxId}/>
                        </div>
                        {getGiveGifts(onHandleShowPopup, item)}
                    </div>
                    <div className='item-detail-2'>
                        <span className='detail2'>
                            <ItemTranslate itemSelected={item} descriptionForDetail={true} decoClass='translation'  language={language} />
                        </span>
                    </div>
                </div>
            </div>
        </Draggable>

    );
};
//alert confirm using one box
export const getUsingOneRandomBoxConfirmAlert = (usingOneRandomBoxConfirmAlertStatus, onHandleHidePopup, item, onHandleOpenRandomBox , onHandleShowPopup,language) => {
    const {randomBoxId, userId} = item;

    const name = ReactDOMServer.renderToString(<ItemTranslate itemSelected={item} name={true} decoClass='translation'  language={language} />);

    const paramOpenRandomBox = {
        userId, randomBoxId, openAll: false
    };
    const modal = usingOneRandomBoxConfirmAlertStatus;
    const mode = "question"; //question //info //customize
    const yesBtn = () => {
        onHandleOpenRandomBox(paramOpenRandomBox);
        onHandleShowPopup({currentPopup: randomBoxAlert.loadingPopup})
    };
    const noBtn = () => onHandleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.randomBox.alert.getUsingOneRandomBoxConfirmAlert.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.randomBox.alert.getUsingOneRandomBoxConfirmAlert.body'} $_item={`<span class='text-highlight'>${name}</span>`} />;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};

//alert confirm open all box
export const getUsingAllRandomBoxConfirmAlert = (usingAllRandomBoxConfirmAlertStatus, onHandleHidePopup, item, onHandleOpenRandomBox , onHandleShowPopup) => {
    const {randomBoxId, userId} = item;
    const paramOpenRandomBox = {
        userId, randomBoxId, openAll: true
    };

    const modal = usingAllRandomBoxConfirmAlertStatus;
    const mode = "question"; //question //info //customize
    const yesBtn = () => {
        onHandleOpenRandomBox(paramOpenRandomBox);
        onHandleShowPopup({currentPopup: randomBoxAlert.loadingPopup})
    };
    const noBtn = () => onHandleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.randomBox.alert.getUsingAllRandomBoxConfirmAlert.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.randomBox.alert.getUsingAllRandomBoxConfirmAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};


//OPen random box un success
export const getOpenRandomBoxUnSuccessAlert = (isHandleOpen, onHandleHidePopup) => {
    const modal = isHandleOpen;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => onHandleHidePopup();
    const header = <TranslateLanguage direct={'menuTab.randomBox.alert.getOpenRandomBoxUnSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.randomBox.alert.getOpenRandomBoxUnSuccessAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};