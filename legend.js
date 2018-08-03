var Legend = (function () {
    let settings, svg;

    /* =============== export public methods =============== */
    return {
        init: init,
        load: load
    }

    /* =================== public methods ================== */
    function init(options) {              
        svg = options.svg || d3.select("svg");
        settings = Settings.getInstance();
    }

    function load(buildingsStats) {
        //Convert the building stats dictionary to a list
        var buildingsStatslist = d3.entries(buildingsStats);

        //Bind and add the legend
        var legends = svg
            .selectAll(".legend")
            .data(buildingsStatslist)

        //Legends dont change so dont need to handle updates and deletes
        var newLegends = legends
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function (c, i) {
                return "translate(" + settings.legendX(c, i) + "," + settings.legendY(c, i) + ")";
            });

        //Add the building rects
        newLegends
            .append("rect")           
            .attr("width", settings.blockSize)
            .attr("height", settings.blockSize)
            .attr("class", function (c, i) {
                return c.key.toLowerCase();
            });

        //Add the building texts
        newLegends
            .append("text")
            .attr("x", (c) => settings.blockSize() / 2)
            .attr("y", (c) => settings.blockSize() / 2)
            .attr("class", "buildingText")
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle")
            .text(function (c, i) { return c.key[0]; });

        //Add the legend detail
        newLegends
            .append("text")
            .attr("x", (c) => settings.blockSize() + 10)
            .attr("y", (c) => settings.blockSize() / 2)
            .attr("class", "legendText")
            .attr("dominant-baseline", "middle")
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
    }
}());