import React from 'react';
import moment from 'moment';

export default {
    nutritionalDayRemaining,
    isTreeType,
    caculateTransformTime,
    waterLeftDay,
    waterLeftSecond,
    convertLocaleStringToSpecialString,
    convertNumberToStringWithCustomDecimal,
    getDefaultWaterLeftDay,
};

function nutritionalDayRemaining({ nutritionalEndTime1, nutritionalEndTime2 }){
    const nutritionalHourRemaining1 = nutritionalEndTime1 ? moment(nutritionalEndTime1).diff(moment(), "hours") : null;
    const nutritionalHourRemaining2 = nutritionalEndTime2 ? moment(nutritionalEndTime2).diff(moment(), "hours") : null;
    const nutritionalDayRemaining1 = nutritionalHourRemaining1 && nutritionalHourRemaining1 > 0 ? Math.ceil(nutritionalHourRemaining1/24) : null;
    const nutritionalDayRemaining2 = nutritionalHourRemaining2 && nutritionalHourRemaining2 > 0 ? Math.ceil(nutritionalHourRemaining1/24) : null;
    return { nutritionalDayRemaining1, nutritionalDayRemaining2 };
}

function isTreeType(value) {
    if (typeof value === 'undefined') return false;
    switch (value) {
        case 'tree':
            return true;
        case 'bud':
            return true;
        case 'blood-tree':
            return true;
        case 'garbage':
            return true;
        default:
            return false;
    }
}

function caculateTransformTime(seconds) {
    let days = Math.round(seconds / (60 * 60 * 24)) - 1;
    let hours = Math.round((seconds - days * (60 * 60 * 24)) / 3600);
    if (hours >= 24) {
        hours -= 24;
        days += 1;
    }
    return {
        days,
        hours
    }
}

function waterLeftDay(waterEndTime) {
    const now = new Date();
    const startDay = moment(now);
    const endDay = moment(waterEndTime);
    const duration = moment.duration(endDay.diff(startDay));
    const leftDay = Math.round(duration.asDays());
    return leftDay;
}

function waterLeftSecond(waterEndTime){
    const now = new Date();
    const startDay = moment(now);
    const endDay = moment(waterEndTime);
    const duration = moment.duration(endDay.diff(startDay));
    const leftSecond = Math.round(duration.asSeconds());
    return leftSecond;
}

function convertNumberToStringWithCustomDecimal(value,decimalDisplay, fontSize) {
    let customValue = (parseInt(value , 10)).toFixed(10).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    const splitVar = customValue.split(".");
    return (
        <span>{ splitVar[0]} { decimalDisplay > 0 && <span style={{ fontSize: `${fontSize}px` }}>.{splitVar[1].substring(0,decimalDisplay-1)}</span>}</span>
    )
}


function convertLocaleStringToSpecialString(value, fontSize) {
    let customValue = (parseInt(value , 10)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    const splitVar = customValue.split(".");
    return (
        <div>
            {splitVar[0]}<span style={{ fontSize: `${fontSize}px` }}>.{splitVar[1]}</span>
        </div>
    )
}

function getDefaultWaterLeftDay() {
    return 30;
}


//translate
export const onHandleTranslate = (t,direct, language , lng) => {
    return t(`${direct}.${language ? language : lng}.title`, {framework: "react-i18next"})
};



//First load location
const  centerMap = [37.566535, 126.9779692];
let ipLocation = [];
const showPosition = (position) => {
    ipLocation = [position.coords.latitude , position.coords.longitude]
};
export const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
};
export const onHandleGetFirstAccessLocation = () => {

    const {lat , lng } = localStorage;

    if((!lat || lat === 'null') && (!lng || lng === 'null')) {

        if(ipLocation && ipLocation.length !== 0) return ipLocation;
        else return centerMap
    }else{
        return [parseFloat(localStorage.lat), parseFloat(localStorage.lng)]
    }
};
