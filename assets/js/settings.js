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
// Text Colors
// ---------------------------
let textColorPickers = document.querySelectorAll('#settings-sidebar-overlay .item-wrapper input[type="color"]');

for (let colorPicker of textColorPickers) {
    let itemName = colorPicker.parentElement.parentElement.getAttribute('item-name');

    let savedTextColor = localStorage.getItem(itemName + '-text-color');
    if (savedTextColor) {
        document.querySelector('body').style.setProperty('--' + itemName + '-text-color', savedTextColor);
    }

    colorPicker.value = savedTextColor || "#FFFFFF";

    let textInputTimer;

    colorPicker.addEventListener('input', () => {
        document.querySelector('body').style.setProperty('--' + itemName + '-text-color', colorPicker.value);

        clearTimeout(textInputTimer);
        textInputTimer = setTimeout(() => {
            localStorage.setItem(itemName + '-text-color', colorPicker.value);
        }, 1000);
    });
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


    [leftTextInput, rightTextInput, topTextInput, bottomTextInput].forEach(textInput => {
        textInput.addEventListener('input', (e) => {
            let side = textInput.getAttribute('side-type');
            let val = textInput.value;

            clearTimeout(inputDelayTimer);

            inputDelayTimer = setTimeout(() => {
                actualContentWrapper.style.setProperty(side, val + 'px');
            }, 500);
        });
    })

    positionIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            let value = e.currentTarget.getAttribute('data-value');

            if (value === 'left') {
                actualContentWrapper.style.left = '0';
                actualContentWrapper.style.right = 'unset';
                actualContentWrapper.classList.remove('horizontal-center');

                leftTextInput.removeAttribute('disabled');
                rightTextInput.setAttribute('disabled', true);
            }
            else if (value === 'right') {
                actualContentWrapper.style.right = '0';
                actualContentWrapper.style.left = 'unset';
                actualContentWrapper.classList.remove('horizontal-center');

                rightTextInput.removeAttribute('disabled');
                leftTextInput.setAttribute('disabled', true);
            }
            else if (value === 'horizontal-center') {
                actualContentWrapper.style.left = 'unset';
                actualContentWrapper.style.right = 'unset';
                actualContentWrapper.classList.add('horizontal-center');

                leftTextInput.setAttribute('disabled', true);
                rightTextInput.setAttribute('disabled', true);
            }
            else if (value === 'top') {
                actualContentWrapper.style.top = '0';
                actualContentWrapper.style.bottom = 'unset';
                actualContentWrapper.classList.remove('vertical-center');

                topTextInput.removeAttribute('disabled');
                bottomTextInput.setAttribute('disabled', true);
            }
            else if (value === 'bottom') {
                actualContentWrapper.style.bottom = '0';
                actualContentWrapper.style.top = 'unset';
                actualContentWrapper.classList.remove('vertical-center');

                bottomTextInput.removeAttribute('disabled');
                topTextInput.setAttribute('disabled', true);
            }
            else if (value === 'vertical-center') {
                actualContentWrapper.style.top = 'unset';
                actualContentWrapper.style.bottom = 'unset';
                actualContentWrapper.classList.add('vertical-center');

                topTextInput.setAttribute('disabled', true);
                bottomTextInput.setAttribute('disabled', true);
            }
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