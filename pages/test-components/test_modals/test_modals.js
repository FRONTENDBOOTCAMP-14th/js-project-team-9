/* 코드 전체 흐름을 위한 메모

1. 클릭이벤트의 대상이 되는 버튼을 클릭함에 따라서 컴포넌트가 선택됨.(document.querySelector 활용)(addeventlisnter click활용)
.js-step-page-btnMenu(클릭이벤트의 대상이 되는 버튼) .js-continue-restart-modal-continueRestartModalWrapper(선택되는 컴포넌트)
.js-clear-modal-btnConfirmClear(클릭이벤트의 대상이 되는 버튼) .js-to-be-updated-announce-modal-toBeUpdatedAnnounceModalWrapper(선택되는 컴포넌트)
.js-mode-select-modal-btnModeSelect(클릭이벤트의 대상이 되는 버튼) .js-mode-select-modal-modeSelectModalWrapper(선택되는 컴포넌트)

2. 상태이벤트의 대상이 되는 요소에 따라서 컴포넌트가 선택됨.(document.querySelector 활용)
상태이벤트로 반환받은 값이 isNoLife일 때, .js-retry-announce-modal-retryAnnounceModalWrapper'를 선택함.

3. 1.,2.에서 클릭이나 상태이벤트의 대상으로 선택된 컴포넌트를 html에서 .js-modal-base-modalBase의 자식요소 중js-modal-base-contentArea(div태그)를 깨끗이 비우면서 안에 넣음

4. 화면 한가운데에 3.의 과정을 거친 전체 모달 컴포넌트가 나타남

5. .js-modal-base-btnClose을 누르면 모달창이 닫힘.
*/

  // 모달 베이스 변수 선언
  const modalBase = document.querySelector('.js-modal-base-modalBase');
  const modalContentArea = document.querySelector('.js-modal-base-contentArea');
  const modalCloseButton = document.querySelector('.js-modal-base-btnClose');

  // 모달을 여는 트리거 버튼들 변수 선언
  const btnMenu = document.querySelector('.js-step-page-btnMenu');
  const btnConfirmClear = document.querySelector('.js-clear-modal-btnConfirmClear');
  const btnModeSelect = document.querySelector('.js-main-page-btnModeSelect');

  // 모달에 들어갈 컨텐츠 wrapper
  const continueRestartModal = document.querySelector('.js-continue-restart-modal-continueRestartModalWrapper');
  const toBeUpdatedModal = document.querySelector('.js-to-be-updated-announce-modal-toBeUpdatedAnnounceModalWrapper');
  const modeSelectModal = document.querySelector('.js-mode-select-modal-modeSelectModalWrapper');
  // const retryAnnounceModal = document.querySelector('.js-retry-announce-modal-retryAnnounceModalWrapper');
  
const closeModal = () => {
    modalBase.close();
  };
  const openModal = (contentNode) => {
    modalContentArea.innerHTML = '';
    const clonedNode = contentNode.cloneNode(true);
    clonedNode.style.display = '';
    modalContentArea.appendChild(clonedNode);
    modalBase.showModal();
  };
  modalBase.addEventListener('close', () => {
    modalContentArea.innerHTML = '';
  });

  btnMenu.addEventListener('click', () => {
    openModal(continueRestartModal);
  });

  btnConfirmClear.addEventListener('click', () => {
    openModal(toBeUpdatedModal);
  });

  btnModeSelect.addEventListener('click', () => {
    openModal(modeSelectModal);
  });

  modalCloseButton.addEventListener('click', closeModal);
  
// 하트가 없다던가(isNoLife)등 하는 조건일 때 다시해보세요 모달 띄우기
/* 
const handleStateChange = (state) => {
  if (state === 'isNoHeart') {
    openModal(retryAnnounceModal);
  }
};
*/
// 지은님께서 작성해주신 form요소 loacal storage 기능 추가 파트
// 내부 컨텐츠를 복사할때 js코드는 복제되지 않으므로, 이벤트 위임으로 처리를 고려
/*
const modalSelectForm = modeSelectModal.querySelector(
    ".mode-select-modal__form"
  );

const modeRadioButtons =
    modalSelectForm.querySelectorAll('input[name="mode"]');

let selectedValue;

// 확인 버튼을 누르면 선택한 모드를 localStorage에 저장하기
  modalSelectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveMode(selectedValue);
 closeModal()  });

  // 페이지가 로드되면 저장했던 모드 불러오고, 라디오 버튼에 반영하기
  window.addEventListener("load", function () {
    const savedValue = localStorage.getItem("selectedMode");
    if (savedValue) {
      setRadioButton(savedValue);
    }
  });

function saveMode(selectedValue) {
    console.log('saveMode 함수 실행됨!');
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
  */