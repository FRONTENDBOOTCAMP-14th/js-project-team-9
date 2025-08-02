/**
 * loadExplanations()
 *
 * 학습/게임 단계에서 설명 데이터를 불러오는 공통 모듈입니다.
 *
 * ▸ 설명 JSON은 반드시 public/step-data/... 경로에 위치해야 하며,
 *    fetch 시 Vite의 BASE_URL 경로(`/`, `/프로젝트명/` 등)에 자동 대응합니다.
 *
 * ▸ 매개변수:
 * - type: "learn" 또는 "game"
 * - mode: "together" | "see" | "listen"
 * - step: 1 이상의 정수 (문자열도 허용됨)
 *
 * ▸ 반환: 설명 객체 배열 (예: [{ text, speak, retry }, ...])
 *
 * 사용 예:
 * await loadExplanations({ type: "learn", mode: "together", step: 1 });
 *
 * ⚠️ 반드시 await과 함께 사용해야 하며, JSON 파일이 없거나 fetch 오류 발생 시 빈 배열([])을 반환합니다.
 * ⚠️ 이 함수는 Vite 환경(dev/build)에 최적화되어 있습니다.
 *    Live Server 또는 file:// 경로에서는 import.meta.env.BASE_URL이 동작하지 않을 수 있습니다.
 */

export async function loadExplanations({ type, mode, step }) {
  if (!type || !mode || step == null) {
    console.warn("loadExplanations: type, mode, step는 필수입니다.");
    return [];
  }

  const stepNum = Number(step);
  if (!Number.isInteger(stepNum) || stepNum <= 0) {
    console.warn("loadExplanations: step 값이 1 이상의 정수가 아닙니다.");
    return [];
  }

  // Vite의 BASE_URL을 기준으로 경로 설정
  const path = `${import.meta.env.BASE_URL}step-data/${type}/${mode}/step-${stepNum}.json`;

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Fetch 실패: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("데이터는 배열이어야 합니다.");
    return data;
  } catch (err) {
    console.error("loadExplanations 에러:", err.message);
    return [];
  }
}
