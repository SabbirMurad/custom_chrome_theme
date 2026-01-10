function processBookmarks(nodes) {
    let results = [];

    for (const node of nodes) {
        const item = {
            id: node.id,
            title: node.title,
            url: node.url || null,
            children: []
        };

        // If folder, recursively process children
        if (node.children && node.children.length > 0) {
            item.children = processBookmarks(node.children);
        }

        results.push(item);
    }

    return results;
}

function loadBookmarks(callback) {
    chrome.bookmarks.getTree((tree) => {
        const processedTree = processBookmarks(tree);
        callback(processedTree);
    });
}

loadBookmarks((tree) => {
    const main = renderMainBookmark(tree[0].children[0].children);
    const other = renderMainBookmark([tree[0].children[1]]);
    other.classList.add("other-bookmarks");
    document.getElementById("bookmark-container").appendChild(main);
    document.getElementById("bookmark-container").appendChild(other);
});


function renderMainBookmark(nodes) {
    const container = document.createElement("div");
    container.classList.add("container");

    for (const node of nodes) {
        if (node.url) {
            const item = document.createElement("a");
            item.setAttribute("href", node.url);
            item.className = "bookmark-item";
            item.classList.add("glass-card");
            item.innerHTML = `
                <img src="${getFavicon(node.url)}" alt="${node.title || node.url}">
                <span>${node.title || node.url}</span>
            `;

            container.appendChild(item);
        }
        else {
            const folder = document.createElement("div");
            folder.className = "bookmark-folder";

            const title = document.createElement("div");
            title.className = "folder-title";
            title.classList.add("glass-card");

            const folderIcon = document.createElement("div");
            // folderIcon.src = "assets/icon/folder.svg";
            folderIcon.innerHTML = `
                <?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 409.02 347.44"><defs><style>.cls-1{fill:var(--bookmark-text-color);}</style></defs><path class="cls-1" d="M0,303.29V44.6C4.66,19.56,23.49,2.41,49.07.65c29.95,1.69,62.16-2.15,91.84.04,35.89,2.65,49.84,37.23,74.25,57.5,4.53,3.77,7.59,5.16,13.56,5.6,42.76,3.18,89.82-3.22,132.61-.07,24.55,1.81,45.15,21.34,47.46,45.95-.83,66.3,1.74,132.98-1.31,199.07-4.66,18.9-20.38,33.22-39.19,37.46-109.07,1.63-218.7,1.67-327.76-.02-19.79-3.68-38.24-22.69-40.53-42.91v.02ZM47.72,32.03c-8.74,1.55-16.15,8.67-16.6,17.73v248.37c.53,9.87,9.16,17.35,18.76,17.96,104.75-.74,209.83,1.35,314.39-1.05,7.23-2.52,13.23-8.96,13.43-16.92V112.83c-.36-9.52-8.75-17.15-17.96-17.97l-136.35-.19c-27.16-3.06-47.07-33.72-65.27-52.1-5.52-5.57-9.5-10.02-17.95-10.79-29.25-2.67-62.76,1.9-92.44.24h-.01Z"/></svg>
            `;
            folderIcon.className = "folder-icon";

            const text = document.createElement("span");
            text.innerText = node.title || "Folder";

            title.appendChild(folderIcon);
            title.appendChild(text);

            const childrenContainer = renderBookmarkChildren(node.children);

            folder.appendChild(title);
            folder.appendChild(childrenContainer);

            container.appendChild(folder);
        }
    }

    return container;
}

function renderBookmarkChildren(nodes) {
    const container = document.createElement("div");
    container.classList.add("bookmark-children");
    container.classList.add("glass-card");

    for (const node of nodes) {
        if (node.url) {
            const item = document.createElement("a");
            item.setAttribute("href", node.url);
            item.className = "bookmark-item";
            item.innerHTML = `
                <img src="${getFavicon(node.url)}" alt="${node.title || node.url}">
                <span>${node.title || node.url}</span>
            `;

            container.appendChild(item);
        }
        else {
            const folder = document.createElement("div");
            folder.className = "bookmark-folder";

            const title = document.createElement("div");
            title.className = "folder-title";

            const folderIcon = document.createElement("img");
            folderIcon.src = "assets/icon/folder.svg";
            folderIcon.className = "folder-icon";

            const text = document.createElement("span");
            text.innerText = node.title || "Folder";

            title.appendChild(folderIcon);
            title.appendChild(text);

            container.appendChild(title);
        }
    }

    return container;
}