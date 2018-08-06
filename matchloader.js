var Matchloader = (function () {
    const jsonFileName = "JsonMap.json";
    const filePathFilter = "A - ";
    const fileSortRegex = /Round ([0-9]+)\b/;

    var fileInput, nextRoundButton, previousRoundButton;
    var currentfileIndex, files, callbackFn, reader;

    /* =============== export public methods =============== */
    return {
        init: init,
        start: start
    };

    /* =================== public methods ================== */
    function init(options) {
        options = options || {};
        currentfileIndex = options.currentfileIndex || 0;

        fileInput = d3.select("#fileInput");
        nextRoundButton = d3.select("#nextRoundButton");
        previousRoundButton = d3.select("#previousRoundButton");

        reader = new FileReader();
    }

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

    /* =================== private methods ================= */
    function filefilterFunction(f) {
        return (f.name == jsonFileName && f.webkitRelativePath.includes(filePathFilter));
    };

    function fileSortFunction(a, b) {
        let aNum = a.webkitRelativePath.match(fileSortRegex)[1];
        let bNum = b.webkitRelativePath.match(fileSortRegex)[1];
        return (aNum > bNum) ? 1 : -1;
    };

    function loadFile(file) {
        previousRoundButton.attr("disabled", (currentfileIndex == 0) ? "true" : null);
        nextRoundButton.attr("disabled", (currentfileIndex == files.length - 1) ? "true" : null);

        reader.addEventListener("loadend", function (e) {
            callbackFn(JSON.parse(e.target.result));
        });

        reader.readAsText(file);
    }
}());