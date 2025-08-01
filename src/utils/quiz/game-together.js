// utils/quiz/game-together.js

import { soundNote } from "../sound-utils.js";
import {
  resetQuizState,
  compareNotes,
  currentHandler,
  userInputs,
  initGameLife,
  handleGameMistake,
} from "./quiz-common.js";
import { speak } from "../tts-utils.js";
// import { mapKeyToNote } from "../input-utils.js";
// import { showClearModal } from "../modal-utils.js";

// utils/input-utils.js

// TODO: 키보드 키 → 음 이름 변환 로직 실제 구현 필요
export function mapKeyToNote(code) {
  console.warn(`mapKeyToNote('${code}') 호출됨 (아직 미구현)`);

  // 예시: 테스트용으로 항상 "C4" 반환
  return "C4";
}

// utils/modal-utils.js

// TODO: 클리어 모달 표시 로직 구현 필요
export function showClearModal() {
  console.warn("showClearModal() 호출됨 (아직 미구현)");
}

/**
 * 랜덤 음 배열 생성 (예: C4~B4 중 랜덤으로 3개)
 */
function generateRandomNotes(count = 3) {
  const pool = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
  const notes = [];
  for (let i = 0; i < count; i++) {
    const random = pool[Math.floor(Math.random() * pool.length)];
    notes.push(random);
  }
  return notes;
}

/**
 * 함께 맞히기 퀴즈 실행
 * @param {object} auto - auto 객체 (note, count, delayAfterText)
 * @param {string} mode - "together"
 */
export function startGameQuizTogether(auto, mode) {
  const {
    count = 3,
    note,
    delayAfterText = 500,
    compareBy = "scaleName",
  } = auto;

  resetQuizState();
  initGameLife(); // 목숨 초기화

  const answerList = generateRandomNotes(count);

  // 음 순차 재생
  playNoteSequence(answerList, delayAfterText).then(() => {
    // 사용자 입력 받기
    document.addEventListener("keydown", handleKeyInput);
    currentHandler = handleKeyInput;
  });

  async function playNoteSequence(notes, delay) {
    for (const note of notes) {
      soundNote(note);
      await sleep(delay);
    }
  }

  function handleKeyInput(e) {
    const inputNote = mapKeyToNote?.(e.code);
    if (!inputNote) return;

    userInputs.push(inputNote);

    const currentIndex = userInputs.length - 1;
    const isCorrect = compareNotes(
      inputNote,
      answerList[currentIndex],
      compareBy
    );

    if (!isCorrect) {
      const failed = handleGameMistake(() => {
        document.removeEventListener("keydown", handleKeyInput);
        currentHandler = null;
      });
      if (failed) return; // 게임 종료
    }

    // 정답 누적 완료
    if (userInputs.length >= answerList.length) {
      document.removeEventListener("keydown", handleKeyInput);
      currentHandler = null;
      speak("정답입니다!");
      showClearModal();
    }
  }
}

/**
 * await sleep(ms) → 지연
 */
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
