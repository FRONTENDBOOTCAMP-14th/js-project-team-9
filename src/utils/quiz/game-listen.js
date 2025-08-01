// utils/quiz/game-listen.js

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

// TODO: 구현 예정
function mapKeyToNote(code) {
  console.warn("mapKeyToNote는 아직 구현되지 않았습니다.");
  return null;
}

function showClearModal() {
  console.warn("showClearModal은 아직 구현되지 않았습니다.");
}

/**
 * 듣고 맞히기 게임 모드 실행
 * @param {object} auto - { answer, allowedNotes, guideBefore, guideAfter }
 * @param {string} mode - "listen"
 */
export function startGameListen(auto, mode) {
  const {
    answer,
    allowedNotes = ["C", "D", "E", "F", "G", "A", "B"],
    guideBefore = "기준음이 될 건반을 하나 눌러주세요.",
    guideAfter = "기준음을 확인했습니다.",
    compareBy = "scaleName",
  } = auto;

  resetQuizState();
  initGameLife();

  speak(guideBefore);

  document.addEventListener("keydown", handleFirstInput);
  currentHandler = handleFirstInput;

  function handleFirstInput(e) {
    const inputNote = mapKeyToNote?.(e.code);
    if (!inputNote) return;

    const [scale] = inputNote.split(/(\d)/); // C4 → C

    if (!allowedNotes.includes(scale)) {
      speakText(`"${scale}"은 사용할 수 없습니다. 다시 눌러주세요.`);
      return;
    }

    document.removeEventListener("keydown", handleFirstInput);

    speak(`${guideAfter} 기준음은 ${inputNote}입니다.`);

    // 정답 출력
    setTimeout(() => {
      soundNote(answer);

      // 정답 입력 대기
      document.addEventListener("keydown", handleAnswerInput);
      currentHandler = handleAnswerInput;
    }, 600);
  }

  function handleAnswerInput(e) {
    const inputNote = mapKeyToNote?.(e.code);
    if (!inputNote) return;

    document.removeEventListener("keydown", handleAnswerInput);
    currentHandler = null;

    const isCorrect = compareNotes(inputNote, answer, compareBy);
    if (isCorrect) {
      speak("정답입니다!");
      showClearModal();
    } else {
      handleGameMistake(); // 실패 시 모달 + 상태 정리
    }
  }
}
