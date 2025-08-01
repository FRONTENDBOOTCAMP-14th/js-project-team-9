// utils/quiz/learn-quiz.js

import { soundNote } from "../sound-utils.js";
import {
  resetQuizState,
  compareNotes,
  generateHint,
  currentHandler,
  userInputs,
} from "./quiz-common.js";
import { speak } from "../tts-utils.js";
// import { mapKeyToNote } from "../input-utils.js";
// import { showClearModal } from "../modal-utils.js";

// TODO: 실제 구현되면 제거 예정 - 더미 함수로 임시 대체
function mapKeyToNote(code) {
  console.warn(`mapKeyToNote("${code}") 호출됨 (더미 함수)`);
  return "C4"; // 임시 테스트용
}

function showClearModal() {
  console.warn("showClearModal() 호출됨 (더미 함수)");
}

/**
 * 학습 모드 퀴즈 시작
 * @param {object} auto - 설명 데이터의 auto 항목
 */
export function startLearnQuiz(auto) {
  const {
    note: answer,
    count = 1,
    speak: speakText,
    delayAfterText = 500,
    compareBy = "scaleName",
  } = auto;

  resetQuizState();

  // 정답음 출력
  soundNote(answer);

  // 음성 안내
  if (speakText) speak(speakText);

  // 일정 시간 후 입력 시작
  setTimeout(() => {
    document.addEventListener("keydown", handleKeyInput);
    currentHandler = handleKeyInput;
  }, delayAfterText);

  function handleKeyInput(e) {
    const inputNote = mapKeyToNote?.(e.code);
    if (!inputNote) return;

    userInputs.push(inputNote);

    if (userInputs.length >= count) {
      document.removeEventListener("keydown", handleKeyInput);
      currentHandler = null;

      const isCorrect = compareNotes(userInputs[0], answer, compareBy);
      if (isCorrect) {
        speak("정답입니다!");
        showClearModal();
      } else {
        const hint = generateHint(userInputs[0], answer, compareBy);
        speak(hint);
      }
    }
  }
}
