function settingsClass(options) {
    var options = options || { margins: {} }

    let margins = {
        top: options.margins.top || 60,
        bottom: options.margins.bottom || 20,
        left: options.margins.left || 40,
        right: options.margins.right || 40,
        center: options.margins.center || 30,
        tooltip: options.margins.tooltip || 150
    };

    let legendheight = options.legendheight || 200;
    let blockSize = options.blockSize || 50;
    let mapWidth = options.mapWidth || 16;
    let mapHeight = options.mapHeight || 8;
    let playerTextY = options.playerTextY || 55;

    let round = 0;
    let players = [{ "playerType": "A" }, { "playerType": "B" }];    

    return {        
        update: update,
        blockSize: getBlockSize,  
        round: getRound,
        players : getPlayers,   
        totalWidth: getTotalWidth,
        totalHeight: getTotalHeight,
        playerTextX: getPlayerTextX,
        playerTextY: getPlayerTextY,
        buildingX: getBuildingX,
        buildingY: getBuildingY,
        buildingTextX: getBuildingTextX,
        buildingTextY: getBuildingTextY,
        missileX: getMissileX,
        missileY: getMissileY,
        missileTextX: getMissileTextX,
        missileTextY: getMissileTextY,
        tipDirection: getTipDirection,
        tipOffset: getTipOffset,
        legendX: getLegendX,
        legendY: getLegendY,
        legendBuildingTextX: getLegendBuildingTextX,
        legendBuildingTextY: getLegendBuildingTextY,
        legendTextX: getLegendTextX,
        legendTextY: getLegendTextY
    };

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

    function getBuildingTextX(c) {
        return getBuildingX(c) + blockSize / 2;
    };

    function getBuildingTextY(c) {
        return getBuildingY(c) + blockSize / 2;
    };

    function getMissileX(c, i) {
        let size = getBuildingX(c);
        return (c.playerType == "A") ? size + blockSize - 10 : size + 10;
    };

    function getMissileY(c, i) {
        return getBuildingY(c) + blockSize / 2;
    };

    function getMissileTextX(c, i) {
        return getMissileX(c, i) - 6;
    };

    function getMissileTextY(c, i) {
        return getMissileY(c, i) + 4;
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

    function getLegendBuildingTextX(c, i) {
        return getLegendX(c, i) + blockSize / 2;
    };

    function getLegendBuildingTextY(c, i) {
        return getLegendY(c, i)  + blockSize / 2;
    };

    function getLegendTextX(c, i) {
        return margins.left + blockSize + 10;
    };

    function getLegendTextY(c, i) {
        return getLegendBuildingTextY(c, i);
    };
}