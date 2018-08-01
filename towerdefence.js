var files,
    index = 0,
    screenWidth = 1024,
    screenHeight = 768,
    blockSize = 50,
    border = { top: 60, bottom: 20, left: 40, right: 40, center: 30, tooltip: 150 },
    gameDetails,
    players,
    svg;

d3.select("#filepicker")
    .on("change", function () {
        files = Array.from(event.target.files)
            .filter(function (e) {
                return (e.name == "JsonMap.json" && e.webkitRelativePath.includes("A - "));
            })
            .sort(function (a, b) {
                var regex = /Round ([0-9]+)\b/;
                aNum = a.webkitRelativePath.match(regex)[1];
                bNum = b.webkitRelativePath.match(regex)[1];
                return (aNum > bNum) ? 1 : -1;
            });

        // index = 0;
        loadFile(files[index]);
    });

d3.select("#nextRoundButton")
    .on("click", function () {
        index++;
        loadFile(files[index]);
    });

d3.select("#previousRoundButton")
    .on("click", function () {
        index--;
        loadFile(files[index]);
    });

var loadFile = function (file) {
    var myReader = new FileReader();

    myReader.addEventListener("loadend", function (e) {
        loadMap(JSON.parse(e.srcElement.result));
    });
    //start the reading process.
    myReader.readAsText(file);
}

var isBuildings = function (c) {
    return (c.buildings && c.buildings.length);
}
var buildingClass = function (c) {
    return isBuildings(c) ? "" + c.buildings[0].buildingType.toLowerCase() : "nobuilding";
}
var buildingText = function (c) {
    if (isBuildings(c)) {
        return (c.buildings[0].constructionTimeLeft > 0)
            ? c.buildings[0].buildingType[0].toLowerCase()
            : c.buildings[0].buildingType[0].toUpperCase();
    }
    return "";
}

var rectx = function (c) {
    var size = c.x * blockSize + border.left;
    if (c.x + 1 > gameDetails.mapWidth / 2) {
        size += border.center;
    }
    return size;
};
var recty = function (c) { return c.y * blockSize + border.top; };

var missilesByPlayer = function (c) {
    var arr = [];
    if (c.missiles && c.missiles.length) {
        players.forEach(player => {
            var missiles = c.missiles.filter(m => m.playerType == player.playerType);
            if (missiles.length > 0) {
                arr.push({
                    x: c.x,
                    y: c.y,
                    playerType: player.playerType,
                    missiles: missiles
                });
            }
        });
    }
    return arr;
};

var missileX = function (c, i) {
    var size = rectx(c);
    return (c.playerType == "A") ? size + blockSize - 10 : size + 10;
};
var missileY = function (c, i) {
    return recty(c) + blockSize / 2;
};
var missileRotation = function (c, i) {
    return (c.playerType == "A") ? 90 : -90;
};

svg = d3.select("body")
    .append("div")
    .attr("class", "svgContainer")
    .append("svg")
    .attr("width", screenWidth)
    .attr("height", screenHeight);

svg.append("text")
    .attr("x", "50%")
    .attr("y", 25)
    .attr("class", "bigText")
    .attr("id", "roundText")
    .attr("alignment-baseline", "middle")
    .attr("text-anchor", "middle");

svg.append("text")
    .attr("y", 55)
    .attr("class", "smallText")
    .attr("id", "playerAText");

svg.append("text")
    .attr("y", 55)
    .attr("class", "smallText")
    .attr("id", "playerBText");

var tipDirection = function (d, el) {
    var bound = el.getBoundingClientRect();

    if (bound.left < border.tooltip) {
        return "e";
    }
    else if (bound.right < border.tooltip) {
        return "w";
    }
    else if (bound.top < border.tooltip) {
        return "s";
    }
    else {
        return "n";
    }
}

var tipOffset = function (d, el) {
    var dir = tipDirection(d, el);
    if (dir == 'n') { return [-10, 0] }
    else if (dir == 's') { return [10, 0] }
    else if (dir == 'e') { return [0, 10] }
    else if (dir == 'w') { return [0, -10] }
}

var buildingTip = d3.tip()
    .direction(function (d) {
        return tipDirection(d, this);
    })
    .attr('class', 'd3-tip')
    .offset(function (d) {
        return tipOffset(d, this);
    })
    .html(function (d) {
        var msg = "X: " + d.x + " Y: " + d.y;

        if (isBuildings(d)) {
            d.buildings.forEach(function (m, i) {
                msg += "<br/><br/>Player: " + m.playerType
                    + "<br/>Building Type: " + m.buildingType
                    + "<br/>Health: " + m.health
                    + "<br/>Construction Time Left: " + m.constructionTimeLeft
                    + "<br/>Weapon Cooldown Time Left: " + m.weaponCooldownTimeLeft;
            });
        }
        return msg;
    });

var missileTip = d3.tip()
    .direction(function (d) {
        return tipDirection(d, this);
    })
    .attr('class', 'd3-tip')
    .offset(function (d) {
        return tipOffset(d, this);
    })
    .html(function (d) {
        var msg = "X: " + d.x + " Y: " + d.y;

        d.missiles.forEach(function (m, i) {
            msg += "<br/><br/>Player: " + d.playerType
                + "<br/>Missile: " + (parseInt(i) + 1)
                + "<br/>Id: " + m.id
                + "<br/>Speed: " + m.speed
                + "<br/>Damage: " + m.damage;
        });
        return msg;
    });

svg.call(buildingTip);
svg.call(missileTip);

var loadMap = function (file) {
    gameDetails = file.gameDetails;
    players = file.players;

    screenWidth = gameDetails.mapWidth * blockSize + border.left + border.center + border.right;
    screenHeight = border.top + gameDetails.mapHeight * blockSize + border.bottom + 200;

    //Add the SVG container
    svg = d3.select("svg")
        .attr("width", screenWidth)
        .attr("height", screenHeight);

    //Add the text elements for the round, player A and player B
    svg.select("#roundText")
        .text("Round: " + gameDetails.round);

    players.forEach(function (p, i) {
        svg.select("#player" + p.playerType + "Text")
            .attr("x", (p.playerType == "A") ? border.left : border.left + gameDetails.mapWidth * (blockSize / 2) + border.center)
            .text("Player: " + p.playerType
                + " Energy: " + p.energy
                + " Health: " + p.health
                + " HitsTaken: " + p.hitsTaken
                + " Score: " + p.score);
    });

    //Bind the rows
    var rows = svg
        .selectAll(".row")
        .data(file.gameMap);

    //Add new rows
    var newRows = rows.enter()
        .append("g")
        .classed("row", true)

    //Bind the cells
    var cells = rows.merge(newRows)
        .selectAll(".cell")
        .data((d, i) => d);

    //Add new cells
    var newcells = cells.enter()
        .append("g")
        .classed("cell", true)
        .on('mouseover', buildingTip.show)
        .on('mouseout', buildingTip.hide);

    //Add new building rects
    newcells.append("rect")
        .attr("x", rectx)
        .attr("y", recty)
        .attr("width", blockSize)
        .attr("height", blockSize)
        .attr("class", buildingClass);

    //Add new building texts
    newcells.append("text")
        .attr("class", "buildingText")
        .attr("x", c => rectx(c) + blockSize / 2)
        .attr("y", c => recty(c) + blockSize / 2)
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .text(buildingText)

    //Get added and existing cells
    var allCells = cells.merge(newcells)

    //Update the building rects
    allCells
        .select("rect")
        .attr("class", buildingClass);

    //Upate the building texts
    allCells
        .select(".buildingText")
        .text(buildingText);

    //Bind the missiles
    var missiles = allCells
        .selectAll(".missileContainer")
        .data(missilesByPlayer)

    //Remove old missles
    missiles.exit().remove();

    //Add new missiles
    var newMissiles = missiles.enter()
        .append("g")
        .attr("class", "missileContainer")
        .on("mouseover", function () { d3.event.stopPropagation(); })
        .on("mouseover.log", missileTip.show)
        .on('mouseout', missileTip.hide);

    //Add the missile triangle
    newMissiles
        .append("path")
        .attr("class", "missile")
        .attr("d", d3.symbol().type(d3.symbolTriangle).size(150))
        .attr("transform", function (c, i) {
            return "translate(" + missileX(c, i) + "," + missileY(c, i) + ") rotate(" + missileRotation(c, i) + ") ";
        });

    //Add the missile text
    newMissiles
        .append("text")
        .attr("class", "missileText")
        .attr("x", (c, i) => missileX(c, i) - 6)
        .attr("y", (c, i) => missileY(c, i) + 4)
        .text((c, i) => c.missiles.length);

    //Upate the missile texts
    missiles.merge(newMissiles)
        .select(".missileText")
        .text((c, i) => c.missiles.length);

    //Convert the building stats dictionary to a list
    var buildingsStatslist = d3.entries(gameDetails.buildingsStats);

    //Bind and add the legend
    var legends = svg
        .selectAll(".legend")
        .data(buildingsStatslist)
        .enter()
        .append("g")
        .attr("class", "legend");

    legends
        .append("rect")
        .attr("x", border.left)
        .attr("y", (c, i) => border.top + gameDetails.mapHeight * blockSize + border.bottom + (i * blockSize))
        .attr("width", blockSize)
        .attr("height", blockSize)
        .attr("class", function (c, i) {
            return c.key.toLowerCase();
        });

    legends
        .append("text")
        .attr("x", c => border.left + blockSize / 2)
        .attr("y", (c, i) => border.top + gameDetails.mapHeight * blockSize + border.bottom + (i * blockSize) + blockSize / 2)
        .attr("class", "buildingText")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .text(function (c, i) { return c.key[0]; });

    legends
        .append("text")
        .attr("x", c => border.left + blockSize + 10)
        .attr("y", (c, i) => border.top + gameDetails.mapHeight * blockSize + border.bottom + (i * blockSize) + blockSize / 2)
        .attr("class", "legendText")
        .attr("alignment-baseline", "middle")
        .text(function (c, i) {
            return "Name: " + c.key
                + " Health: " + c.value['health']
                + " Construction Time: " + c.value['constructionTime']
                + " Price: " + c.value['price']
                + " Energy Generated: " + c.value['energyGeneratedPerTurn']
                + " WeaponDamage: " + c.value['weaponDamage']
                + " WeaponSpeed: " + c.value['weaponSpeed']
                + " Weapon Cooldown: " + c.value['weaponCooldownPeriod']
                + " ConstructionScore: " + c.value['constructionScore']
        });
};
