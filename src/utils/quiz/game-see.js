import { soundNote } from "../sound-utils.js";
import {
  resetQuizState,
  compareNotes,
  currentHandler,
  initGameLife,
  handleGameMistake,
  generateRandomNotes,
  convertScaleToKorean,
} from "./quiz-common.js";
import { showClearModal } from "../modal-utils.js";

// TODO: 실제로 정답 건반을 강조하는 highlightKey 함수 구현 예정
function highlightKey(note) {
  console.warn(`highlightKey('${note}') 호출됨 (아직 미구현)`);
}

/**
 * 보고 맞히기 게임 모드 실행
 * @param {object} auto - { count, compareBy }
 * @param {string} mode - "see"
 */
export function startGameSee(auto, mode) {
  const { count, compareBy = "scaleName" } = auto;

  resetQuizState();
  initGameLife();

  const answerList = generateRandomNotes(count);
  const answer = answerList[0];
  const distractors = answerList.slice(1);

  highlightKey?.(answer);
  soundNote(answer);

  setTimeout(() => {
    renderQuizButtons(answer, distractors, compareBy);
  }, 800);
}

function renderQuizButtons(answer, distractors, compareBy) {
  const container = document.querySelector(".quiz-button-list");
  if (!container) {
    console.warn("퀴즈 버튼 리스트(.quiz-button-list)를 찾을 수 없습니다.");
    return;
  }

  container.innerHTML = "";

  const all = [...distractors, answer];
  const shuffled = shuffleArray(all);

  shuffled.forEach((note) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option__button btn-square";
    btn.textContent = convertScaleToKorean(note);
    btn.onclick = (e) =>
      handleAnswerClick(note, answer, compareBy, e.currentTarget);
    container.appendChild(btn);
  });
}

function handleAnswerClick(selected, answer, compareBy, buttonElement) {
  const isCorrect = compareNotes(selected, answer, compareBy);
  if (isCorrect) {
    showClearModal();
  } else {
    buttonElement.classList.add("wrong");
    setTimeout(() => {
      buttonElement.classList.remove("wrong");
    }, 500);
    handleGameMistake();
  }
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
