// import { soundNote } from "./sound-utils.js";
// highlightkey 공통 모듈 import 필요(highlightKey()라고 가정하고 작성)
// soundNote와 highlightKey가 동시에 작동하는 playNote()도 import 필요(이름 변동 가능 o)

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
      if (type === "game") {
        startGameQuiz(auto, mode);
      } else {
        startLearnQuiz(auto, mode);
      }
      break;
  }
}
