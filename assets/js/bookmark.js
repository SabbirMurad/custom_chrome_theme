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
            const item = document.createElement("div");
            item.className = "bookmark-item";
            item.classList.add("glass-card");
            item.innerHTML = `
                <img src="${getFavicon(node.url)}" alt="${node.title || node.url}">
                <span>${node.title || node.url}</span>
            `;

            item.onclick = () => window.open(node.url, "_blank");
            container.appendChild(item);
        }
        else {
            const folder = document.createElement("div");
            folder.className = "bookmark-folder";

            const title = document.createElement("div");
            title.className = "folder-title";
            title.classList.add("glass-card");

            const folderIcon = document.createElement("img");
            folderIcon.src = "assets/icon/folder.svg";
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
            const item = document.createElement("div");
            item.className = "bookmark-item";
            item.innerHTML = `
                <img src="${getFavicon(node.url)}" alt="${node.title || node.url}">
                <span>${node.title || node.url}</span>
            `;

            item.onclick = () => window.open(node.url, "_blank");
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