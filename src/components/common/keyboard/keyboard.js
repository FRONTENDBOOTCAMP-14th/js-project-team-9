(() => {
  const octave6 = document.querySelector(".octave-6");

  // 데스크탑 뷰에서의 반응형 구현
  function updateOctaveVisibility() {
    if (window.innerWidth >= 1200) {
      octave6.removeAttribute("hidden");
    } else {
      octave6.setAttribute("hidden", "");
    }
  }
  updateOctaveVisibility();
  window.addEventListener("resize", updateOctaveVisibility);
})();
