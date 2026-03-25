function getFavicon(domain) {
    try {
        const url = new URL(domain.includes("://") ? domain : "https://" + domain);
        return `https://www.google.com/s2/favicons?domain=${url.origin}&sz=64`;
    } catch {
        return 'assets/icon/web.svg';
    }
}

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