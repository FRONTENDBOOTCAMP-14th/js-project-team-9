// utils/modal-utils.js
const CLEAR_MODAL_SELECTOR = ".js-step-page-clearModal";
const FAIL_MODAL_SELECTOR = ".js-step-page-failedModal";
/**
 * 클리어 모달 열기
 */
export function showClearModal() {
  const modal = document.querySelector(CLEAR_MODAL_SELECTOR);
  if (!modal) {
    console.warn("클리어 모달이 존재하지 않습니다.");
    return;
  }
  modal.showModal();
}

/**
 * 실패 모달 열기
 */
export function showFailModal() {
  const modal = document.querySelector(FAIL_MODAL_SELECTOR);
  if (!modal) {
    console.warn("실패 모달이 존재하지 않습니다.");
    return;
  }
  modal.showModal();
}
