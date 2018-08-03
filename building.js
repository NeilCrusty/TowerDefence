var Building = (function () {
    let settings, svg, buildingTip;

    /* =============== export public methods =============== */
    return {
        init: init,
        load: load
    }

    /* =================== public methods ================== */
    function init(options) {
        svg = options.svg;
        settings = Settings.getInstance();

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

    function load(cells, newCells) {
        //move the cell to the correct location and register the tooltip events
        newCells
            .attr("transform", function (c, i) {
                return "translate(" + settings.buildingX(c, i) + "," + settings.buildingY(c, i) + ")";
            })
            .on('mouseover', buildingTip.show)
            .on('mouseout', buildingTip.hide);

        //Add new building rects
        newCells.append("rect")
            .attr("width", settings.blockSize)
            .attr("height", settings.blockSize)
            .attr("class", buildingClass);

        //Add new building texts
        newCells.append("text")
            .attr("class", "buildingText")           
            .attr("x", (c) => settings.blockSize() / 2)
            .attr("y", (c) => settings.blockSize() / 2)
            .attr("dominant-baseline", "middle")
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

    /* =================== private methods ================= */
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
}());