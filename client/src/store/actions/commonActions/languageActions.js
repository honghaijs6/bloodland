
export const CHANGE_LANGUAGE_OPTION = 'CHANGE_LANGUAGE_OPTION';
export const languageActions = {
    onHandleChangeLanguage
};
function onHandleChangeLanguage(lang) {
    return {type: CHANGE_LANGUAGE_OPTION, lang}
}
