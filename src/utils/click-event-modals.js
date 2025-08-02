import btnVolumeControl from "./buttons-volume-control.js";

const modalController = {
  volumeControl: btnVolumeControl,
  startModalSystem: async function () {
    const response = await fetch("/components/click-event-modals.html");
    const modalHTML = await response.text();
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modalBase = document.querySelector(".js-modal-base-modalBase");
    const modalContentArea = document.querySelector(
      ".js-modal-base-contentArea"
    );
    const modalCloseButton = document.querySelector(".js-modal-base-btnClose");

    const btnMenu = document.querySelector(".js-step-page-btnMenu");
    const btnConfirmClear = document.querySelector(
      ".js-step-page-clear-modal-btnConfirmClear"
    );
    const btnModeSelect = document.querySelector(".js-main-page-btnModeSelect");
    const btnSettings = document.querySelector(".js-step-page-btnSettings");

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
        if (modalContentArea.firstChild) {
          modalContentArea.firstChild.style.display = "none";
          document.body.appendChild(modalContentArea.firstChild);
        }
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

      const nodeToAppend = contentNode;
      nodeToAppend.style.display = "";
      modalContentArea.appendChild(nodeToAppend);

      if (
        nodeToAppend.classList.contains(
          "js-mode-select-modal-modeSelectModalWrapper"
        )
      ) {
        const savedMode = localStorage.getItem("mode");
        if (savedMode) {
          const radioToSelect = nodeToAppend.querySelector(
            `input[name="mode"][value="${savedMode}"]`
          );
          if (radioToSelect) {
            radioToSelect.checked = true;
          }
        }

        const modeForm = nodeToAppend.querySelector(".mode-select-modal__form");
        if (modeForm) {
          if (!modeForm.dataset.listenerAttached) {
            modeForm.addEventListener("change", (event) => {
              const selectedValue = event.target.value;
              if (selectedValue) {
                localStorage.setItem("mode", selectedValue);
                console.log("모드가 저장되었습니다:", selectedValue);
              }
            });
            modeForm.dataset.listenerAttached = "true";
          }
        }
      }

      if (
        nodeToAppend.classList.contains(
          "js-volume-controller-hotkeys-modal-volumeControllerHotkeysModalWrapper"
        )
      ) {
        btnVolumeControl.init(nodeToAppend);
      }

      modalBase.showModal();
    };

    if (modalBase) {
      modalBase.addEventListener("close", closeModal);
    }

    if (btnMenu) {
      btnMenu.addEventListener("click", () => openModal(continueRestartModal));
    }
    if (btnConfirmClear) {
      btnConfirmClear.addEventListener("click", () =>
        openModal(toBeUpdatedModal)
      );
    }
    if (btnModeSelect) {
      btnModeSelect.addEventListener("click", () => openModal(modeSelectModal));
    }
    if (btnSettings) {
      btnSettings.addEventListener("click", () =>
        openModal(volumeControllerHotkeysModal)
      );
    }
    if (modalCloseButton) {
      modalCloseButton.addEventListener("click", closeModal);
    }
  },
};

export default modalController;
