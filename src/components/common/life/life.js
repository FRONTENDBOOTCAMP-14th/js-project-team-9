import { life } from "../../../utils/quiz/quiz-common";
import { speak } from "../../../utils/tts-utils";

export function updateLifeBar(mode) {
  const lifeBar = document.querySelector(".life-bar-js");
  if (!lifeBar) return;

  lifeBar.innerHTML = "";

  // 이미지 채우기
  for (let i = 0; i < max; i++) {
    const img = document.createElement("img");
    img.src =
      i < life
        ? "../../../../assets/images/life.svg"
        : "../../../../assets/images/life-lost.svg";
    img.alt = i < life ? `목숨 ${i + 1}` : `잃은 목숨 ${i + 1}`;
    img.classList.add("life-icon");
    lifeBar.appendChild(img);
  }

  // 접근성 라벨도 동기화
  lifeBar.setAttribute("aria-label", `남은 목숨 ${life}개`);

  // 리슨 모드일 때 클릭하면 음성 안내
  if (mode === "listen") {
    lifeBar.onclick = () => speak?.(`남은 기회는 ${life}번입니다.`);
  } else {
    lifeBar.onclick = null; // 클릭 이벤트 제거
  }
}
