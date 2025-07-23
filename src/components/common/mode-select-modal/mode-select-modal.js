{
  // 모드 선택 버튼의 클래스 이름으로 수정 필요. 임의로 클래스 이름 붙임
  const modeSelectButton = document.querySelector(".btn-mode-select");
  const modeSelectModal = document.querySelector(".mode-select-modal");
  const modalCloseButton = modeSelectModal.querySelector(
    ".mode-select-modal__button-close"
  );
  const modalSelectForm = modeSelectModal.querySelector(
    ".mode-select-modal__form"
  );
  const modeRadioButtons =
    modalSelectForm.querySelectorAll('input[name="mode"]');

  // 선택한 모드를 저장하기 위한 변수 선언
  let selectedValue;

  // 모드 선택 버튼을 누르면 모달 창 열기
  modeSelectButton.addEventListener("click", () => {
    modeSelectModal.showModal();
  });

  // 닫기 버튼을 누르면 모달 창 닫기
  modalCloseButton.addEventListener("click", () => {
    modeSelectModal.close();
  });

  // 확인 버튼을 누르면 선택한 모드를 localStorage에 저장하기
  modalSelectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveMode(selectedValue);
    modeSelectModal.close();
  });

  // 페이지가 로드되면 저장했던 모드 불러오고, 라디오 버튼에 반영하기
  window.addEventListener("load", function () {
    const savedValue = localStorage.getItem("selectedMode");
    if (savedValue) {
      setRadioButton(savedValue);
    }
  });

  function saveMode(selectedValue) {
    modeRadioButtons.forEach((radio) => {
      if (radio.checked) {
        selectedValue = radio.value;
      }
    });

    if (selectedValue) {
      localStorage.setItem("selectedMode", selectedValue);
    }
  }

  function setRadioButton(savedValue) {
    const modeRadioButtons = document.querySelectorAll('input[name="mode"]');
    modeRadioButtons.forEach((radio) => {
      if (radio.value === savedValue) {
        radio.checked = true;
      }
    });
  }
}
