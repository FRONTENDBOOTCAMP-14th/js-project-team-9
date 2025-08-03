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
import { mapKeyToNote } from "../input-utils.js";
import { updateLifeBar } from "../../components/common/life/life.js";

// 외부 접근을 위해 최상단에 위치
let answerList = [];

/**
 * 함께 맞히기 퀴즈 실행
 * @param {object} auto - 설명 데이터의 auto 항목
 * @param {string} mode - "together"
 */
export async function startGameQuizTogether(auto, mode, type) {
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

  /**
   * 키보드 입력 핸들러
   */
  function handleKeyInput(e) {
    const inputNote = mapKeyToNote?.(e.code);
    if (!inputNote) return;

    soundNote(inputNote);

    const currentIndex = userInputs.length;
    const isCorrect = compareNotes(
      inputNote,
      answerList[currentIndex],
      compareBy
    );

    if (!isCorrect) {
      const failed = handleGameMistake(() => {
        document.removeEventListener("keydown", handleKeyInput);
        setCurrentHandler(null);
      });

      updateLifeBar(mode, type);

      if (failed) return;
      return;
    }

    userInputs.push(inputNote); // 정답이면 push

    if (userInputs.length >= answerList.length) {
      document.removeEventListener("keydown", handleKeyInput);
      setCurrentHandler(null);
      speak("정답입니다!");
      showClearModal();
    }
  }

  // 사용자 입력 감지 시작
  document.addEventListener("keydown", handleKeyInput);
  setCurrentHandler(handleKeyInput);
}

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
 * 일정 시간 대기
 */
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
