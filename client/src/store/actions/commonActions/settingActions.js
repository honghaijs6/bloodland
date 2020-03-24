import {userService} from "../../services/commonServices/userService";

export const SET_LAND_SHOW_INFO_SUCCESS = 'SET_LAND_SHOW_INFO_SUCCESS';
export const SET_LAND_SHOW_INFO_FAILURE = 'SET_LAND_SHOW_INFO_FAILURE';

export const SET_BACKGROUND_MUSIC_SUCCESS = 'SET_BACKGROUND_MUSIC_SUCCESS';
export const SET_BACKGROUND_MUSIC_FAILURE = 'SET_BACKGROUND_MUSIC_FAILURE';

export const SET_EFFECT_MUSIC_SUCCESS = 'SET_EFFECT_MUSIC_SUCCESS';
export const SET_EFFECT_MUSIC_FAILURE = 'SET_EFFECT_MUSIC_FAILURE';

export const SET_SETTING_SUCCESS = 'SET_SETTING_SUCCESS';
export const SET_SETTING_FAILURE = 'SET_SETTING_FAILURE';

export const GET_SETTING_SUCCESS = 'GET_SETTING_SUCCESS';
export const GET_SETTING_FAILURE = 'GET_SETTING_FAILURE';

export const SET_LANGUAGE_SUCCESS = 'SET_LANGUAGE_SUCCESS';
export const SET_LANGUAGE_FAILURE = 'SET_LANGUAGE_FAILURE';

export const GAME_MODE = 'GAME_MODE';
export const SHOW_CHARACTER = 'SHOW_CHARACTER';
export const SHOW_ITEM = 'SHOW_ITEM';
export const MAP_EXPANDING = 'MAP_EXPANDING';

export const settingActions = {
    setLandShowInfo,
    setBgMusic,
    setEffMusic,
    getSetting,
    setSetting,
    setLanguage,
    toggleGameMode,
    showCharacter,
    showItem,
    expandMap
};


function getSetting(param) {
    return dispatch => {
        userService.getSetting(param)
            .then(
                setting => {
                    dispatch(success(setting));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
    function success(setting) { return { type: GET_SETTING_SUCCESS, setting } }
    function failure(error) { return { type: GET_SETTING_FAILURE, error } }
}

function setSetting(param) {
    return dispatch => {
        userService.setSetting(param)
            .then(
                setting => {
                    dispatch(success(setting));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(setting) { return { type: SET_SETTING_SUCCESS, setting } }
    function failure(error) { return { type: SET_SETTING_FAILURE, error } }
}


function setLandShowInfo(param) {
    return dispatch => {
        userService.setLandShowInfo(param)
            .then(
                land => {
                    dispatch(success(land));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(land) { return { type: SET_LAND_SHOW_INFO_SUCCESS, land } }
    function failure(error) { return { type: SET_LAND_SHOW_INFO_FAILURE, error } }
}

function setBgMusic(param) {
    return dispatch => {
        userService.setBgMusic(param)
            .then(
                bgMusic => {
                    dispatch(success(bgMusic));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(bgMusic) { return { type: SET_BACKGROUND_MUSIC_SUCCESS, bgMusic } }
    function failure(error) { return { type: SET_BACKGROUND_MUSIC_FAILURE, error } }
}


function setEffMusic(param) {
    return dispatch => {
        userService.setEffMusic(param)
            .then(
                effMusic => {
                    dispatch(success(effMusic));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(effMusic) { return { type: SET_EFFECT_MUSIC_SUCCESS, effMusic } }
    function failure(error) { return { type: SET_EFFECT_MUSIC_FAILURE, error } }
}


function setLanguage(param) {
    return dispatch => {
        userService.setLanguage(param)
            .then(
                setting => {
                    dispatch(success(setting));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(language) { return { type: SET_LANGUAGE_SUCCESS, language } }
    function failure(error) { return { type: SET_LANGUAGE_FAILURE, error } }
}

function toggleGameMode(mode) {
    return { type: GAME_MODE, mode }
}

function showCharacter(displayChar) {
    return { type: SHOW_CHARACTER, displayChar }
}

function showItem(displayItem) {
    return { type: SHOW_ITEM, displayItem }
}

function expandMap(expand) {
    return { type: MAP_EXPANDING, expand }
}
