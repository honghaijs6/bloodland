
function translateLandPurchaseEmail(content,onHandleTranslate,t,language,lng){
    const customContent = content.replace("<p>","").replace("</p>","").replace(" 블러드가 지급되었습니다.","").replace("개의 랜드가 판매되어 ","|")
    const quadKeysCount = customContent.split("|")[0];
    const landPrice     = customContent.split("|")[1];
    const translatedTitle = onHandleTranslate(t,'email.landPurchaseNotice.title', language , lng);
    const translatedContent = onHandleTranslate(t,'email.landPurchaseNotice.body', language , lng).replace("$_selected_cell",quadKeysCount).replace("$_blood",landPrice);
    return {translatedTitle,translatedContent};
}

function translateProfitReceivingEmail(content,onHandleTranslate,itemTranslateInfo,t,language,lng,shops){
    const translatedTitle   = onHandleTranslate(t,'email.profitReceiving.title', language , lng);
    let translatedContent = content;
    
    shops.forEach(tree => {
        translatedContent = translatedContent.replace(tree.name_ko,itemTranslateInfo(tree,language).name);
    });
    return {translatedTitle,translatedContent};
}

export function translateContent(fromName,title,content,onHandleTranslate,itemTranslateInfo,t,language,lng,shops,createdDate){
    if(fromName !== "BLOODLAND") return {translatedTitle:title,translatedContent:content};
    if(title === '판매 알림'){
        return translateLandPurchaseEmail(content,onHandleTranslate,t,language,lng);
    }

    if(title === '수확 알림'){
        return translateProfitReceivingEmail(content,onHandleTranslate,itemTranslateInfo,t,language,lng,shops);
    }
    
    return {translatedTitle:title,translatedContent:content};
}

export function translateTitle(fromName,title,onHandleTranslate,t,language,lng){
    if(fromName !== "BLOODLAND") return title;
    if(title === '판매 알림'){
        return onHandleTranslate(t,'email.landPurchaseNotice.title', language , lng);
    }

    if(title === '수확 알림'){
        return onHandleTranslate(t,'email.profitReceiving.title', language , lng);
    }
    
    return title;
}