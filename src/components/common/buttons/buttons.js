const toggleBtn = document.querySelector(".btn-toggle");

toggleBtn.addEventListener("click", () => {
  const isPressed = toggleBtn.getAttribute("aria-pressed") === "true";
  toggleBtn.setAttribute("aria-pressed", !isPressed);
});

document.addEventListener("DOMContentLoaded", () => {
  const sliderWrapper = document.querySelector(".js-volume-slider-wrapper");
  const sliderBar = document.querySelector(
    ".js-btn-volume-slider-volumeSliderBar"
  );
  const fill = sliderBar.querySelector(
    ".btn-volume-slider__volume-slider-fill"
  );
  const focusableSlider = document.querySelector(".js-btn-volume-slider");

  function updateVolumeUI(percent) {
    const newWidthPercent = Math.max(0, Math.min(100, percent));
    fill.style.width = `${newWidthPercent}%`;

    if (newWidthPercent === 0) {
      sliderWrapper.classList.add("is-muted");
    } else {
      sliderWrapper.classList.remove("is-muted");
    }
  }

  sliderBar.addEventListener("click", function (event) {
    const barWidth = this.offsetWidth;
    const clickX = event.offsetX;
    const newPercent = (clickX / barWidth) * 100;

    updateVolumeUI(newPercent);
    focusableSlider.focus();
  });

  focusableSlider.addEventListener("keydown", function (event) {
    const currentPercent = parseFloat(fill.style.width) || 0;
    const step = 5;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      updateVolumeUI(currentPercent + step);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      updateVolumeUI(currentPercent - step);
    }
  });
});
