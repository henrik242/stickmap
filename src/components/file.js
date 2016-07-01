var clone = function(someObj) {
    return JSON.parse(JSON.stringify(someObj));
};

var saveJson = function(content, filename) {
    let blob = new Blob([content], {
        type: 'application/json'
    });
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename); //IE workaround
    } else {
        let elem = document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.setAttribute('download', filename);
        elem.click();
    }
};

export function saveState(state) {
    let saveState = clone(state);
    Object.keys(saveState).forEach((key) =>
        key.match(/^editVertexClick/) && delete saveState[key]
    );
    saveJson(JSON.stringify(saveState), "stickmap.json");
}

export function loadState(setCallerState, event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (fileEvent) => {
        try {
            var newState = JSON.parse(fileEvent.target.result);
            if (Array.isArray(newState.edges) && Array.isArray(newState.vertices)) {
                setCallerState({
                    ...newState
                });
            }
            return;
        } catch (ex) {}

        alert("Error: " + file.name + " is not a stickmap state file");
    };
    reader.readAsText(file);
}
