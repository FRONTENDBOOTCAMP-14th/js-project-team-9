import { startLearnQuiz } from "./learn-quiz";
import { startGameQuizTogether } from "./game-together";
import { startGameSee } from "./game-see";
import { startGameListen } from "./game-listen";

export function runQuiz(auto, mode, type) {
  if (!type) {
    throw new Error("runQuiz: 'type'은 반드시 지정해야 합니다. (learn | game)");
  }

  if (type === "learn") {
    startLearnQuiz(auto);
  } else if (type === "game") {
    if (mode === "together") startGameQuizTogether(auto, mode);
    else if (mode === "see") startGameSee(auto, mode);
    else if (mode === "listen") startGameListen(auto, mode);
    else throw new Error(`runQuiz: 잘못된 mode: ${mode}`);
  } else {
    throw new Error(`runQuiz: 잘못된 type: ${type}`);
  }
}
