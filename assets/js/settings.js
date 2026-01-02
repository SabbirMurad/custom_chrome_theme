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

// Position
const positionWrapper = document.querySelector('#settings-sidebar .item-wrapper .item.position');

const positionIcons = positionWrapper.querySelectorAll('.icon');

const clockPositionWrapper = document.getElementById('clock-position-wrapper');

const leftTextInput = positionWrapper.querySelector('input[side-type="left"]');
const rightTextInput = positionWrapper.querySelector('input[side-type="right"]');
const topTextInput = positionWrapper.querySelector('input[side-type="top"]');
const bottomTextInput = positionWrapper.querySelector('input[side-type="bottom"]');

let inputDelayTimer;

[leftTextInput, rightTextInput, topTextInput, bottomTextInput].forEach(textInput => {
    textInput.addEventListener('input', (e) => {
        let side = textInput.getAttribute('side-type');
        let val = textInput.value;

        clearTimeout(inputDelayTimer);

        inputDelayTimer = setTimeout(() => {
            clockPositionWrapper.style.setProperty(side, val + 'px');
        }, 500);
    });
})

positionIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        let value = e.currentTarget.getAttribute('data-value');

        if (value === 'left') {
            clockPositionWrapper.style.left = '0';
            clockPositionWrapper.style.right = 'unset';
            clockPositionWrapper.classList.remove('horizontal-center');

            leftTextInput.removeAttribute('disabled');
            rightTextInput.setAttribute('disabled', true);
        }
        else if (value === 'right') {
            clockPositionWrapper.style.right = '0';
            clockPositionWrapper.style.left = 'unset';
            clockPositionWrapper.classList.remove('horizontal-center');

            rightTextInput.removeAttribute('disabled');
            leftTextInput.setAttribute('disabled', true);
        }
        else if (value === 'horizontal-center') {
            clockPositionWrapper.style.left = 'unset';
            clockPositionWrapper.style.right = 'unset';
            clockPositionWrapper.classList.add('horizontal-center');

            leftTextInput.setAttribute('disabled', true);
            rightTextInput.setAttribute('disabled', true);
        }
        else if (value === 'top') {
            clockPositionWrapper.style.top = '0';
            clockPositionWrapper.style.bottom = 'unset';
            clockPositionWrapper.classList.remove('vertical-center');

            topTextInput.removeAttribute('disabled');
            bottomTextInput.setAttribute('disabled', true);
        }
        else if (value === 'bottom') {
            clockPositionWrapper.style.bottom = '0';
            clockPositionWrapper.style.top = 'unset';
            clockPositionWrapper.classList.remove('vertical-center');

            bottomTextInput.removeAttribute('disabled');
            topTextInput.setAttribute('disabled', true);
        }
        else if (value === 'vertical-center') {
            clockPositionWrapper.style.top = 'unset';
            clockPositionWrapper.style.bottom = 'unset';
            clockPositionWrapper.classList.add('vertical-center');

            topTextInput.setAttribute('disabled', true);
            bottomTextInput.setAttribute('disabled', true);
        }
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