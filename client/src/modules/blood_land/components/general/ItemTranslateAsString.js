const translateItem = require('./../../../../translations/items/items');

export function itemTranslateInfo(itemSelected,language){
    // console.log('itemSelected',itemSelected);
    let name = '';
    let descriptionForShop = '';
    let descriptionForDetail = '';
    let descriptionForInventory = '';
    const  {itemId,randomBoxId } = itemSelected;
    if(language === 'kr') {
        const {name_ko, descriptionForShop_ko,descriptionForDetail_ko,descriptionForInventory_ko} = translateItem[itemId ? itemId : randomBoxId];
        name = name_ko;
        descriptionForShop = descriptionForShop_ko;
        descriptionForDetail = descriptionForDetail_ko;
        descriptionForInventory = descriptionForInventory_ko;
    }
    else if(language === 'en'){
        const{name_en, descriptionForShop_en,descriptionForDetail_en,descriptionForInventory_en} = translateItem[itemId ? itemId : randomBoxId];
        name = name_en;
        descriptionForShop = descriptionForShop_en;
        descriptionForDetail = descriptionForDetail_en;
        descriptionForInventory = descriptionForInventory_en;
    }
    else if(language === 'vi'){
        const{name_vi, descriptionForShop_vi,descriptionForInventory_vi,descriptionForDetail_vi} = translateItem[itemId ? itemId : randomBoxId];
        name = name_vi;
        descriptionForShop = descriptionForShop_vi;
        descriptionForDetail = descriptionForDetail_vi;
        descriptionForInventory = descriptionForInventory_vi;
    }
    else if(language === 'cn'){
        const {name_cn, descriptionForShop_cn,descriptionForDetail_cn,descriptionForInventory_cn} = translateItem[itemId ? itemId : randomBoxId];
        name = name_cn;
        descriptionForShop = descriptionForShop_cn;
        descriptionForDetail = descriptionForDetail_cn;
        descriptionForInventory = descriptionForInventory_cn;
    }
    else if(language === 'in'){
        const {name_in,descriptionForShop_in,descriptionForDetail_in,descriptionForInventory_in} = translateItem[itemId ? itemId : randomBoxId];
        name = name_in;
        descriptionForShop = descriptionForShop_in;
        descriptionForDetail = descriptionForDetail_in;
        descriptionForInventory = descriptionForInventory_in;
    }
    else if(language === 'th'){
        const  {itemId,randomBoxId } = itemSelected
        const {name_th,descriptionForShop_th,descriptionForDetail_th,descriptionForInventory_th} = translateItem[itemId ? itemId : randomBoxId];
        name = name_th;
        descriptionForShop = descriptionForShop_th;
        descriptionForDetail = descriptionForDetail_th;
        descriptionForInventory = descriptionForInventory_th;
    }

    return {name,descriptionForShop,descriptionForDetail,descriptionForInventory}
}