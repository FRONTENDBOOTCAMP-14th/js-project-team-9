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

const LOCAL_STORAGE_KEY = "userMusicSheets";

// 기본 제공 악보 데이터
const defaultMusicSheets = [
  {
    id: "default-1",
    name: "airplane",
    src: "/assets/images/airplane.png",
    type: "image",
    isDeletable: false,
  },
  {
    id: "default-2",
    name: "butterfly",
    src: "/assets/images/butterfly.png",
    type: "image",
    isDeletable: false,
  },
  {
    id: "default-3",
    name: "little-star",
    src: "/assets/pdf/little-star.pdf",
    type: "pdf",
    isDeletable: false,
  },
  {
    id: "default-4",
    name: "three-bears",
    src: "/assets/images/three-bears.png",
    type: "image",
    isDeletable: false,
  },
];

// 악보 선택 버튼을 누르면 악보 목록 갱신 후 모달 창 열기
musicSheetSelectButton.addEventListener("click", () => {
  renderMusicSheetCards();
  musicSheetSelectModal.showModal();
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

  if (!musicSheetCard || musicSheetCard.classList.contains("card-add")) return;

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

// 페이지 로드할 때 초기 악보 목록 렌더링
document.addEventListener("DOMContentLoaded", renderMusicSheetCards);

// 악보 카드 생성해서 반환하기
function createMusicSheetCard(musicSheet) {
  const li = document.createElement("li");
  li.classList.add("music-sheet-modal__card");
  li.dataset.type = musicSheet.type;
  li.dataset.src = musicSheet.src;

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
    deleteButton.setAttribute("aria-label", "악보 삭제");
    li.append(deleteButton);
  }

  return li;
}

// 악보 목록 렌더링하기
function renderMusicSheetCards() {
  // 악보 추가 버튼을 제외한 모든 악보 카드 제거
  const existingCards = musicSheetCardsContainer.querySelectorAll(
    ".music-sheet-modal__card:not(.card-add)"
  );
  existingCards.forEach((card) => card.remove());

  const userMusicSheets = loadUserMusicSheets();
  const allMusicSheets = [...defaultMusicSheets, ...userMusicSheets];

  const fragment = document.createDocumentFragment();
  allMusicSheets.forEach((musicSheet) => {
    fragment.append(createMusicSheetCard(musicSheet));
  });

  // 악보 추가 버튼 앞에 새로운 악보 카드들 삽입
  const addCard = musicSheetCardsContainer.lastElementChild;
  musicSheetCardsContainer.insertBefore(fragment, addCard);
}

// localStorage에서 사용자가 업로드한 악보 데이터 불러오기
function loadUserMusicSheets() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// localStorage에 사용자가 업로드한 악보 데이터 저장하기
function saveUserMusicSheets(musicSheets) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(musicSheets));
}

function handleDeleteMusicSheet(idToDelete) {
  const userMusicSheets = loadUserMusicSheets();
  const defaultMusicSheetIds = defaultMusicSheets.map(
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
  }
}
