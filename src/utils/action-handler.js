// handle-auto-action.js

import { soundNote } from "./sound-utils.js";
import { runQuiz } from "./quiz/quiz-index.js";

// TODO: 실제 구현 시 외부 모듈에서 import 예정
function HighlightKey(note) {
  console.warn(`HighlightKey("${note}") 호출됨 (더미 함수)`);
}

function playNote(note) {
  console.warn(`playNote("${note}") 호출됨 (더미 함수)`);
}

/**
 * handleAutoAction()
 *
 * 설명창 또는 퀴즈 흐름에서 사용자가 선택한 항목의 action에 따라
 * 적절한 동작(소리 출력, 건반 강조, 퀴즈 실행 등)을 수행합니다.
 *
 * @param {object} auto - 설명/퀴즈 항목 객체 (action, note 등 포함)
 * @param {string} mode - 현재 모드 ("listen", "see", "together")
 * @param {string} type - 현재 타입 ("learn" 또는 "game")
 */
export function handleAutoAction(auto, mode, type) {
  const { action, note } = auto;

  switch (action) {
    case "soundNote":
      soundNote?.(note);
      break;

    case "showNote":
      HighlightKey?.(note);
      break;

    case "playNote":
      playNote?.(note);
      break;

    case "quizNote":
      runQuiz?.(auto, mode, type);
      break;

    default:
      console.warn(`handleAutoAction: 알 수 없는 action "${action}"`, auto);
  }
}
