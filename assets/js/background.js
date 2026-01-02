const blurSlider = document.getElementById("bg-blur-slider");
const bgOverlay = document.getElementById("blur-bg");
const shadowSlider = document.getElementById("bg-shadow-slider");

blurSlider.addEventListener("input", () => {
    bgOverlay.style.backdropFilter = `blur(${blurSlider.value}px)`;
    localStorage.setItem('bg-blur', blurSlider.value);
    blurSlider.parentElement.querySelector('.range-slider__value').textContent = blurSlider.value;
});


shadowSlider.addEventListener("input", () => {
    bgOverlay.style.background = `rgba(0,0,0,${shadowSlider.value / 100})`;
    localStorage.setItem('bg-shadow', shadowSlider.value);
    shadowSlider.parentElement.querySelector('.range-slider__value').textContent = shadowSlider.value;
});

function loadBgProperties() {
    let blur = localStorage.getItem('bg-blur');
    let shadow = localStorage.getItem('bg-shadow');

    if (blur) {
        bgOverlay.style.backdropFilter = `blur(${blur}px)`;
        blurSlider.value = blur;
        blurSlider.parentElement.querySelector('.range-slider__value').textContent = blur;
    }

    if (shadow) {
        bgOverlay.style.background = `rgba(0,0,0,${shadow / 100})`;
        shadowSlider.value = shadow;
        shadowSlider.parentElement.querySelector('.range-slider__value').textContent = shadow;
    }
}

loadBgProperties();