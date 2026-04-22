const blurSlider = document.getElementById("bg-blur-slider");
const bgOverlay = document.getElementById("blur-bg");
const shadowSlider = document.getElementById("bg-shadow-slider");
const blendSelect = document.getElementById("bg-blend-mode");
const bgVideo = document.getElementById("bg-video");

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

blendSelect.addEventListener("change", () => {
    bgVideo.style.mixBlendMode = blendSelect.value;
    localStorage.setItem('bg-blend-mode', blendSelect.value);
});

function loadBgProperties() {
    let blur = localStorage.getItem('bg-blur');
    let shadow = localStorage.getItem('bg-shadow');
    let blendMode = localStorage.getItem('bg-blend-mode');

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

    if (blendMode) {
        bgVideo.style.mixBlendMode = blendMode;
        blendSelect.value = blendMode;
    }
}

loadBgProperties();