// utils/quiz/quiz-common.js

// 공통 상태
export let currentHandler = null; // keydown 핸들러 중복 방지용
export let userInputs = []; // 사용자 입력값 저장용 배열

/**
 * 퀴즈 상태 초기화
 * - 입력 배열 초기화
 * - 기존 키보드 이벤트 제거
 */
export function resetQuizState() {
  userInputs = [];

  if (currentHandler) {
    document.removeEventListener("keydown", currentHandler);
    currentHandler = null;
  }
}

/**
 * 입력값과 정답 비교
 * 기본값은 scaleName 기준(계이름만 비교), "exact"는 옥타브까지 포함
 */
export function compareNotes(input, answer, compareBy = "scaleName") {
  if (compareBy === "scaleName") {
    return parseNote(input)[0] === parseNote(answer)[0];
  } else if (compareBy === "exact") {
    return input === answer;
  }
  return false;
}

/**
 * 음 이름을 [계이름, 옥타브]로 분리 (예: "C#4" → ["C#", "4"])
 */
export function parseNote(note) {
  const match = note.match(/^([A-G]#?)(\d)$/);
  return match ? [match[1], match[2]] : [null, null];
}

export function convertScaleToKorean(note) {
  const map = {
    C: "도",
    "C#": "도#",
    D: "레",
    "D#": "레#",
    E: "미",
    F: "파",
    "F#": "파#",
    G: "솔",
    "G#": "솔#",
    A: "라",
    "A#": "라#",
    B: "시",
  };

  const [scale, octave] = parseNote(note);
  if (!scale || !map[scale]) return note;

  return octave ? `${map[scale]}${octave}` : map[scale]; // 옥타브 포함 여부 유연하게 처리
}

/**
 * 오답일 경우 힌트 생성 (상대 거리 기반 텍스트)
 * 예: "왼쪽으로 2칸 이동하세요"
 */
export function generateHint(input, answer) {
  const [inputNote, inputOct] = parseNote(input);
  const [answerNote, answerOct] = parseNote(answer);

  if (!inputNote || !answerNote) return "입력값을 확인할 수 없습니다.";

  const chromaticScale = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const inputIndex =
    chromaticScale.indexOf(inputNote) + parseInt(inputOct) * 12;
  const answerIndex =
    chromaticScale.indexOf(answerNote) + parseInt(answerOct) * 12;
  const diff = answerIndex - inputIndex;

  const direction = diff === 0 ? "정답입니다!" : diff > 0 ? "오른쪽" : "왼쪽";
  const distance = Math.abs(diff);

  const koreanNote =
    compareBy === "exact"
      ? convertScaleToKorean(`${inputNote}${inputOct}`)
      : convertScaleToKorean(inputNote); // 옥타브 제거!

  return diff === 0
    ? "정답입니다!"
    : `방금 누른 건반은 ${koreanNote}입니다. ${direction}으로 ${distance}칸 이동하세요.`;
}

// 현재 목숨 수
export let life = 3;

/**
 * 게임 시작 시 목숨 초기화
 * @param {number} max - 최대 목숨 수 (기본값 3)
 */
export function initGameLife(max = 3) {
  life = max;
}

/**
 * 오답 시 목숨 차감 및 실패 조건 확인
 * 실패 시 모달 출력 + 리스너 정리 함수 실행
 * @returns {boolean} 실패했는지 여부
 */
export function handleGameMistake(onFail) {
  life--;
  speakText?.(`틀렸습니다. 남은 기회는 ${life}번입니다.`);

  if (life <= 0) {
    onFail?.(); // 퀴즈 리스너 제거 등
    showFailModal(); // 공통 UI
    return true;
  }

  return false; // 아직 실패 아님
}

// utils/modal-utils.js

/**
 * 클리어 모달 열기
 * - HTML 구조에서 `.clear-modal` 클래스를 가진 요소가 있어야 합니다.
 */
export function showClearModal() {
  const modal = document.querySelector(".clear-modal");
  if (!modal) {
    console.warn("클리어 모달이 존재하지 않습니다.");
    return;
  }
  modal.style.display = "block";
}

/**
 * 실패 모달 열기
 * - HTML 구조에서 `.fail-modal` 클래스를 가진 요소가 있어야 합니다.
 */
export function showFailModal() {
  const modal = document.querySelector(".fail-modal");
  if (!modal) {
    console.warn("실패 모달이 존재하지 않습니다.");
    return;
  }
  modal.style.display = "block";
}
