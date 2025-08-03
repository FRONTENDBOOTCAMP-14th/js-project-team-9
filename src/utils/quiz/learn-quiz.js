// utils/quiz/learn-quiz.js

import { soundNote } from "../sound-utils.js";
import {
  resetQuizState,
  compareNotes,
  generateHint,
  currentHandler,
  userInputs,
  setCurrentHandler,
} from "./quiz-common.js";
import { speak, speakAndWait } from "../tts-utils.js";
import { showClearModal } from "../modal-utils.js";
import { mapKeyToNote } from "../input-utils.js";

/**
 * 학습 모드 퀴즈 시작
 * @param {object} auto - 설명 데이터의 auto 항목
 */
export async function startLearnQuiz(auto) {
  const {
    note: answer,
    count = 1,
    speak: speakText,
    delayAfterText = true,
    compareBy = "scaleName",
  } = auto;

  resetQuizState();

  // 안내 음성
  if (speakText) {
    if (delayAfterText === true) {
      await speakAndWait(speakText);
    } else {
      speak(speakText);
    }
  }

  // 정답음 출력
  soundNote(answer);

  // 안내 후 키 입력 받기 시작
  document.addEventListener("keydown", handleKeyInput);
  setCurrentHandler(handleKeyInput);

  function handleKeyInput(e) {
    const inputNote = mapKeyToNote?.(e.code);
    if (!inputNote) return;

    userInputs.push(inputNote);

    if (userInputs.length >= count) {
      const isCorrect = compareNotes(userInputs[0], answer, compareBy);

      if (isCorrect) {
        document.removeEventListener("keydown", handleKeyInput);
        setCurrentHandler(null);

        speak("정답입니다!");
        showClearModal();
      } else {
        const wrong = userInputs[0];
        userInputs.length = 0; // 입력 초기화
        const hint = generateHint(wrong, answer, compareBy);
        const textBox = document.querySelector(".explain-box__content");
        if (textBox) textBox.textContent = hint;
        speak(hint);
      }
    }
  }
}
