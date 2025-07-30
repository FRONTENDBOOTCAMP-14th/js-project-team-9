// 이벤트 핸들러

import { DEFAULT_MUSIC_SHEETS } from "./constants.js";
import { loadUserMusicSheets, saveUserMusicSheets } from "./storage-manager.js";
import { renderMusicSheetCards } from "./card-rederer.js";

const musicSheetSelectButton = document.querySelector(
  ".music-sheet__select-button"
);
const musicSheetSelectModal = document.querySelector(".music-sheet-modal");
const musicSheetModalCloseButton = musicSheetSelectModal.querySelector(
  ".music-sheet-modal__button-close"
);
const inputFile = musicSheetSelectModal.querySelector("#card-add");
const musicSheetCardsContainer = musicSheetSelectModal.querySelector(
  ".music-sheet-modal__cards"
);
const musicSheetDisplay = document.querySelector(".music-sheet");
const closeMusicSheetDisplayButton = document.querySelector(
  ".music-sheet__close-button"
);

// 모달 내에서 포커싱된 카드의 인덱스 저장하는 변수
let currentCardIndex = -1;

export function focusFirstCard() {
  requestAnimationFrame(() => {
    const firstCard = musicSheetCardsContainer.querySelector(
      ".music-sheet-modal__card:not(.card-add) button"
    );
    if (firstCard) {
      firstCard.focus();
      const focusCards = [
        ...musicSheetCardsContainer.querySelectorAll(
          ".music-sheet-modal__card>button:not(.card-delete-button), .card-add label"
        ),
      ];
      currentCardIndex = focusCards.indexOf(firstCard);
    } else {
      currentCardIndex = -1;
    }
  });
}

export function handleDeleteMusicSheet(idToDelete) {
  const userMusicSheets = loadUserMusicSheets();
  const defaultMusicSheetIds = DEFAULT_MUSIC_SHEETS.map(
    (musicSheet) => musicSheet.id
  );

  if (defaultMusicSheetIds.includes(idToDelete)) {
    alert("기본 제공 악보는 삭제할 수 없습니다.");
    return;
  }

  const updatedUserMusicSheets = userMusicSheets.filter(
    (musicSheet) => musicSheet.id !== idToDelete
  );

  if (userMusicSheets.length !== updatedUserMusicSheets.length) {
    saveUserMusicSheets(updatedUserMusicSheets);
    renderMusicSheetCards();
    focusFirstCard();
  }
}

export function setupEventListeners() {
  // 악보 선택 버튼을 누르면 악보 목록 갱신 후 모달 창 열기
  musicSheetSelectButton.addEventListener("click", () => {
    renderMusicSheetCards();
    musicSheetSelectModal.showModal();
    focusFirstCard();
  });

  // 닫기 버튼을 누르면 모달 창 닫기
  musicSheetModalCloseButton.addEventListener("click", () => {
    musicSheetSelectModal.close();
  });

  // 선택한 악보 파일 종류에 따라 .music-sheet에 렌더링하기
  musicSheetSelectModal.addEventListener("click", ({ target }) => {
    // 삭제 버튼 클릭 이벤트 처리
    const deleteButton = target.closest(".card-delete-button");
    if (deleteButton) {
      const cardToDelete = deleteButton.closest(".music-sheet-modal__card");
      if (cardToDelete) {
        const musicSheetIdToDelete = cardToDelete.dataset.id;
        handleDeleteMusicSheet(musicSheetIdToDelete);
      }
      return;
    }

    const musicSheetCard = target.closest(".music-sheet-modal__card");

    if (!musicSheetCard || musicSheetCard.classList.contains("card-add"))
      return;

    const musicSheetType = musicSheetCard.dataset.type;
    const musicSheetSrc = musicSheetCard.dataset.src;

    const fragment = document.createDocumentFragment();
    let musicSheetElement;

    if (musicSheetType === "pdf") {
      musicSheetElement = document.createElement("iframe");
      musicSheetElement.src = musicSheetSrc;
      musicSheetElement.type = "application/pdf";
    } else if (musicSheetType === "image") {
      musicSheetElement = document.createElement("img");
      musicSheetElement.src = musicSheetSrc;
      musicSheetElement.alt = "악보";
    } else {
      console.warn("지원하지 않는 파일 형식입니다:", musicSheetType);
      return;
    }

    musicSheetElement.classList.add("music-sheet__container");
    fragment.append(musicSheetElement);
    // musicSheetDisplay.innerHTML = "";
    musicSheetDisplay.append(fragment);

    musicSheetSelectButton.hidden = true;

    musicSheetDisplay.classList.add("hasMusicSheet");
    closeMusicSheetDisplayButton.hidden = false;

    musicSheetSelectModal.close();
  });

  // 화살표 키로 접근했을 때의 작동 기능
  musicSheetSelectModal.addEventListener("keydown", (e) => {
    if (
      !musicSheetSelectModal.open ||
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
    )
      return;

    const focusCards = [
      ...musicSheetCardsContainer.querySelectorAll(
        ".music-sheet-modal__card>button:not(.card-delete-button), .card-add label"
      ),
    ];
    const focusedCard = document.activeElement;
    const numColumns = window.innerWidth >= 1024 ? 6 : 4;

    let nextCardIndex = currentCardIndex;

    currentCardIndex = focusCards.indexOf(focusedCard);

    switch (e.key) {
      case "ArrowUp":
        nextCardIndex -= numColumns;
        break;
      case "ArrowDown":
        nextCardIndex += numColumns;
        break;
      case "ArrowLeft":
        nextCardIndex--;
        break;
      case "ArrowRight":
        nextCardIndex++;
        break;
    }

    if (nextCardIndex < 0) {
      nextCardIndex = focusCards.length - 1;
    } else if (nextCardIndex >= focusCards.length) {
      nextCardIndex = 0;
    }

    if (focusCards[nextCardIndex]) {
      focusCards[nextCardIndex].focus();
      currentCardIndex = nextCardIndex;
    }
  });

  // 파일 업로드 이벤트
  inputFile.addEventListener("change", ({ target }) => {
    const file = target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      // Data URL(Base64 인코딩)
      const fileContent = target.result;
      // 확장자 제거한 파일 이름
      const fileName = file.name.split(".").slice(0, -1).join(".");
      const fileType = file.type.startsWith("image/") ? "image" : "pdf";

      const newUserMusicSheet = {
        // 고유 id 생성하여 삭제할 때 파일을 찾을 수 있도록 함
        id: `user-${Math.random().toString(36).substring(2, 10)}`,
        name: fileName,
        // Base64 Data URL로 저장
        src: fileContent,
        type: fileType,
        isDeletable: true,
      };

      const userMusicSheets = loadUserMusicSheets();
      userMusicSheets.push(newUserMusicSheet);
      saveUserMusicSheets(userMusicSheets);

      // 새로 추가된 악보를 포함한 목록 다시 렌더링
      renderMusicSheetCards();

      // 파일 인풋 초기화
      inputFile.value = "";
    };

    // 파일을 Data URL(Base64)로 읽기
    reader.readAsDataURL(file);
  });

  // 이미 띄운 악보 치우는 버튼 클릭 이벤트
  closeMusicSheetDisplayButton.addEventListener("click", () => {
    const currentMusicSheet = musicSheetDisplay.querySelector(
      ".music-sheet__container"
    );
    if (currentMusicSheet) {
      currentMusicSheet.remove();
    }
    musicSheetDisplay.classList.remove("hasMusicSheet");
    closeMusicSheetDisplayButton.hidden = true;
    musicSheetSelectButton.hidden = false;
  });
}
