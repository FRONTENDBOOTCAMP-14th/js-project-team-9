// 볼륨 슬라이더 기능
const btnVolumeControl = {
  init: function () {
    const sliderWrapper = document.querySelector(".js-volume-slider-wrapper");
    // 슬라이더 컴포넌트가 없으면 여기서 실행 중단
    if (!sliderWrapper) {
      return;
    }

    const sliderBar = sliderWrapper.querySelector(
      ".js-btn-volume-slider-volumeSliderBar"
    );
    const fill = sliderBar.querySelector(
      ".btn-volume-slider__volume-slider-fill"
    );
    const focusableSlider = sliderWrapper.querySelector(
      ".js-btn-volume-slider-volumeSliderBar"
    );

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

      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        updateVolumeUI(currentPercent + step);
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        updateVolumeUI(currentPercent - step);
      }
    });
  },
};
export default btnVolumeControl;
