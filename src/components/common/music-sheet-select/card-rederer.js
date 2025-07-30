// 카드 생성 기능

import { DEFAULT_MUSIC_SHEETS } from "./constants";
import { loadUserMusicSheets } from "./storage-manager";

const musicSheetSelectModal = document.querySelector(".music-sheet-modal");
const musicSheetCardsContainer = musicSheetSelectModal.querySelector(
  ".music-sheet-modal__cards"
);

// 악보 카드 생성해서 반환하기
export function createMusicSheetCard(musicSheet) {
  const li = document.createElement("li");
  li.classList.add("music-sheet-modal__card");
  li.dataset.type = musicSheet.type;
  li.dataset.src = musicSheet.src;
  li.dataset.id = musicSheet.id;

  // 사용자가 추가한 악보면 isDeletable 클래스 추가
  if (musicSheet.isDeletable) {
    li.classList.add("isDeletable");
  }

  const button = document.createElement("button");
  button.type = "button";

  const img = document.createElement("img");
  img.src = "/assets/images/thumbnail-sheet-music.JPG";
  img.alt = "";
  img.width = "80";
  img.height = "60";

  const span = document.createElement("span");
  span.textContent = musicSheet.name;

  li.append(button);
  button.append(img, span);

  // 사용자가 추가한 악보에 삭제 버튼 추가
  if (musicSheet.isDeletable) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("card-delete-button");
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `${musicSheet.name} 악보 삭제`);
    li.append(deleteButton);
  }

  return li;
}

// 악보 목록 렌더링하기
export function renderMusicSheetCards() {
  // 악보 추가 버튼을 제외한 모든 악보 카드 제거
  const existingCards = musicSheetCardsContainer.querySelectorAll(
    ".music-sheet-modal__card:not(.card-add)"
  );
  existingCards.forEach((card) => card.remove());

  const userMusicSheets = loadUserMusicSheets();
  const allMusicSheets = [...DEFAULT_MUSIC_SHEETS, ...userMusicSheets];

  const fragment = document.createDocumentFragment();
  allMusicSheets.forEach((musicSheet) => {
    fragment.append(createMusicSheetCard(musicSheet));
  });

  // 악보 추가 버튼 앞에 새로운 악보 카드들 삽입
  const addCard = musicSheetCardsContainer.lastElementChild;
  musicSheetCardsContainer.insertBefore(fragment, addCard);
}
