export default function (content, filename) {
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
}