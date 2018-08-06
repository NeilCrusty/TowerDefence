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
        var buildingsStatslist = d3.entries(buildingsStats)
            .sort((a, b) => (a.key < b.key) ? -1 : 1);

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
            .attr("x", (c) => settings.blockSize() + 5)
            .attr("y", (c) => settings.blockSize() / 2)
            .attr("class", "legendText")
            .attr("dominant-baseline", "middle")

            .text("Name: ")
            .append("tspan")
            .attr("class", "legendTextHighlight")
            .text((c, i) => c.key)

            .append("tspan")
            .attr("class", "legendText")
            .text((c, i) => " Health: ")
            .append("tspan")
            .attr("class", "legendTextHighlight")
            .text((c, i) => c.value['health'])

            .append("tspan")
            .attr("class", "legendText")
            .text((c, i) => " Construction Time: ")
            .append("tspan")
            .attr("class", "legendTextHighlight")
            .text((c, i) => c.value['constructionTime'])

            .append("tspan")
            .attr("class", "legendText")
            .text((c, i) => " Price: ")
            .append("tspan")
            .attr("class", "legendTextHighlight")
            .text((c, i) => c.value['price'])

            .append("tspan")
            .attr("class", "legendText")
            .text((c, i) => " Energy Generated: ")
            .append("tspan")
            .attr("class", "legendTextHighlight")
            .text((c, i) => c.value['energyGeneratedPerTurn'])

            .append("tspan")
            .attr("class", "legendText")
            .text((c, i) => " Weapon Damage: ")
            .append("tspan")
            .attr("class", "legendTextHighlight")
            .text((c, i) => c.value['weaponDamage'])

            .append("tspan")
            .attr("class", "legendText")
            .text((c, i) => " Weapon Speed: ")
            .append("tspan")
            .attr("class", "legendTextHighlight")
            .text((c, i) => c.value['weaponSpeed'])

            .append("tspan")
            .attr("class", "legendText")
            .text((c, i) => " Weapon Cooldown: ")
            .append("tspan")
            .attr("class", "legendTextHighlight")
            .text((c, i) => c.value['weaponCooldownPeriod'])

            .append("tspan")
            .attr("class", "legendText")
            .text((c, i) => " Construction Score: ")
            .append("tspan")
            .attr("class", "legendTextHighlight")
            .text((c, i) => c.value['constructionScore']);
    }
}());