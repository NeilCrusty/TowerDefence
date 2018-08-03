let settings = settingsClass();

let parent = d3.select("body")
    .append("div")
    .attr("class", "svgContainer");

let map = mapClass({
    parentSelection: parent,
    settings: settings
});

let matchloader = matchloaderClass({ currentfileIndex: 0 });

matchloader.start(function (file) {    
    map.load(file);
});