var Settings = (function () {
    var instance;

    let margins = {
        top: 60,
        bottom: 20,
        left: 40,
        right: 40,
        center: 30,
        tooltip: 150
    };

    let legendheight = 200;
    let blockSize = 50;
    let mapWidth = 16;
    let mapHeight = 8;
    let playerTextY = 55;

    let round = 0;
    let players = [{ "playerType": "A" }, { "playerType": "B" }];

    /* =============== export public methods =============== */
    return {
        getInstance: getInstance
    };

    /* =================== public methods ================== */

    function getInstance() {
        if (!instance) {
            instance = init();
        }
        return instance;
    }

    /* =================== private methods ================== */

    function init() {
        return {
            update: update,
            blockSize: getBlockSize,
            round: getRound,
            players: getPlayers,
            totalWidth: getTotalWidth,
            totalHeight: getTotalHeight,
            playerTextX: getPlayerTextX,
            playerTextY: getPlayerTextY,
            buildingX: getBuildingX,
            buildingY: getBuildingY,
            missileX: getMissileX,
            missileY: getMissileY,           
            tipDirection: getTipDirection,
            tipOffset: getTipOffset,
            legendX: getLegendX,
            legendY: getLegendY     
        };
    }

    function update(file) {
        mapWidth = file.gameDetails.mapWidth;
        mapHeight = file.gameDetails.mapHeight;
        round = file.gameDetails.round;
        players = file.players;
    }

    function getBlockSize() {
        return blockSize;
    }

    function getRound() {
        return round;
    }

    function getPlayers() {
        return players;
    }

    function getTotalWidth() {
        return margins.left + margins.center + margins.right + (mapWidth * blockSize);
    }

    function getTotalHeight() {
        return margins.top + margins.bottom + (mapHeight * blockSize) + legendheight;
    }

    function getPlayerTextX(p, i) {
        return (i == 0) ? margins.left : margins.left + (mapWidth * (blockSize / 2)) + margins.center;
    }

    function getPlayerTextY(p, i) {
        return playerTextY;
    }

    function getBuildingX(c) {
        let size = c.x * blockSize + margins.left;
        if (c.x + 1 > mapWidth / 2) {
            size += margins.center;
        }
        return size;
    };

    function getBuildingY(c) {
        return c.y * blockSize + margins.top;
    };

    function getMissileX(c, i) {       
        return (c.playerType == "A") ? blockSize - 10 : 10;
    };

    function getMissileY(c, i) {        
        return blockSize / 2;
    };

    function getTipDirection(c, el) {
        let bound = el.getBoundingClientRect();

        if (bound.left < margins.tooltip) { return "e"; }
        else if (bound.right < margins.tooltip) { return "w"; }
        else if (bound.top < margins.tooltip) { return "s"; }
        else { return "n"; }
    }

    function getTipOffset(c, el) {
        let dir = getTipDirection(c, el);

        if (dir == 'n') { return [-10, 0] }
        else if (dir == 's') { return [10, 0] }
        else if (dir == 'e') { return [0, 10] }
        else if (dir == 'w') { return [0, -10] }
    }

    function getLegendX(c, i) {
        return margins.left;
    };

    function getLegendY(c, i) {
        return margins.top + mapHeight * blockSize + margins.bottom + (i * blockSize)
    };   
}());