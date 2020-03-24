//const EarthRadius = 6378137;
const MinLatitude = -85.05112878;
const MaxLatitude = 85.05112878;
const MinLongitude = -180;
const MaxLongitude = 180;
const TilePixelSize = 256;

module.exports = {
    LatLongToTileXY,
    PixelXYToLatLong,
    TileXYToLatLong,
    TileXYToQuadKey,
    QuadKeyToTileXY,
    QuadKeyToLatLong
}

function Clip(n, minValue, maxValue){
    return Math.min(Math.max(n, minValue), maxValue);
}

function MapSize(level){
	const COUNT_BY_LEVEL_LIST = Array.from(Array(25), (v, i)=> Math.pow(2, i));
    return TilePixelSize * COUNT_BY_LEVEL_LIST[level];
}

function LatLongToTileXY(latitude, longitude, level){
    latitude = Clip(latitude, MinLatitude, MaxLatitude);
    longitude = Clip(longitude, MinLongitude, MaxLongitude);

    var x = (longitude + 180) / 360;
    var sinLatitude = Math.sin(latitude * Math.PI / 180);
    var y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);

    var mapSize = MapSize(level);
    var pixelX = Clip(x * mapSize + 0.5, 0, mapSize - 1);
    var pixelY = Clip(y * mapSize + 0.5, 0, mapSize - 1);

    return {x: parseInt(pixelX / TilePixelSize,0), y: parseInt(pixelY / TilePixelSize,0)};
};

function PixelXYToLatLong (pixelX, pixelY, zoom){
    var mapSize = MapSize(zoom);
    var x = (Clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
    var y = 0.5 - (Clip(pixelY, 0, mapSize - 1) / mapSize);

    var latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
    var longitude = 360 * x;

    return { lat: latitude, lng: longitude };
}

function TileXYToLatLong(tileX, tileY, level){
    var pixelX = tileX * TilePixelSize;
    var pixelY = tileY * TilePixelSize;

    var mapSize = MapSize(level);
    var x = (Clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
    var y = 0.5 - (Clip(pixelY, 0, mapSize - 1) / mapSize);

    var latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
    var longitude = 360 * x;

    return {lat: latitude, lng: longitude};
}

function TileXYToQuadKey(tileX, tileY, level){
    var quadKey = '';
    for (var i = level; i > 0; i--)
    {
        var digit = '0';
        var mask = 1 << (i - 1);
        if ((tileX & mask) !== 0)
        {
            digit++;
        }
        if ((tileY & mask) !== 0)
        {
            digit++;
            digit++;
        }
        quadKey += String(digit);
    }
    return quadKey;
}

function QuadKeyToTileXY(quadKey){
    quadKey = String(quadKey);
    var tileX = 0;
    var tileY = 0;
    var levelOfDetail = quadKey.length;
    for (var i = levelOfDetail; i > 0; i--)
    {
        var mask = 1 << (i - 1);
        switch (quadKey[levelOfDetail - i])
        {
            case '0':
                break;

            case '1':
                tileX |= mask;
                break;

            case '2':
                tileY |= mask;
                break;

            case '3':
                tileX |= mask;
                tileY |= mask;
                break;

            default:
                throw new Error("Invalid QuadKey digit sequence.");
        }
    }

    return {x: tileX, y: tileY, level: levelOfDetail};
}

function QuadKeyToLatLong(quadKey, offsetX, offsetY){
    quadKey = String(quadKey);
    var levelOfDetail = quadKey.length;
    var tileXY = QuadKeyToTileXY(quadKey);
    return TileXYToLatLong(tileXY.x + (offsetX || 0), tileXY.y + (offsetY || 0), levelOfDetail);
}