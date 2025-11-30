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
    let shortcutsWrapper = document.querySelector('#shortcuts-wrapper');
    let sidebarShortcutsWrapper = document.querySelector('#shortcut-sidebar-overlay .shortcuts-wrapper');

    let shortcuts = localStorage.getItem('shortcuts');
    if (shortcuts == null) {
        shortcuts = [];
    } else {
        shortcuts = JSON.parse(shortcuts);
    }

    shortcutsWrapper.innerHTML = `
        <div class="item glass-card add-more">
            <img src="assets/edit.png" alt="Add">
        </div>
    `;

    let editBtn = shortcutsWrapper.querySelector('.add-more');
    editBtn.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        overlay.classList.add('show');
    });

    sidebarShortcutsWrapper.innerHTML = '';

    for (let i = shortcuts.length - 1; i >= 0; i--) {
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
            <div class="container">
                <img src="${faviconLink}" alt="Shortcut">
            <div/>
        `;

        shortcutsWrapper.prepend(shortcut);

        let sidebarShortcuts = document.createElement('div');
        sidebarShortcuts.classList.add('item');
        sidebarShortcuts.setAttribute("draggable", "true");
        sidebarShortcuts.innerHTML = `
            <img src="${faviconLink}" alt="Shortcut">
            <span>${shortcuts[i]}</span>
            <img class="close" src="assets/close.svg" alt="Close">
        `;

        let closeBtn = sidebarShortcuts.querySelector('.close');
        closeBtn.addEventListener('click', () => removeShortcut(shortcuts[i]));

        sidebarShortcutsWrapper.prepend(sidebarShortcuts);
    }
}

loadShortcuts();

function removeShortcut(url) {
    let shortcuts = localStorage.getItem('shortcuts');
    if (shortcuts == null) {
        shortcuts = [];
    } else {
        shortcuts = JSON.parse(shortcuts);
    }

    shortcuts.splice(shortcuts.indexOf(url), 1);
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));

    loadShortcuts();
}

const addButton = document.querySelector('#shortcuts-wrapper .add-more');
const overlay = document.getElementById('shortcut-sidebar-overlay');
const sidebar = document.getElementById('sidebar');

addButton.onclick = () => {
    overlay.classList.remove('hidden');
    overlay.classList.add('show');
};

// Close when clicking OUTSIDE sidebar
overlay.onclick = (e) => {
    if (e.target === overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.classList.add('hidden'), 250);
    }
};

const sortableList = document.querySelector('#shortcut-sidebar-overlay .shortcuts-wrapper');

let draggedItem = null;

sortableList.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("item")) {
        draggedItem = e.target;
        e.target.classList.add("dragging");
    }
});

sortableList.addEventListener("dragend", (e) => {
    if (draggedItem) {
        draggedItem.classList.remove("dragging");
        draggedItem = null;
    }
});

sortableList.addEventListener("dragover", (e) => {
    e.preventDefault(); // required for drop

    const items = [...sortableList.querySelectorAll('.item:not(.dragging)')];

    const mouseY = e.clientY;

    let nextItem = items.find(item => {
        const rect = item.getBoundingClientRect();
        return mouseY < rect.top + rect.height / 2;
    });

    if (nextItem) {
        sortableList.insertBefore(draggedItem, nextItem);
    } else {
        sortableList.appendChild(draggedItem);
    }
});

sortableList.addEventListener("dragend", () => {
    // TODO:
    let newOrder = [];

    sortableList.querySelectorAll(".item span").forEach(el => {
        newOrder.push(el.textContent);
    });

    // save updated order
    localStorage.setItem("shortcuts", JSON.stringify(newOrder));

    // reload
    loadShortcuts();
});

const addShortcutBtn = document.querySelector('#shortcut-sidebar-overlay #add-shortcut-btn');

addShortcutBtn.addEventListener('click', () => {
    let urlInput = document.querySelector('#shortcut-sidebar-overlay #shortcut-url');
    let url = urlInput.value;

    if (url == '') {
        return;
    }

    let shortcuts = localStorage.getItem('shortcuts');
    if (shortcuts == null) {
        shortcuts = [];
    } else {
        shortcuts = JSON.parse(shortcuts);
    }

    if (shortcuts.includes(url)) {
        return;
    }

    shortcuts.push(url);
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));

    loadShortcuts();
    urlInput.value = '';
    // overlay.classList.remove('show');
    // setTimeout(() => overlay.classList.add('hidden'), 250);
});