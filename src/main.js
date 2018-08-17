window.onload = function () {
    let parent = d3.select("body")
        .append("div")
        .attr("class", "svgContainer");

    GameMap.init({ parentSelection: parent });

    Matchloader.init({ currentfileIndex: 0 });

    Matchloader.start(function (file) {
        GameMap.load(file);
    });
}