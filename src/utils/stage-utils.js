/**
 * stage-utils.js
 *
 * 모드/타입 저장 및 불러오기, 쿼리 추출을 담당하는 공통 유틸 모듈입니다.
 * - 모드 선택 (mode)
 * - 학습/게임 선택 (type)
 * - 단계 선택 (step)
 *
 * 사용 위치:
 * - home: 모드 저장
 * - stage: 타입 저장
 * - step: type, mode, step 불러오기
 */

/**
 * 1. 모드 저장 (home.html 모달창)
 * @param {"together" | "see" | "listen"} mode
 */
export function saveMode(mode) {
  if (["together", "see", "listen"].includes(mode)) {
    localStorage.setItem("mode", mode);
  } else {
    console.warn("⚠️ saveMode: 잘못된 mode 값 →", mode);
  }
}

/**
 * 2. 타입 저장 (학습하기 / 게임하기 버튼)
 * @param {"learn" | "game"} type
 */
export function saveType(type) {
  if (["learn", "game"].includes(type)) {
    localStorage.setItem("type", type);
  } else {
    console.warn("⚠️ saveType: 잘못된 type 값 →", type);
  }
}

/**
 * 3. URL에서 step 값을 추출합니다 (예: ?step=2)
 * @returns {string} step (기본값: "1")
 */
export function getStepFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("step") || "1";
}

/**
 * 4. type, mode, step 값을 모두 불러옵니다
 * - mode가 비어 있으면 기본값 "together" 반환
 * - step은 URL에서 추출
 * @returns {{ type: string | null, mode: string, step: string }}
 */
export function getStoredStageInfo() {
  return {
    type: localStorage.getItem("type") || null,
    mode: localStorage.getItem("mode") || "together", // 기본값
    step: getStepFromUrl(),
  };
}
