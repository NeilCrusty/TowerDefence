function matchloaderClass(options) {
    var options = options || {};
    var currentfileIndex = options.currentfileIndex || 0;

    var fileInput = d3.select("#fileInput");
    var nextRoundButton = d3.select("#nextRoundButton");
    var previousRoundButton = d3.select("#previousRoundButton");

    const jsonFileName = "JsonMap.json";
    const filePathFilter = "A - ";
    const fileSortRegex = /Round ([0-9]+)\b/;

    var files, callbackFn;
    var reader = new FileReader();

    return {
        start: start
    };

    function start(callback) {
        callbackFn = callback;

        fileInput
            .on("change", function () {
                files = Array.from(d3.event.target.files)
                    .filter(filefilterFunction)
                    .sort(fileSortFunction);

                loadFile(files[currentfileIndex]);
            });

        nextRoundButton
            .on("click", function () {
                currentfileIndex++;
                loadFile(files[currentfileIndex]);
            });

        previousRoundButton
            .on("click", function () {
                currentfileIndex--;
                loadFile(files[currentfileIndex]);
            });
    }

    function filefilterFunction(f) {
        return (f.name == jsonFileName && f.webkitRelativePath.includes(filePathFilter));
    };

    function fileSortFunction(a, b) {
        let aNum = a.webkitRelativePath.match(fileSortRegex)[1];
        let bNum = b.webkitRelativePath.match(fileSortRegex)[1];
        return (aNum > bNum) ? 1 : -1;
    };

    function loadFile(file) {       
        reader.addEventListener("loadend", function (e) {          
            callbackFn(JSON.parse(e.target.result));
        });
       
        reader.readAsText(file);
    }
}