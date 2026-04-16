// ---------------------------
// Sidebar open/close
// ---------------------------
const settingsOverlay = document.getElementById('settings-sidebar-overlay');
const settingsBtn = document.querySelector('#settings-btn');

settingsBtn.onclick = () => {
    settingsOverlay.classList.remove('hidden');
    settingsOverlay.classList.add('show');
};

settingsOverlay.onclick = e => {
    if (e.target === settingsOverlay) {
        settingsOverlay.classList.remove('show');
        setTimeout(() => settingsOverlay.classList.add('hidden'), 250);
    }
};

// ---------------------------
// Escape key closes any open sidebar
// ---------------------------
document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;

    if (settingsOverlay.classList.contains('show')) {
        settingsOverlay.classList.remove('show');
        setTimeout(() => settingsOverlay.classList.add('hidden'), 250);
    }

    const shortcutOverlay = document.getElementById('shortcut-sidebar-overlay');
    if (shortcutOverlay.classList.contains('show')) {
        shortcutOverlay.classList.remove('show');
        setTimeout(() => shortcutOverlay.classList.add('hidden'), 250);
    }
});

// ---------------------------
// Text Colors
// ---------------------------
function normalizeHex(val) {
    val = val.trim().replace(/^#/, '');
    if (val.length === 3) val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
    return /^[0-9a-fA-F]{6}$/.test(val) ? '#' + val.toLowerCase() : null;
}

let textColorPickers = document.querySelectorAll('#settings-sidebar-overlay .item-wrapper input[type="color"]');

for (let colorPicker of textColorPickers) {
    let itemName = colorPicker.parentElement.parentElement.getAttribute('item-name');
    let hexInput = colorPicker.parentElement.querySelector('.hex-input');

    let savedTextColor = localStorage.getItem(itemName + '-text-color');
    if (savedTextColor) {
        document.querySelector('body').style.setProperty('--' + itemName + '-text-color', savedTextColor);
    }

    const initialColor = savedTextColor || '#ffffff';
    colorPicker.value = initialColor;
    if (hexInput) hexInput.value = initialColor;

    let textInputTimer;

    function applyColor(hex) {
        document.querySelector('body').style.setProperty('--' + itemName + '-text-color', hex);
        clearTimeout(textInputTimer);
        textInputTimer = setTimeout(() => {
            localStorage.setItem(itemName + '-text-color', hex);
        }, 1000);
    }

    colorPicker.addEventListener('input', () => {
        if (hexInput) hexInput.value = colorPicker.value;
        applyColor(colorPicker.value);
    });

    if (hexInput) {
        hexInput.addEventListener('input', () => {
            const hex = normalizeHex(hexInput.value);
            if (hex) {
                hexInput.classList.remove('invalid');
                colorPicker.value = hex;
                applyColor(hex);
            } else {
                hexInput.classList.add('invalid');
            }
        });

        hexInput.addEventListener('blur', () => {
            const hex = normalizeHex(hexInput.value);
            if (hex) {
                hexInput.value = hex;
                hexInput.classList.remove('invalid');
            } else {
                hexInput.value = colorPicker.value;
                hexInput.classList.remove('invalid');
            }
        });
    }
}

const settingsItem = document.querySelectorAll('#settings-sidebar .item-wrapper');

settingsItem.forEach((settingsItem) => {
    const positionControlWrapper = settingsItem.querySelector('.item.position');
    if (!positionControlWrapper) return;

    const positionIcons = positionControlWrapper.querySelectorAll('.icon');
    const leftTextInput = positionControlWrapper.querySelector('input[side-type="left"]');
    const rightTextInput = positionControlWrapper.querySelector('input[side-type="right"]');
    const topTextInput = positionControlWrapper.querySelector('input[side-type="top"]');
    const bottomTextInput = positionControlWrapper.querySelector('input[side-type="bottom"]');

    let inputDelayTimer;

    let contentId = positionControlWrapper.getAttribute('content-id');
    const actualContentWrapper = document.getElementById(contentId);


    function savePosition() {
        let pos = {
            horizontal: actualContentWrapper.classList.contains('horizontal-center') ? 'horizontal-center' : null,
            vertical: actualContentWrapper.classList.contains('vertical-center') ? 'vertical-center' : null,
            left: actualContentWrapper.style.left,
            right: actualContentWrapper.style.right,
            top: actualContentWrapper.style.top,
            bottom: actualContentWrapper.style.bottom,
        };

        if (!pos.horizontal) {
            pos.horizontal = pos.left !== 'unset' && pos.left !== '' ? 'left' : 'right';
        }
        if (!pos.vertical) {
            pos.vertical = pos.top !== 'unset' && pos.top !== '' ? 'top' : 'bottom';
        }

        pos.leftVal = leftTextInput.value;
        pos.rightVal = rightTextInput.value;
        pos.topVal = topTextInput.value;
        pos.bottomVal = bottomTextInput.value;

        localStorage.setItem(contentId + '-position', JSON.stringify(pos));
    }

    function setActiveIcon(value) {
        const icon = positionControlWrapper.querySelector(`.icon[data-value="${value}"]`);
        if (!icon) return;
        const group = icon.closest('.align-btn-group');
        if (group) {
            group.querySelectorAll('.icon').forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
        }
    }

    function loadPosition() {
        let saved = localStorage.getItem(contentId + '-position');

        if (!saved) {
            // Set default active icons based on current element state
            const hDefault = actualContentWrapper.classList.contains('horizontal-center') ? 'horizontal-center' : 'left';
            const vDefault = actualContentWrapper.classList.contains('vertical-center') ? 'vertical-center' : 'bottom';
            setActiveIcon(hDefault);
            setActiveIcon(vDefault);
            return;
        }

        let pos = JSON.parse(saved);

        if (pos.horizontal === 'horizontal-center') {
            actualContentWrapper.style.left = 'unset';
            actualContentWrapper.style.right = 'unset';
            actualContentWrapper.classList.add('horizontal-center');
            leftTextInput.setAttribute('disabled', true);
            rightTextInput.setAttribute('disabled', true);
        } else if (pos.horizontal === 'left') {
            actualContentWrapper.classList.remove('horizontal-center');
            actualContentWrapper.style.right = 'unset';
            actualContentWrapper.style.left = pos.left || '0';
            leftTextInput.value = pos.leftVal || '';
            leftTextInput.removeAttribute('disabled');
            rightTextInput.setAttribute('disabled', true);
        } else if (pos.horizontal === 'right') {
            actualContentWrapper.classList.remove('horizontal-center');
            actualContentWrapper.style.left = 'unset';
            actualContentWrapper.style.right = pos.right || '0';
            rightTextInput.value = pos.rightVal || '';
            rightTextInput.removeAttribute('disabled');
            leftTextInput.setAttribute('disabled', true);
        }

        if (pos.vertical === 'vertical-center') {
            actualContentWrapper.style.top = 'unset';
            actualContentWrapper.style.bottom = 'unset';
            actualContentWrapper.classList.add('vertical-center');
            topTextInput.setAttribute('disabled', true);
            bottomTextInput.setAttribute('disabled', true);
        } else if (pos.vertical === 'top') {
            actualContentWrapper.classList.remove('vertical-center');
            actualContentWrapper.style.bottom = 'unset';
            actualContentWrapper.style.top = pos.top || '0';
            topTextInput.value = pos.topVal || '';
            topTextInput.removeAttribute('disabled');
            bottomTextInput.setAttribute('disabled', true);
        } else if (pos.vertical === 'bottom') {
            actualContentWrapper.classList.remove('vertical-center');
            actualContentWrapper.style.top = 'unset';
            actualContentWrapper.style.bottom = pos.bottom || '0';
            bottomTextInput.value = pos.bottomVal || '';
            bottomTextInput.removeAttribute('disabled');
            topTextInput.setAttribute('disabled', true);
        }

        setActiveIcon(pos.horizontal);
        setActiveIcon(pos.vertical);
    }

    loadPosition();

    [leftTextInput, rightTextInput, topTextInput, bottomTextInput].forEach(textInput => {
        textInput.addEventListener('input', (e) => {
            let side = textInput.getAttribute('side-type');
            let val = textInput.value;

            clearTimeout(inputDelayTimer);

            inputDelayTimer = setTimeout(() => {
                actualContentWrapper.style.setProperty(side, val + 'px');
                savePosition();
            }, 500);
        });
    })

    positionIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            let iconEl = e.currentTarget;
            const group = iconEl.closest('.align-btn-group');
            if (group) {
                group.querySelectorAll('.icon').forEach(i => i.classList.remove('active'));
                iconEl.classList.add('active');
            }

            let value = iconEl.getAttribute('data-value');

            if (value === 'left') {
                actualContentWrapper.style.left = '0';
                actualContentWrapper.style.right = 'unset';
                actualContentWrapper.classList.remove('horizontal-center');

                leftTextInput.removeAttribute('disabled');
                rightTextInput.setAttribute('disabled', true);
                rightTextInput.value = '';
            }
            else if (value === 'right') {
                actualContentWrapper.style.right = '0';
                actualContentWrapper.style.left = 'unset';
                actualContentWrapper.classList.remove('horizontal-center');

                rightTextInput.removeAttribute('disabled');
                leftTextInput.setAttribute('disabled', true);
                leftTextInput.value = '';
            }
            else if (value === 'horizontal-center') {
                actualContentWrapper.style.left = 'unset';
                actualContentWrapper.style.right = 'unset';
                actualContentWrapper.classList.add('horizontal-center');

                leftTextInput.setAttribute('disabled', true);
                rightTextInput.setAttribute('disabled', true);
                leftTextInput.value = '';
                rightTextInput.value = '';
            }
            else if (value === 'top') {
                actualContentWrapper.style.top = '0';
                actualContentWrapper.style.bottom = 'unset';
                actualContentWrapper.classList.remove('vertical-center');

                topTextInput.removeAttribute('disabled');
                bottomTextInput.setAttribute('disabled', true);
                bottomTextInput.value = '';
            }
            else if (value === 'bottom') {
                actualContentWrapper.style.bottom = '0';
                actualContentWrapper.style.top = 'unset';
                actualContentWrapper.classList.remove('vertical-center');

                bottomTextInput.removeAttribute('disabled');
                topTextInput.setAttribute('disabled', true);
                topTextInput.value = '';
            }
            else if (value === 'vertical-center') {
                actualContentWrapper.style.top = 'unset';
                actualContentWrapper.style.bottom = 'unset';
                actualContentWrapper.classList.add('vertical-center');

                topTextInput.setAttribute('disabled', true);
                bottomTextInput.setAttribute('disabled', true);
                topTextInput.value = '';
                bottomTextInput.value = '';
            }

            savePosition();
        });
    });
});

// Clock style changer
const clockStyleWrapper = document.querySelector('#clock-settings-wrapper .clock-style-wrapper');
const clockStyles = clockStyleWrapper.querySelectorAll('img');

clockStyles.forEach(style => {
    style.addEventListener('click', (e) => {
        let clockName = style.getAttribute('clock-name');

        let allClocks = document.querySelectorAll('#clock-position-wrapper .clock-item');

        localStorage.setItem('clock-style', clockName);

        allClocks.forEach(clock => {
            if (clock.classList.contains(clockName)) {
                clock.style.display = 'flex';
            }
            else {
                clock.style.display = 'none';
            }
        })
    });
})

function loadSavedClockStyle() {
    let clockStyle = localStorage.getItem('clock-style');
    if (clockStyle) {
        let allClocks = document.querySelectorAll('#clock-position-wrapper .clock-item');
        allClocks.forEach(clock => {
            if (clock.classList.contains(clockStyle)) {
                clock.style.display = 'flex';
            }
            else {
                clock.style.display = 'none';
            }
        })
    }
}

loadSavedClockStyle();

const settingTabIcons = document.querySelectorAll('#settings-sidebar .tabs li');

settingTabIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        let preSelectedTab = document.querySelector('#settings-sidebar .tabs li.active');

        if (e.currentTarget === preSelectedTab) {
            return;
        }

        preSelectedTab.classList.remove('active');
        e.currentTarget.classList.add('active');

        let tabName = e.currentTarget.getAttribute('setting-btn');
        let allItems = document.querySelectorAll('#settings-sidebar .item-wrapper');


        allItems.forEach(item => {
            if (item.getAttribute('item-name') === tabName) {
                item.style.display = 'flex';
            }
            else {
                item.style.display = 'none';
            }
        });
    });
})

// ---------------------------
// Glass color picker
// ---------------------------
;(function () {
    const glassColorPicker = document.getElementById('glass-color-picker');
    const glassHexInput = document.getElementById('glass-hex-input');

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function applyGlassColor(hex) {
        document.body.style.setProperty('--glass-bg-color', hexToRgba(hex, 0.18));
    }

    const savedGlassColor = localStorage.getItem('glass-color') || '#0c0c0c';
    glassColorPicker.value = savedGlassColor;
    glassHexInput.value = savedGlassColor;
    applyGlassColor(savedGlassColor);

    let glassColorTimer;

    glassColorPicker.addEventListener('input', () => {
        const hex = glassColorPicker.value;
        glassHexInput.value = hex;
        applyGlassColor(hex);
        clearTimeout(glassColorTimer);
        glassColorTimer = setTimeout(() => localStorage.setItem('glass-color', hex), 1000);
    });

    glassHexInput.addEventListener('input', () => {
        const hex = normalizeHex(glassHexInput.value);
        if (hex) {
            glassHexInput.classList.remove('invalid');
            glassColorPicker.value = hex;
            applyGlassColor(hex);
            clearTimeout(glassColorTimer);
            glassColorTimer = setTimeout(() => localStorage.setItem('glass-color', hex), 1000);
        } else {
            glassHexInput.classList.add('invalid');
        }
    });

    glassHexInput.addEventListener('blur', () => {
        const hex = normalizeHex(glassHexInput.value);
        if (hex) {
            glassHexInput.value = hex;
            glassHexInput.classList.remove('invalid');
        } else {
            glassHexInput.value = glassColorPicker.value;
            glassHexInput.classList.remove('invalid');
        }
    });
})();

// ---------------------------
// Search bar toggle
// ---------------------------
const searchWrapper = document.getElementById('search-wrapper');
const searchToggle = document.getElementById('search-toggle');
const searchInput = searchWrapper.querySelector('input');

if (localStorage.getItem('search-visible') === 'true') {
    searchWrapper.classList.add('visible');
    searchToggle.checked = true;
}

searchToggle.addEventListener('change', () => {
    const visible = searchToggle.checked;
    searchWrapper.classList.toggle('visible', visible);
    localStorage.setItem('search-visible', visible);
});

// ---------------------------
// Search history dropdown
// ---------------------------
const historyDropdown = document.getElementById('search-history-dropdown');
let highlightIndex = -1;
let historyItems = [];

async function showHistory(query) {
    if (!chrome?.history) return;

    const results = await chrome.history.search({
        text: query || '',
        maxResults: 6,
        startTime: 0
    });

    historyItems = results;
    highlightIndex = -1;
    historyDropdown.innerHTML = '';

    if (results.length === 0) {
        historyDropdown.classList.remove('open');
        return;
    }

    results.forEach(item => {
        const el = document.createElement('div');
        el.className = 'history-item';
        el.innerHTML = `
            <img src="${getFavicon(item.url)}" alt="">
            <span class="history-title">${item.title || item.url}</span>
            <span class="history-url">${item.url}</span>
        `;
        el.addEventListener('mousedown', e => {
            e.preventDefault(); // prevent blur from closing dropdown before click fires
            window.location.href = item.url;
        });
        historyDropdown.appendChild(el);
    });

    historyDropdown.classList.add('open');
}

function setHighlight(index) {
    const items = historyDropdown.querySelectorAll('.history-item');
    items.forEach((el, i) => el.classList.toggle('highlighted', i === index));
    highlightIndex = index;
}

searchInput.addEventListener('focus', () => showHistory(searchInput.value));
searchInput.addEventListener('input', () => showHistory(searchInput.value));

searchInput.addEventListener('blur', () => {
    setTimeout(() => historyDropdown.classList.remove('open'), 150);
});

searchInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight(Math.min(highlightIndex + 1, historyItems.length - 1));
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight(Math.max(highlightIndex - 1, -1));
    } else if (e.key === 'Escape') {
        historyDropdown.classList.remove('open');
        searchInput.blur();
    } else if (e.key === 'Enter') {
        if (highlightIndex >= 0 && historyItems[highlightIndex]) {
            window.location.href = historyItems[highlightIndex].url;
        } else if (searchInput.value.trim()) {
            window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(searchInput.value.trim());
        }
    }
});