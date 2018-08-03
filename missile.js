function missileClass(options) {
    let settings = options.settings;
    let svg = options.svg || d3.select("svg");
    let missileTip;

    function missilesByPlayer(c) {
        let arr = [];
        if (c.missiles && c.missiles.length) {
            settings.players().forEach(player => {
                let missiles = c.missiles.filter(m => m.playerType == player.playerType);
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

    function missileRotation(c, i) {
        return (c.playerType == "A") ? 90 : -90;
    };

    function init() {
        missileTip = d3.tip()
            .attr('class', 'd3-tip')
            .direction(function (c) {
                return settings.tipDirection(c, this);
            })
            .offset(function (c) {
                return settings.tipOffset(c, this);
            })
            .html(function (c) {
                let msg = "X: " + c.x + " Y: " + c.y;

                c.missiles.forEach(function (m, i) {
                    msg += "<br/><br/>Player: " + c.playerType
                        + "<br/>Missile: " + (parseInt(i) + 1)
                        + "<br/>Id: " + m.id
                        + "<br/>Speed: " + m.speed
                        + "<br/>Damage: " + m.damage;
                });
                return msg;
            });

        svg.call(missileTip);
    }

    init();

    return {
        load: load
    }

    function load(cells, newCells) {
        let allCells = cells.merge(newCells)

        //Bind the missiles
        let missiles = allCells
            .selectAll(".missileContainer")
            .data(missilesByPlayer)

        //Remove old missles
        missiles.exit().remove();

        //Add new missiles
        let newMissiles = missiles.enter()
            .append("g")
            .attr("class", "missileContainer");

        //register the tooltip events
        newMissiles
            .on("mouseover", function () { d3.event.stopPropagation(); }) //dont show the building tip from rect
            .on("mouseover.log", missileTip.show)
            .on('mouseout', missileTip.hide);

        //Add the missile triangle
        newMissiles
            .append("path")
            .attr("class", "missile")
            .attr("d", d3.symbol().type(d3.symbolTriangle).size(150))
            .attr("transform", function (c, i) {
                return "translate(" + settings.missileX(c, i) + "," + settings.missileY(c, i) + ") rotate(" + missileRotation(c, i) + ") ";
            });

        //Add the missile text
        newMissiles
            .append("text")
            .attr("class", "missileText")
            .attr("x", (c, i) => settings.missileTextX(c, i))
            .attr("y", (c, i) => settings.missileTextY(c, i))
            .text((c, i) => c.missiles.length);

        //Upate the missile texts
        missiles.merge(newMissiles)
            .select(".missileText")
            .text((c, i) => c.missiles.length);
    }
}