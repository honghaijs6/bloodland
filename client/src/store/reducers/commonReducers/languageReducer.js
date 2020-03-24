import {CHANGE_LANGUAGE_OPTION} from "../../actions/commonActions/languageActions";

export default function (state, action) {
    switch (action.type) {
        case CHANGE_LANGUAGE_OPTION:
            return {
                ...action,
                language: action.lang ? action.lang : 'kr'
            };
        default:
            return action
    }
}