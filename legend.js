function legendClass(options) {
    let settings = options.settings;
    let svg = options.svg || d3.select("svg");

    return {
        load: load
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
            .attr("class", "legend");

        //Add the building rects
        newLegends
            .append("rect")
            .attr("x", settings.legendX)
            .attr("y", settings.legendY)
            .attr("width", settings.blockSize)
            .attr("height", settings.blockSize)
            .attr("class", function (c, i) {
                return c.key.toLowerCase();
            });

        //Add the building texts
        newLegends
            .append("text")
            .attr("x", settings.legendBuildingTextX)
            .attr("y", settings.legendBuildingTextY)
            .attr("class", "buildingText")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "middle")
            .text(function (c, i) { return c.key[0]; });

        //Add the legend detail
        newLegends
            .append("text")
            .attr("x", settings.legendTextX)
            .attr("y", settings.legendTextY)
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
    }
}