function toDashCase(str) {
    // TODO: Implement the logic to convert a string to dash case
    return str.replace(/\s+/g, '-').toLowerCase();
}

function addHttpToUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    return url;
}