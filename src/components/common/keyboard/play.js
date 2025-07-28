// piano-utils.js

/**
 * 이 함수는 건반 이름을 보고 '흰 건반'인지 알려주는 공통 모듈입니다.
 *
 * 예를 들어:
 * - "C4" → 흰 건반 (true)
 * - "F#4" → 검은 건반 (false)
 * - "E#5" → "F" → 흰 건반 (true)
 *
 * 참고: "E#"은 실제로는 "F"이고, "B#"은 "C"랑 같은 소리기 때문에 오류를 방지하여 자동 변환 기능을 넣었습니다.
 */
export function isWhiteKey(note) {
  let noteName = note.replace(/\d/g, ""); // 숫자 제거 ("C4" → "C")

  // 특별 표기 처리: "E#" → "F", "B#" → "C" 등
  const noteFix = {
    "E#": "F",
    "B#": "C",
    Fb: "E",
    Cb: "B",
  };

  if (noteFix[noteName]) {
    noteName = noteFix[noteName];
  }

  const whiteNotes = ["C", "D", "E", "F", "G", "A", "B"];
  return whiteNotes.includes(noteName);
}
