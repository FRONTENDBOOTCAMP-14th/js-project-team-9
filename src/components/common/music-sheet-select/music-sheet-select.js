import { renderMusicSheetCards } from "./card-rederer";
import { setupEventListeners } from "./event-handlers";

document.addEventListener("DOMContentLoaded", () => {
  // 초기 악보 목록 렌더링
  renderMusicSheetCards();
  // 모든 이벤트 리스너 설정
  setupEventListeners();
});
