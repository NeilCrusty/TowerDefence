function buildingClass(options) {
    let settings = options.settings;
    let svg = options.svg || d3.select("svg");
    let buildingTip;

    function isBuildings(c) {
        return (c.buildings && c.buildings.length);
    }

    function buildingClass(c) {
        return isBuildings(c) ? c.buildings[0].buildingType.toLowerCase() : "nobuilding";
    }

    function buildingText(c) {
        if (isBuildings(c)) {
            return (c.buildings[0].constructionTimeLeft > 0)
                ? c.buildings[0].buildingType[0].toLowerCase()
                : c.buildings[0].buildingType[0].toUpperCase();
        }
        return "";
    }

    function init() {
        buildingTip = d3.tip()
            .attr('class', 'd3-tip')
            .direction(function (c) {
                return settings.tipDirection(c, this);
            })
            .offset(function (c) {
                return settings.tipOffset(c, this);
            })
            .html(function (c) {
                let msg = "X: " + c.x + " Y: " + c.y;

                if (isBuildings(c)) {
                    c.buildings.forEach(function (b, i) {
                        msg += "<br/><br/>Player: " + b.playerType
                            + "<br/>Building Type: " + b.buildingType
                            + "<br/>Health: " + b.health
                            + "<br/>Construction Time Left: " + b.constructionTimeLeft
                            + "<br/>Weapon Cooldown Time Left: " + b.weaponCooldownTimeLeft;
                    });
                }
                return msg;
            });

        svg.call(buildingTip);
    }

    init();

    return {
        load: load
    }

    function load(cells, newCells) {
        //register the tooltip events
        newCells
            .on('mouseover', buildingTip.show)
            .on('mouseout', buildingTip.hide);

        //Add new building rects
        newCells.append("rect")
            .attr("x", settings.buildingX)
            .attr("y", settings.buildingY)
            .attr("width", settings.blockSize)
            .attr("height", settings.blockSize)
            .attr("class", buildingClass);

        //Add new building texts
        newCells.append("text")
            .attr("class", "buildingText")
            .attr("x", settings.buildingTextX)
            .attr("y", settings.buildingTextY)
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "middle")
            .text(buildingText);

        //Get added and existing cells
        let allCells = cells.merge(newCells)

        //Update the building rects
        allCells
            .select("rect")
            .attr("class", buildingClass);

        //Upate the building texts
        allCells
            .select(".buildingText")
            .text(buildingText);
    }
}