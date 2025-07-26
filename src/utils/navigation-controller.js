/**
 * setupNavigation()
 *
 * 좌우 버튼 및 키보드 입력(←, →, Enter)으로 인덱스를 이동시키는 공통 모듈입니다.
 * 내부에 상태를 직접 가지지 않고, 외부에서 전달된 getIndex/setIndex 함수를 통해 상태를 관리합니다.
 *
 * 주요 기능:
 * - 이전/다음 버튼 클릭 시 인덱스 변경
 * - 키보드 입력(←, →, Enter)을 통한 인덱스 이동 (옵션화 가능)
 * - 이동 시 화면 갱신 콜백(onShow) 호출
 * - 범위를 벗어날 경우 사용자에게 안내(onAnnounce)
 * - shouldHandle() 함수를 통해 단축키 동작 조건 제어 가능
 * - 이벤트 핸들러를 안전하게 제거할 수 있는 cleanup 함수 반환
 *
 * ------------------------------------------------------------
 * 매개변수 설명
 * ------------------------------------------------------------
 * 필수:
 * - getIndex (Function): 현재 인덱스를 반환하는 함수
 * - setIndex (Function): 새로운 인덱스를 설정하는 함수
 * - onShow (Function): 인덱스 변경 시 실행할 콜백 함수 (예: 화면 갱신)
 * - totalCount (Number): 전체 항목 개수 (0 이상 정수)
 *
 * 선택:
 * - onAnnounce (Function): 경계값 도달 시 사용자에게 안내하는 콜백
 * - prevButton (HTMLElement): 이전 버튼 요소 (없어도 됨)
 * - nextButton (HTMLElement): 다음 버튼 요소 (없어도 됨)
 * - enableEnterKey (Boolean): Enter 키로 다음 이동 허용 여부 (기본값: false)
 * - enableArrowKeys (Boolean): ← / → 키 이동 허용 여부 (기본값: true)
 * - shouldHandle (Function): 단축키 처리 여부를 결정하는 함수 (기본값: 항상 true)
 *
 * ------------------------------------------------------------
 * 반환값
 * ------------------------------------------------------------
 * - cleanup (Function): 등록된 이벤트 리스너를 제거하는 함수
 *   → 컴포넌트 제거 시 호출하여 메모리 누수 방지
 *
 * 사용 예:
 * const cleanup = setupNavigation({ ... });
 * ...
 * cleanup(); // 필요 시 정리
 */

export function setupNavigation({
  getIndex,
  setIndex,
  onShow,
  onAnnounce,
  totalCount,
  prevButton,
  nextButton,
  enableEnterKey = false,
  enableArrowKeys = true,
  shouldHandle = () => true,
}) {
  if (typeof totalCount !== "number" || totalCount <= 0) {
    console.warn("setupNavigation: totalCount가 유효하지 않습니다.");
    return;
  }

  if (!prevButton && !nextButton) {
    console.warn(
      "setupNavigation: prevButton과 nextButton이 모두 없습니다. 최소 하나는 있어야 합니다."
    );
    return;
  }

  function goToIndex(newIndex) {
    const currentIndex = getIndex();

    if (newIndex < 0) {
      onAnnounce?.("처음 항목이므로 이전으로 이동할 수 없습니다.");
      return;
    }
    if (newIndex >= totalCount) {
      onAnnounce?.("마지막 항목이므로 다음으로 이동할 수 없습니다.");
      return;
    }

    if (newIndex !== currentIndex) {
      setIndex(newIndex);
      onShow(newIndex);
    }
  }

  function onPrevClick() {
    goToIndex(getIndex() - 1);
  }
  function onNextClick() {
    goToIndex(getIndex() + 1);
  }

  const handleKeyUp = (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (!shouldHandle()) return;

    if (enableArrowKeys && e.key === "ArrowLeft") {
      e.preventDefault();
      goToIndex(getIndex() - 1);
    }
    if (enableArrowKeys && e.key === "ArrowRight") {
      e.preventDefault();
      goToIndex(getIndex() + 1);
    }
    if (enableEnterKey && e.key === "Enter") {
      e.preventDefault();
      goToIndex(getIndex() + 1);
    }
  };

  if (prevButton) prevButton.addEventListener("click", onPrevClick);
  if (nextButton) nextButton.addEventListener("click", onNextClick);
  document.addEventListener("keyup", handleKeyUp);

  // cleanup 함수를 외부로 반환
  return function cleanupNavigation() {
    if (prevButton) prevButton.removeEventListener("click", onPrevClick);
    if (nextButton) nextButton.removeEventListener("click", onNextClick);
    document.removeEventListener("keyup", handleKeyUp);
  };
}
