/**
 * 📦 setupNavigation()
 *
 * 좌우 버튼으로 페이지(또는 설명 등)를 넘기는 기능을 공통으로 처리합니다.
 * 이 함수는 내부적으로 index 값을 직접 가지지 않고,
 * 외부에서 제공받은 get/set 함수로 상태를 조작합니다.
 *
 * 화면을 업데이트할 때는 onShow(index),
 * 안내 메시지가 필요하면 onAnnounce("문구")를 호출합니다.
 *
 * ----------------------------------------------------------
 * ✅ 사용 예시:
 *
 * let currentIndex = 0;
 *
 * setupNavigation({
 *   getIndex: () => currentIndex,
 *   setIndex: (newIndex) => currentIndex = newIndex,
 *   onShow: (indexToShow) => renderExplanation(indexToShow),
 *   onAnnounce: (messageText) => {
 *     const statusBox = document.getElementById("status-box");
 *     if (statusBox) statusBox.textContent = messageText;
 *   },
 *   totalCount: explanations.length,
 *   prevButton: document.querySelector(".btn-prev"),
 *   nextButton: document.querySelector(".btn-next"),
 * });
 */

export function setupNavigation({
  getIndex, // 현재 index를 반환하는 함수
  setIndex, // index를 업데이트하는 함수
  onShow, // index가 바뀌었을 때 실행되는 화면 갱신 함수
  onAnnounce, // (선택) 메시지 안내 함수 (예: 스크린리더 텍스트)
  totalCount, // 전체 항목 수
  prevButton, // 이전 버튼 요소
  nextButton, // 다음 버튼 요소
}) {
  if (!prevButton || !nextButton) {
    console.warn("setupNavigation: 버튼 요소가 없습니다.");
    return;
  }

  prevButton.addEventListener("click", () => {
    const currentIndex = getIndex();
    if (currentIndex <= 0) {
      onAnnounce?.("처음 항목이므로 이전으로 이동할 수 없습니다.");
      return;
    }

    const newIndex = currentIndex - 1;
    setIndex(newIndex);
    onShow(newIndex);
  });

  nextButton.addEventListener("click", () => {
    const currentIndex = getIndex();
    if (currentIndex >= totalCount - 1) {
      onAnnounce?.("마지막 항목이므로 다음으로 이동할 수 없습니다.");
      return;
    }

    const newIndex = currentIndex + 1;
    setIndex(newIndex);
    onShow(newIndex);
  });
}
