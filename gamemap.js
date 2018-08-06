var GameMap = (function () {
    var settings, parentSelection, svg, roundText;

    /* =============== export public methods =============== */
    return {
        init: init,
        load: load
    };

    /* =================== public methods ================== */
    function init(options) {
        var options = options || {}
        parentSelection = options.parentSelection || d3.select("body");

        settings = Settings.getInstance();

        //Create the SVG element
        svg = parentSelection.append("svg")
            .attr("width", settings.totalWidth())
            .attr("height", settings.totalHeight());

        //Create the round text element
        roundText = svg.append("text")
            .attr("x", "50%")
            .attr("y", 25)
            .attr("class", "bigText")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "middle");

        //Create the players text elements
        settings.players().forEach(function (p, i) {
            svg.append("text")
                .attr("x", settings.playerTextX(p, i))
                .attr("y", settings.playerTextY(p, i))
                .attr("id", "player" + p.playerType + "Text");
        });

        Building.init({ svg: svg });
        Missile.init({ svg: svg });
        Legend.init({ svg: svg });
    }

    function load(file) {
        settings.update(file);

        loadSvg();
        loadTexts();
        loadMap(file.gameMap);

        Legend.load(file.gameDetails.buildingsStats);
    }

    /* =================== private methods ================= */
    function loadSvg() {
        svg
            .attr("width", settings.totalWidth())
            .attr("height", settings.totalHeight());
    }

    function loadTexts() {
        //Update the round text element
        roundText
            .text("Round: " + settings.round());

        //Update the players text elements
        settings.players().forEach(function (p, i) {
            var playerDesc = svg
                .select("#player" + p.playerType + "Text")
                .attr("x", settings.playerTextX(p, i))
                .text("");

            addTspan(playerDesc, "Player", p.playerType);
            addTspan(playerDesc, "Energy", p.energy);
            addTspan(playerDesc, "Health", p.health);
            addTspan(playerDesc, "Hits Taken", p.hitsTaken);
            addTspan(playerDesc, "Score", p.score);
        });
    }

    function addTspan(element, name, value) {
        element.append("tspan")
            .attr("class", "playerText")
            .text(" " + name + ": ");

        element.append("tspan")
            .attr("class", "playerTextHighlight")
            .text(value);
    }

    function loadMap(gameMap) {
        //Bind the rows
        let rows = svg
            .selectAll(".row")
            .data(gameMap);

        //Add new rows
        let newRows = rows.enter()
            .append("g")
            .classed("row", true)

        //Bind the cells
        let cells = rows.merge(newRows)
            .selectAll(".cell")
            .data((d, i) => d);

        //Add new cells
        let newcells = cells.enter()
            .append("g")
            .classed("cell", true);

        //Add and update buildings
        Building.load(cells, newcells);

        //Add and update missiles
        Missile.load(cells, newcells);
    }
}());