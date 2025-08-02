/* 코드 전체 흐름을 위한 메모

0.전체모달기능의 html을 fetch("/components/click-event-modals.html") 불러온다.

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
import btnVolumeControl from "./buttons-volume-control.js";

const modalController = {
  volumeControl: btnVolumeControl,
  startModalSystem: async function () {
    // HTML 파일을 불러와서 body에 추가하기
    const response = await fetch("/components/click-event-modals.html");
    const modalHTML = await response.text();
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // 모달 베이스 변수 선언
    const modalBase = document.querySelector(".js-modal-base-modalBase");
    const modalContentArea = document.querySelector(
      ".js-modal-base-contentArea"
    );
    const modalCloseButton = document.querySelector(".js-modal-base-btnClose");

    // 모달을 여는 트리거 버튼들 변수 선언
    const btnMenu = document.querySelector(".js-step-page-btnMenu");
    const btnConfirmClear = document.querySelector(
      ".js-step-page-clear-modal-btnConfirmClear"
    );
    const btnModeSelect = document.querySelector(".js-main-page-btnModeSelect");
    const btnSettings = document.querySelector(".js-step-page-btnSettings");

    // 모달에 들어갈 컨텐츠 wrapper
    const continueRestartModal = document.querySelector(
      ".js-continue-restart-modal-continueRestartModalWrapper"
    );
    const toBeUpdatedModal = document.querySelector(
      ".js-to-be-updated-announce-modal-toBeUpdatedAnnounceModalWrapper"
    );
    const modeSelectModal = document.querySelector(
      ".js-mode-select-modal-modeSelectModalWrapper"
    );
    const volumeControllerHotkeysModal = document.querySelector(
      ".js-volume-controller-hotkeys-modal-volumeControllerHotkeysModalWrapper"
    );

    const closeModal = () => {
      if (modalBase) {
        modalBase.close();
      }
    };

    const openModal = (contentNode) => {
      if (!modalContentArea || !contentNode || !modalBase) {
        console.error("openModal 필수 요소 없음!", {
          modalContentArea,
          contentNode,
          modalBase,
        });
        return;
      }

      modalContentArea.innerHTML = "";
      const clonedNode = contentNode.cloneNode(true);
      clonedNode.style.display = "";
      modalContentArea.appendChild(clonedNode);
      if (
        contentNode.classList.contains(
          "js-mode-select-modal-modeSelectModalWrapper"
        )
      ) {
        const modeForm = clonedNode.querySelector(".mode-select-modal__form");
        if (modeForm) {
          modeForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const selectedRadio = modeForm.querySelector(
              'input[name="mode"]:checked'
            );
            if (selectedRadio) {
              localStorage.setItem("mode", selectedRadio.value);
              window.location.href = "step.html?step=1";
            } else {
              alert("모드를 선택해주세요!");
            }
          });
        }
      }
      if (
        contentNode.classList.contains(
          "js-volume-controller-hotkeys-modal-volumeControllerHotkeysModalWrapper"
        )
      ) {
        btnVolumeControl.init(clonedNode);
      }
      modalBase.showModal();
    };

    if (modalBase) {
      modalBase.addEventListener("close", () => {
        modalContentArea.innerHTML = "";
      });
    }

    if (btnMenu) {
      btnMenu.addEventListener("click", () => {
        openModal(continueRestartModal);
      });
    }

    if (btnConfirmClear) {
      btnConfirmClear.addEventListener("click", () => {
        openModal(toBeUpdatedModal);
      });
    }

    if (btnModeSelect) {
      btnModeSelect.addEventListener("click", () => {
        openModal(modeSelectModal);
      });
    }

    if (btnSettings) {
      btnSettings.addEventListener("click", () => {
        openModal(volumeControllerHotkeysModal);
      });
    }

    if (modalCloseButton) {
      modalCloseButton.addEventListener("click", closeModal);
    }
  },
};

export default modalController;
