// 모드 선택 버튼의 클래스 이름으로 수정 필요. 임의로 클래스 이름 붙임
const musicSheetSelectButton = document.querySelector(
  ".music-sheet__select-button"
);
const musicSheetSelectModal = document.querySelector(".music-sheet-modal");
const musicSheetModalCloseButton = musicSheetSelectModal.querySelector(
  ".music-sheet-modal__button-close"
);

// 모드 선택 버튼을 누르면 모달 창 열기
musicSheetSelectButton.addEventListener("click", () => {
  musicSheetSelectModal.showModal();
});

// 닫기 버튼을 누르면 모달 창 닫기
musicSheetModalCloseButton.addEventListener("click", () => {
  musicSheetSelectModal.close();
});
