import { life, handleGameMistake } from "../../../utils/quiz/quiz-common.js";
import { speak } from "../../../utils/tts-utils.js";

/**
 * 현재 life 값을 기반으로 UI 렌더링 + 접근성 + listen 모드 클릭 안내
 */
export function updateLifeBar(mode) {
  const lifeBar = document.querySelector(".life-bar-js");
  if (!lifeBar) return;

  lifeBar.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const img = document.createElement("img");
    const isAlive = i < life;

    img.src = isAlive
      ? "/assets/images/life.svg"
      : "/assets/images/life-lost.svg";
    img.alt = isAlive ? `남은 목숨 ${i + 1}` : `잃은 목숨 ${i + 1}`;
    img.classList.add("life-icon");

    lifeBar.appendChild(img);
  }

  // 스크린리더용 설명: 역할만 전달, 숫자는 speak()로
  lifeBar.setAttribute(
    "aria-label",
    "목숨 바입니다. 클릭하면 남은 기회를 음성으로 안내합니다."
  );

  if (mode === "listen") {
    lifeBar.onclick = () => {
      speak(`현재 남은 기회는 ${life}번입니다.`);
    };

    lifeBar.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        lifeBar.click();
      }
    });
  } else {
    // 다른 모드는 클릭 불가
    lifeBar.onclick = null;
  }
}

/**
 * 오답 처리: life 감소 + 실패 판단 + listen 모드 안내 + UI 갱신
 */
export function handleWrongAnswer(mode, onFail) {
  const didFail = handleGameMistake(onFail);

  if (mode === "listen") {
    speak(`틀렸습니다. 남은 기회는 ${life}번입니다.`);
  }

  updateLifeBar(mode);
}
