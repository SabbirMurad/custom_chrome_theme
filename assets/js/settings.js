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
const positionRadios = document.querySelectorAll('#settings-sidebar .item-wrapper .item.position input[type="radio"]');

let clockWrapper = document.getElementById('clock-wrapper');

positionRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        let value = e.target.value;

        if (value === 'left') {
            clockWrapper.style.left = '0';
            clockWrapper.style.right = 'unset';
            clockWrapper.classList.remove('horizontal-center');
        }
        else if (value === 'right') {
            clockWrapper.style.right = '0';
            clockWrapper.style.left = 'unset';
            clockWrapper.classList.remove('horizontal-center');
        }
        else if (value === 'horizontal-center') {
            clockWrapper.style.left = 'unset';
            clockWrapper.style.right = 'unset';
            clockWrapper.classList.add('horizontal-center');
        }
        else if (value === 'top') {
            clockWrapper.style.top = '0';
            clockWrapper.style.bottom = 'unset';
            clockWrapper.classList.remove('vertical-center');
        }
        else if (value === 'bottom') {
            clockWrapper.style.bottom = '0';
            clockWrapper.style.top = 'unset';
            clockWrapper.classList.remove('vertical-center');
        }
        else if (value === 'vertical-center') {
            clockWrapper.style.top = 'unset';
            clockWrapper.style.bottom = 'unset';
            clockWrapper.classList.add('vertical-center');
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