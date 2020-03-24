import {
    GET_SETTING_SUCCESS,
    GET_SETTING_FAILURE,
    SET_LAND_SHOW_INFO_SUCCESS,
    SET_LAND_SHOW_INFO_FAILURE,
    SET_BACKGROUND_MUSIC_SUCCESS,
    SET_BACKGROUND_MUSIC_FAILURE,
    SET_EFFECT_MUSIC_SUCCESS,
    SET_EFFECT_MUSIC_FAILURE,
    SET_SETTING_SUCCESS,
    SET_SETTING_FAILURE,
    SET_LANGUAGE_SUCCESS,
    SET_LANGUAGE_FAILURE,
    GAME_MODE,
    SHOW_CHARACTER,
    SHOW_ITEM,
    MAP_EXPANDING
} from "../../actions/commonActions/settingActions";



const initState = {
    bgMusic: { volume: 0, turnOn: true },
    effMusic: { volume: 0, turnOn: false },
    landSetting: { showInfo: false },
    language: 'kr',
    gameMode: false,
    showCharacter: true,
    showItem: true,
    mapExpanding: false,
    disableMode: true
}
const settingReducer = (state = initState  , action) => {
    switch (action.type) {
        case SET_LAND_SHOW_INFO_SUCCESS:
            return {
                ...state,
                landSetting: action.land.land
            };
        case SET_LAND_SHOW_INFO_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SET_BACKGROUND_MUSIC_SUCCESS:
        
            return {
                ...state,
                bgMusic: action.bgMusic.bgMusic
            };
        case SET_BACKGROUND_MUSIC_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SET_EFFECT_MUSIC_SUCCESS:
            return {
                ...state,
                effMusic: action.effMusic.effMusic
            };
        case SET_EFFECT_MUSIC_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case SET_LANGUAGE_SUCCESS:
            return {
                ...state,
                language: action.language,
            };
        case SET_LANGUAGE_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case GET_SETTING_SUCCESS:
            return {
                ...state,
                language: action.setting.language,
                landSetting: action.setting.land,
                bgMusic: action.setting.bgMusic,
                effMusic: action.setting.effMusic
            };
        case GET_SETTING_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SET_SETTING_SUCCESS:
            return {
                ...state,
                language: action.setting.language,
                landSetting: action.land,
                bgMusic: action.bgMusic,
                effMusic: action.effMusic
            };
        case SET_SETTING_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case GAME_MODE:
            return {
                ...state,
                gameMode: action.mode
            };

        case SHOW_CHARACTER:
            return {
                ...state,
                showCharacter: action.displayChar
            };
        case SHOW_ITEM:
            return {
                ...state,
                showItem: action.displayItem
            };

        case MAP_EXPANDING:
            return {
                ...state,
                mapExpanding: action.expand
            };
        default:
            return state
    }
};

export default settingReducer;