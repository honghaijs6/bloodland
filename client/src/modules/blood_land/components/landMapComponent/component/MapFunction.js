import { QuadKeyToTileXY } from '../../general/System'
const MAX_TILE_LEVEL = 24;

export {
    checkInCenter,
    drawLine,

    validatePrice,
    convertFloatToLocalString,
    convertLocalStringToFloat,
    checkInCountry,
    splitLandCanBuyLevel24FromSelectedTiles,
    splitLandLevel24,
    landCanBuy,
    isLandCanBuy,
    calculatorLand,
    //createLandUpdate,
    removeDuplicates,
    splitLand
}

//===============================================================================CHECK IN CENTER===========================================================================================
function checkInCenter(tile, lineTiles) {
    lineTiles = lineTiles.map(lineTile => QuadKeyToTileXY(lineTile));

    const inRight = checkRightInBound(tile, lineTiles);
    const inLeft = checkLeftInBound(tile, lineTiles);
    const inBottom = checkBottomInBound(tile, lineTiles);
    const inTop = checkTopInBound(tile, lineTiles);
    return inRight && inLeft && inBottom && inTop;
}
function lineTilesSome(lineTiles, x, y) {
    return lineTiles.some(lineTile => lineTile.x === x && lineTile.y === y)
}
function checkRightInBound(tile, lineTiles) {
    const rangeCheck = 10000;
    let { x, y } = tile;
    let max = x + rangeCheck;
    while (x < max) {
        let inBound = lineTilesSome(lineTiles, x, y);
        if (inBound) {
            return true;
        }
        x++;
    }
    return false;
}

function checkLeftInBound(tile, lineTiles) {
    const rangeCheck = 10000;
    let { x, y } = tile;
    let min = x >= rangeCheck ? (x - rangeCheck) : 0;
    while (x > min) {
        let inBound = lineTilesSome(lineTiles, x, y);
        if (inBound) return true;
        x--;
    }
    return false;
}

function checkBottomInBound(tile, lineTiles) {
    const rangeCheck = 10000;
    let { x, y } = tile;
    let max = y + rangeCheck;
    while (y < max) {
        let inBound = lineTilesSome(lineTiles, x, y);
        if (inBound) return true;
        y++;
    }
    return false;
}

function checkTopInBound(tile, lineTiles) {
    const rangeCheck = 10000;
    let { x, y } = tile;
    const min = y >= rangeCheck ? (y - rangeCheck) : 0;
    while (y > min) {
        let inBound = lineTilesSome(lineTiles, x, y);
        if (inBound) return true;
        y--;
    }
    return false;
}
//===============================================================================END CHECK IN CENTER===========================================================================================

function drawLine([tileA, tileB]) {
    let { x: x0, y: y0 } = tileA;
    let { x: x1, y: y1 } = tileB;
    if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
        if (x0 > x1) {
            return drawLineLow([tileB, tileA])
        } else {
            return drawLineLow([tileA, tileB])
        }
    } else {
        if (y0 > y1) {
            return drawLineHigh([tileB, tileA])
        } else {
            return drawLineHigh([tileA, tileB])
        }
    }
}

function drawLineHigh([tileA, tileB]) {
    let arrLine = [];
    let { x: x0, y: y0 } = tileA;
    let { x: x1, y: y1 } = tileB;
    let dx = x1 - x0;
    let dy = y1 - y0;
    let xi = 1;
    if (dx < 0) {
        xi = -1;
        dx = -dx;
    }
    let D = 2 * dx - dy;
    let x = x0;


    for (let y = y0; y <= y1; y++) {
        arrLine.push({ x, y });
        if (D > 0) {
            x = x + xi
            D = D - 2 * dy
        }
        D = D + 2 * dx;
    }
    arrLine.push(tileB);
    return arrLine;
}

function drawLineLow([tileA, tileB]) {
    let arrLine = [];
    let { x: x0, y: y0 } = tileA;
    let { x: x1, y: y1 } = tileB;
    let dx = x1 - x0;
    let dy = y1 - y0;
    let yi = 1;

    if (dy < 0) {
        yi = -1;
        dy = -dy;
    }
    let D = 2 * dy - dx;
    let y = y0;

    for (let x = x0; x <= x1; x++) {
        arrLine.push({ x, y });
        if (D > 0) {
            y = y + yi;
            D = D - 2 * dx;
        }
        D = D + 2 * dy
    }
    arrLine.push(tileB);
    return arrLine;
}

function validatePrice(price) {
    const MIN_PRICE = 0;
    const MAX_PRICE = 999999999;
    let pPrice = parseFloat(price);
    if (pPrice.toString().indexOf('.') !== -1) return false;
    return pPrice === 0 || (pPrice && pPrice >= MIN_PRICE && pPrice <= MAX_PRICE && pPrice.toString().length <= 12)
}

function convertFloatToLocalString(number) {
    return parseFloat(parseFloat(number).toFixed(2)).toLocaleString();
}

function convertLocalStringToFloat(stringLocal) {
    return parseFloat(stringLocal.replace(/,/g, ''));
}

function checkInCountry({ latlng, openCountries }) {
    if(!openCountries || openCountries.length === 0) return false;
    return openCountries.some(limitMap => {
        if (latlng.lat >= limitMap.minLat && latlng.lat <= limitMap.maxLat && latlng.lng >= limitMap.minLng && latlng.lng <= limitMap.maxLng) {
            if (!limitMap.ranges) {
                return false;
            } else {
                return limitMap.ranges.some(range => latlng.lat >= range.lat[0] && latlng.lat <= range.lat[1] && latlng.lng >= range.lng[0] && latlng.lng <= range.lng[1]);
            }

        }
        return false;
    });
}

function splitLandCanBuyLevel24FromSelectedTiles(selectedTiles, user, defaultSellPrice) {
    if (selectedTiles && selectedTiles.length > 0) {
        const arrQuadkey = landCanBuy(selectedTiles, user, defaultSellPrice);
        if (arrQuadkey && arrQuadkey.length > 0)
            return splitLandLevel24(arrQuadkey, defaultSellPrice);
    }
    return [];
}

function splitLandLevel24(lands, defaultSellPrice, level = 24) {
    let splitLand = [...lands];
    while (splitLand.some(land => land.quadKey.length < level)) {
        let fIndex = splitLand.findIndex(land => land.quadKey.length < level);
        let changeLand = splitLand.splice(fIndex, 1)[0];
        //let changeLand = splitLand.shift();
        let allChild = [0, 1, 2, 3].map(number => {
            let newChild = { ...changeLand };
            newChild.quadKey = newChild.quadKey + number;
            newChild.landCount = 1;
            newChild.totalCount = 1;
            newChild.sellPrice = newChild.sellPrice ? newChild.sellPrice : defaultSellPrice;
            return newChild;
        });
        splitLand = splitLand.concat(allChild);
    }
    return splitLand;
}

function calculatorLand(level) {
    return Math.pow(4, MAX_TILE_LEVEL - level);
}

function isLandCanBuy(land, myId) {
    if (land.waiting) {
        return false;
    }
    if (land.user) {
        if (land.user._id === myId) {
            return false;
        } else {
            if (land.forSaleStatus === false) {
                return false;
            }
        }
    } else if (land.purchased) {
        return false;
    }
    return true;
}

function arrLandCannotBuySome(arrLandCannotBuy, cLand) {
    return arrLandCannotBuy.some(cnb => cnb.quadKey.indexOf(cLand.quadKey) === 0)
}

function landCanBuy(selected, user, defaultSellPrice) {
    return selected && selected.reduce((arrBuyable, slTile) => {
        const arrLandCannotBuy = slTile && slTile.lands && slTile.lands.filter(land => {
            return !isLandCanBuy(land, user._id);
        }).sort((a, b) => {
            return b.quadKey.length - a.quadKey.length;
        });
        const [highLandCannotBuy] = arrLandCannotBuy.slice(-1);
        if (highLandCannotBuy && slTile.quadKey.indexOf(highLandCannotBuy.quadKey) === 0) { //cannot buy: slTile is child of highLandCannotBuy
        } else {
            const deepLandCannotBuy = arrLandCannotBuy[0];
            if (deepLandCannotBuy) {
                const childLand = splitLand([slTile.quadKey], deepLandCannotBuy.quadKey);
                //if(childLand){
                let arrChildLand = childLand.map(cLandQK => {
                    const landCount = calculatorLand(cLandQK.length);
                    let newChildLand = {
                        empty: true,
                        forbid: false,
                        user: null,
                        forSaleStatus: null,
                        sellPrice: defaultSellPrice,
                        landCount: landCount,
                        totalCount: landCount,
                        quadKey: cLandQK,
                    };
                    let fLand = slTile.lands ? slTile.lands.find(slLand => slLand.quadKey.indexOf(cLandQK) === 0) : false;
                    if (fLand) {
                        newChildLand = { ...fLand };
                        newChildLand.quadKey = cLandQK
                        newChildLand.landCount = landCount;
                        newChildLand.totalCount = landCount;
                        newChildLand.sellPrice = newChildLand.sellPrice ? landCount * newChildLand.sellPrice : landCount * defaultSellPrice;

                    }
                    return newChildLand;
                });
                const buyable = arrChildLand.filter(cLand => !arrLandCannotBuySome(arrLandCannotBuy, cLand));
                arrBuyable = arrBuyable.concat(buyable);
            } else {
                let lanCanBuy = slTile.lands.reduce((landCanBuy, land) => {
                    if (!arrLandCannotBuy.some(cnb => cnb.quadKey === land.quadKey)) {
                        landCanBuy.push(land);
                    }
                    return landCanBuy;
                }, []);

                arrBuyable = arrBuyable.concat(lanCanBuy);
            }
        }
        return arrBuyable;
    }, []);
}

function removeDuplicates(arr, prop) {
    var obj = {};
    for (var i = 0, len = arr.length; i < len; i++) {
        if (!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
    }
    var newArr = [];
    for (var key in obj) newArr.push(obj[key]);
    return newArr;
}

function splitLand(arr, quadKey) {
    while (arr[arr.length - 1].length < quadKey.length) {
        //remove
        let fIndex = arr.findIndex(qk => quadKey.indexOf(qk) === 0);
        let changeTile = arr.splice(fIndex, 1)[0];

        //split to 4
        let child = [changeTile + '0', changeTile + '1', changeTile + '2', changeTile + '3'];
        let iChild = child.findIndex(c => c === quadKey);
        if (iChild !== -1) {
            child.splice(iChild, 1);
        }
        arr = [...arr, ...child];
    }
    return arr;
}
