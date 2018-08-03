function mapClass(options) {
    var options = options || {}
    let settings = options.settings || settingsClass();
    let parentSelection = options.parentSelection || d3.select("body");

    let buildings, missiles, legend;
    let svg, roundText, gameDetails;

    function init() {
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
                .attr("class", "smallText")
                .attr("id", "player" + p.playerType + "Text");
        });

        buildings = buildingClass({ settings: settings, svg: svg });
        missiles = missileClass({ settings: settings, svg: svg });
        legend = legendClass({ settings: settings, svg: svg });
    }

    init();

    return {
        load: load
    };

    function load(file) {
        settings.update(file);

        loadSvg();
        loadTexts();
        loadMap(file.gameMap);
        legend.load(file.gameDetails.buildingsStats);
    }

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
            svg.select("#player" + p.playerType + "Text")
                .attr("x", settings.playerTextX(p, i))
                .text("Player: " + p.playerType
                    + " Energy: " + p.energy
                    + " Health: " + p.health
                    + " HitsTaken: " + p.hitsTaken
                    + " Score: " + p.score);
        });
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
        buildings.load(cells, newcells);

        //Add and update missiles
        missiles.load(cells, newcells);
    }
}