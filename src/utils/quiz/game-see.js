// utils/quiz/game-see.js

import { soundNote } from "../sound-utils.js";
import {
  resetQuizState,
  compareNotes,
  currentHandler,
  initGameLife,
  handleGameMistake,
  generateRandomNotes,
} from "./quiz-common.js";
// import { highlightKey } from "../visual-utils.js"; // 정답 건반 강조
// import { showClearModal } from "../modal-utils.js";

// TODO: 실제로 정답 건반을 강조하는 highlightKey 함수 구현 예정
export function highlightKey(note) {
  console.warn(`highlightKey('${note}') 호출됨 (아직 미구현)`);
}

// TODO: 클리어 모달 열기 기능 구현 예정
export function showClearModal() {
  console.warn("showClearModal() 호출됨 (아직 미구현)");
}

/**
 * 보고 맞히기 게임 모드 실행
 * @param {object} auto - { answer, distractors, compareBy }
 * @param {string} mode - "see"
 */
export function startGameSee(auto, mode) {
  const { count, compareBy = "scaleName" } = auto;

  resetQuizState();
  initGameLife();

  const answerList = generateRandomNotes(count);
  const answer = answerList[0];
  const distractors = answerList.slice(1);

  // 정답 강조 + 음 재생
  highlightKey?.(answer);
  soundNote(answer);

  // 일정 시간 후 선택 버튼 렌더링
  setTimeout(() => {
    renderQuizButtons(answer, distractors, compareBy);
  }, 800);
}

/**
 * 정답/오답 버튼 렌더링 및 클릭 핸들링
 */
function renderQuizButtons(answer, distractors, compareBy) {
  const container = document.querySelector(".quiz-button-list");
  if (!container) {
    console.warn("퀴즈 버튼 리스트(.quiz-button-list)를 찾을 수 없습니다.");
    return;
  }

  // 기존 버튼 초기화
  container.innerHTML = "";

  // 셔플된 버튼 리스트 생성
  const all = [...distractors, answer];
  const shuffled = shuffleArray(all);

  shuffled.forEach((note) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option__button, btn-square";
    btn.textContent = convertScaleToKorean(note);
    btn.onclick = () => handleAnswerClick(note, answer, compareBy);
    container.appendChild(btn);
  });
}

/**
 * 버튼 클릭 시 정답 판단
 */
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

/**
 * 배열 셔플 (Fisher-Yates)
 */
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
