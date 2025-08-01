import { soundNote } from "./sound-utils.js";
import { runQuiz } from "./quiz/quiz-index.js";

// TODO: 실제 구현 시 외부 모듈에서 import 예정
function HighlightKey(note) {
  console.warn(`HighlightKey("${note}") 호출됨 (더미 함수)`);
}

function playNote(note) {
  console.warn(`playNote("${note}") 호출됨 (더미 함수)`);
}

export function handleAutoAction(auto, mode) {
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
      runQuiz(auto, mode, type);
      break;
  }
}
