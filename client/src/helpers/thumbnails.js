import {loadingImage} from "../modules/blood_land/components/general/System";

const imgUrls = {

    //thumbnail
    'C04-thumbnail': { thumbImg: loadingImage('/images/game/character/common/pumpkin-witch-thumbnail.png') },
    'C01-thumbnail': { thumbImg: loadingImage('/images/game/character/common/little-crocodile-thumbnail.png') },
    'C02-thumbnail': { thumbImg: loadingImage('/images/game/character/common/little-puppy-thumbnail.png') },
    'C03-thumbnail': { thumbImg: loadingImage('/images/game/character/common/pink-alpaca-thumbnail.png') },
    'T01-thumbnail': { thumbImg: loadingImage('/images/game/character/common/normal-blood-sprout-thumbnail.png') },
    'T02-thumbnail': { thumbImg: loadingImage('/images/game/character/common/white-blood-sprout-thumbnail.png') },
    'T03-thumbnail': { thumbImg: loadingImage('/images/game/character/common/green-blood-sprout-thumbnail.png') },
    'T04-thumbnail': { thumbImg: loadingImage('/images/game/character/common/blue-blood-sprout-thumbnail.png') },
    'T05-thumbnail': { thumbImg: loadingImage('/images/game/character/common/bronze-blood-sprout-thumbnail.png') },
    'T06-thumbnail': { thumbImg: loadingImage('/images/game/character/common/silver-blood-sprout-thumbnail.png') },
    'T07-thumbnail': { thumbImg: loadingImage('/images/game/character/common/gold-blood-sprout-thumbnail.png') },
    'T08-thumbnail': { thumbImg: loadingImage('/images/game/character/common/platinum-blood-sprout-thumbnail.png') },
    'T09-thumbnail': {thumbImg: loadingImage('/images/game/character/common/diamond-blood-sprout-thumbnail.png')},
    'T10-thumbnail': {thumbImg: loadingImage('/images/game/character/common/bitamin-blood-sprout-thumbnail.png')},
    'I01-thumbnail': {thumbImg: loadingImage('/images/game/item/common/nutrition-thumbnail.png')},
    'I02-thumbnail': {thumbImg: loadingImage('/images/game/item/common/shovel-thumbnail.png')},
    'I03-thumbnail': {thumbImg: loadingImage('/images/game/item/common/droplet-thumbnail.png')},
    'I04-thumbnail': {thumbImg: loadingImage('/images/game/item/common/shovel-bitamin-thumbnail.png')},

    //for shop//character//common
    'C04-shop': { thumbImg: loadingImage('/images/game/character/common/pumpkin-witch.png') },
    'C01-shop': { thumbImg: loadingImage('/images/game/character/common/little-crocodile.png') },
    'C02-shop': { thumbImg: loadingImage('/images/game/character/common/little-puppy.png') },
    'C03-shop': { thumbImg: loadingImage('/images/game/character/common/pink-alpaca.png') },
    'T01-shop': { thumbImg: loadingImage('/images/game/character/common/normal-blood-sprout.png') },
    'T02-shop': { thumbImg: loadingImage('/images/game/character/common/white-blood-sprout.png') },
    'T03-shop': { thumbImg: loadingImage('/images/game/character/common/green-blood-sprout.png') },
    'T04-shop': { thumbImg: loadingImage('/images/game/character/common/blue-blood-sprout.png') },
    'T05-shop': { thumbImg: loadingImage('/images/game/character/common/bronze-blood-sprout.png') },
    'T06-shop': { thumbImg: loadingImage('/images/game/character/common/silver-blood-sprout.png') },
    'T07-shop': { thumbImg: loadingImage('/images/game/character/common/gold-blood-sprout.png') },
    'T08-shop': { thumbImg: loadingImage('/images/game/character/common/platinum-blood-sprout.png') },
    'T09-shop': {thumbImg: loadingImage('/images/game/character/common/diamond-blood-sprout.png')},
    'T10-shop': {thumbImg: loadingImage('/images/game/character/common/bitamin-blood-sprout.png')},
    'I01-shop': {thumbImg: loadingImage('/images/game/item/common/nutrition.png')},
    'I02-shop': {thumbImg: loadingImage('/images/game/item/common/shovel.png')},
    'I03-shop': {thumbImg: loadingImage('/images/game/item/common/droplet.png')},
    'I04-shop': {thumbImg: loadingImage('/images/game/item/common/shovel-bitamin.png')},
    'R01-shop': {thumbImg: loadingImage('/images/game/item/common/normal-box.png')},
    'R02-shop': {thumbImg: loadingImage('/images/game/item/common/rare-box.png')},
    'R03-shop': {thumbImg: loadingImage('/images/game/item/common/legend-box.png')},



    //map
    'T01-map': { thumbImg: loadingImage('/images/game/character/map/normal-blood-tree.png') },
    'T02-map': { thumbImg: loadingImage('/images/game/character/map/white-blood-tree.png') },
    'T03-map': { thumbImg: loadingImage('/images/game/character/map/green-blood-tree.png') },
    'T04-map': { thumbImg: loadingImage('/images/game/character/map/blue-blood-tree.png') },
    'T05-map': { thumbImg: loadingImage('/images/game/character/map/bronze-blood-tree.png') },
    'T06-map': { thumbImg: loadingImage('/images/game/character/map/silver-blood-tree.png') },
    'T07-map': { thumbImg: loadingImage('/images/game/character/map/gold-blood-tree.png') },
    'T08-map': { thumbImg: loadingImage('/images/game/character/map/platinum-blood-tree.png') },
    'T09-map': {thumbImg: loadingImage('/images/game/character/map/diamond-blood-tree.png')},
    'T10-map': {thumbImg: loadingImage('/images/game/character/map/bitamin-blood-tree.png')},
    'T10-icon-map': {thumbImg: loadingImage('/images/game/character/map/bitamin-title.svg')},




};

const getImgByTypeCode = typeCode => {
    return typeof imgUrls[typeCode] !== 'undefined'
        ? imgUrls[typeCode].thumbImg
        : '';
};

/// Vuongupdate
const getShopThumbnailByItemId= itemId => {
    return typeof imgUrls[itemId+'-thumbnail'] !== 'undefined'
        ? imgUrls[itemId+'-thumbnail'].thumbImg
        : '';
};
const getMapImgByItemId= itemId => {
    // console.log(itemId);
    return typeof imgUrls[itemId+'-map'] !== 'undefined'
        ? imgUrls[itemId+'-map'].thumbImg
        : '';
};


const getShopImgByItemId= itemId => {
    // console.log('ite', itemId)
    return typeof imgUrls[itemId+'-shop'] !== 'undefined'
        ? imgUrls[itemId+'-shop'].thumbImg
        : '';
};

export {
    getImgByTypeCode,
    getShopThumbnailByItemId,
    getMapImgByItemId,
    getShopImgByItemId
}