// utils/quiz/game-together.js

import { soundNote } from "../sound-utils.js";
import {
  resetQuizState,
  compareNotes,
  currentHandler,
  userInputs,
  initGameLife,
  handleGameMistake,
  generateRandomNotes,
  setCurrentHandler,
} from "./quiz-common.js";
import { speak, speakAndWait } from "../tts-utils.js";
import { showClearModal } from "../modal-utils.js";

// TODO: 키보드 키 → 음 이름 변환 로직 실제 구현 필요
export function mapKeyToNote(code) {
  console.warn(`mapKeyToNote('${code}') 호출됨 (아직 미구현)`);
  return "C4"; // 임시 테스트용
}

/**
 * 함께 맞히기 퀴즈 실행
 * @param {object} auto - 설명 데이터의 auto 항목
 * @param {string} mode - "together"
 */
export async function startGameQuizTogether(auto, mode) {
  const {
    count = 3,
    delayAfterText = true,
    compareBy = "scaleName",
    speak: speakText,
  } = auto;

  resetQuizState();
  initGameLife();

  // 설명 음성 재생
  if (speakText) {
    if (delayAfterText === true) {
      await speakAndWait(speakText);
    } else {
      speak(speakText);
    }
  }

  // 정답 음 랜덤 생성 및 순차 재생
  answerList = generateRandomNotes(count);
  await playNoteSequence(answerList, 600);

  // 사용자 입력 감지 시작
  document.addEventListener("keydown", handleKeyInput);
  setCurrentHandler(handleKeyInput);
}

// 외부 접근을 위해 최상단에 위치
let answerList = [];

/**
 * 음을 순차 재생
 * @param {string[]} notes
 * @param {number} delay
 */
async function playNoteSequence(notes, delay) {
  for (const note of notes) {
    soundNote(note);
    await sleep(delay);
  }
}

/**
 * 키보드 입력 핸들러
 */
function handleKeyInput(e) {
  const inputNote = mapKeyToNote?.(e.code);
  if (!inputNote) return;

  userInputs.push(inputNote);

  const currentIndex = userInputs.length - 1;
  const isCorrect = compareNotes(
    inputNote,
    answerList[currentIndex],
    "scaleName"
  );

  if (!isCorrect) {
    const failed = handleGameMistake(() => {
      document.removeEventListener("keydown", handleKeyInput);
      setCurrentHandler(null);
    });
    if (failed) return;
  }

  if (userInputs.length >= answerList.length) {
    document.removeEventListener("keydown", handleKeyInput);
    setCurrentHandler(null);
    speak("정답입니다!");
    showClearModal();
  }
}

/**
 * 일정 시간 대기
 */
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
