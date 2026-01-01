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

const clockWrapper = document.getElementById('clock-wrapper');

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
            clockWrapper.style.setProperty(side, val + 'px');
        }, 500);
    });
})

positionIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        let value = e.currentTarget.getAttribute('data-value');

        if (value === 'left') {
            clockWrapper.style.left = '0';
            clockWrapper.style.right = 'unset';
            clockWrapper.classList.remove('horizontal-center');

            leftTextInput.removeAttribute('disabled');
            rightTextInput.setAttribute('disabled', true);
        }
        else if (value === 'right') {
            clockWrapper.style.right = '0';
            clockWrapper.style.left = 'unset';
            clockWrapper.classList.remove('horizontal-center');

            rightTextInput.removeAttribute('disabled');
            leftTextInput.setAttribute('disabled', true);
        }
        else if (value === 'horizontal-center') {
            clockWrapper.style.left = 'unset';
            clockWrapper.style.right = 'unset';
            clockWrapper.classList.add('horizontal-center');

            leftTextInput.setAttribute('disabled', true);
            rightTextInput.setAttribute('disabled', true);
        }
        else if (value === 'top') {
            clockWrapper.style.top = '0';
            clockWrapper.style.bottom = 'unset';
            clockWrapper.classList.remove('vertical-center');

            topTextInput.removeAttribute('disabled');
            bottomTextInput.setAttribute('disabled', true);
        }
        else if (value === 'bottom') {
            clockWrapper.style.bottom = '0';
            clockWrapper.style.top = 'unset';
            clockWrapper.classList.remove('vertical-center');

            bottomTextInput.removeAttribute('disabled');
            topTextInput.setAttribute('disabled', true);
        }
        else if (value === 'vertical-center') {
            clockWrapper.style.top = 'unset';
            clockWrapper.style.bottom = 'unset';
            clockWrapper.classList.add('vertical-center');

            topTextInput.setAttribute('disabled', true);
            bottomTextInput.setAttribute('disabled', true);
        }
    });
});

// let savedTextColor = localStorage.getItem('text-color');
// console.log(savedTextColor);
// if (savedTextColor) {
//     document.querySelector('body').style.setProperty('--text-color', savedTextColor);
// }

// textColorPicker.value = savedTextColor || "#FFFFFF";

// let textInputTimer;

// textColorPicker.addEventListener('input', () => {
//     console.log(textColorPicker.value);
//     document.querySelector('body').style.setProperty('--text-color', textColorPicker.value);

//     clearTimeout(textInputTimer);
//     textInputTimer = setTimeout(() => {
//         localStorage.setItem('text-color', textColorPicker.value);
//     }, 1000);
// });