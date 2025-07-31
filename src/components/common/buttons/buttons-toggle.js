const toggleControl = {
  // 초기화 함수
  init: function () {
    // 1. 토글 버튼 기능
    const toggleBtn = document.querySelector(".btn-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const isPressed = toggleBtn.getAttribute("aria-pressed") === "true";
        toggleBtn.setAttribute("aria-pressed", !isPressed);
      });
    }
  },
};

export default toggleControl;
