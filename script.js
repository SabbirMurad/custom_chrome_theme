const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const shortcuts = ['https://www.youtube.com/', 'https://github.com/'];

function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    // const s = String(now.getSeconds()).padStart(2, '0');
    const day = now.getDay();

    document.getElementById("clock").textContent = `${h > 12 ? h - 12 : h}:${m} ${h > 12 ? 'PM' : 'AM'}`;
    document.getElementById("date").textContent = `${days[day]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

setInterval(updateClock, 1000 * 60);
updateClock();

function getDomain(url) {
    try {
        const { hostname } = new URL(url);
        return hostname;
    } catch (e) {
        return null; // invalid URL
    }
}

function getFavicon(domain) {
    try {
        const url = new URL(domain.includes("://") ? domain : "https://" + domain);
        return `${url.origin}/favicon.ico`;
    } catch (e) {
        return null;
    }
}

function loadShortcuts() {
    let shortcutsWrapper = document.querySelector('.shortcuts-wrapper');

    for (let i = 0; i < shortcuts.length; i++) {
        let faviconLink = 'assets/add.png';
        let domain = getDomain(shortcuts[i]);
        if (domain != null) {
            let favicon = getFavicon(domain);
            if (favicon != null) {
                faviconLink = favicon;
            }
        }

        let shortcut = document.createElement('a');
        shortcut.href = shortcuts[i];
        shortcut.classList.add('item');
        shortcut.classList.add('glass-card');
        shortcut.innerHTML = `
            <img src="${faviconLink}" alt="Shortcut">
        `;
        shortcutsWrapper.appendChild(shortcut);
    }
}

loadShortcuts();

// chrome.bookmarks.getTree((bookmarkTreeNodes) => {
//     console.log(bookmarkTreeNodes);
// });
// function getBookmarks() {
// }

// getBookmarks();