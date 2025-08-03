import { soundNote } from "../../../utils/sound-utils";

const octave6 = document.querySelector(".octave-6");

// 데스크탑 뷰에서의 반응형 구현
function updateOctaveVisibility() {
  if (window.innerWidth >= 1200) {
    octave6.removeAttribute("hidden");
  } else {
    octave6.setAttribute("hidden", "");
  }
}

updateOctaveVisibility();
window.addEventListener("resize", updateOctaveVisibility);

// Enter키와 Space키를 입력 시 건반 focus
document.querySelectorAll(".white-key, .black-key").forEach((key) => {
  key.addEventListener("keydown", (e) => {
    const isEnter = e.key === "Enter";
    const isSpace = e.key === " ";

    if (isEnter || isSpace) {
      e.preventDefault();
      const note = key.dataset.note;
      pressKey(soundNote); // 이미 정의된 함수로 음 재생
    }
  });
});

function highlightKey(note) {
  const button = document.querySelector(`[data-note="${note}"]`);
  const svg = button.querySelector("svg");
  const keyPressedPath = svg.querySelector(".key-pressed");
  if (!keyPressedPath) return;

  keyPressedPath.setAttribute("opacity", "1");
  setTimeout(() => {
    keyPressedPath.setAttribute("opacity", "0");
  }, 150); // 혹은 애니메이션에 맞게
}

function pressKey(soundNote) {
  highlightKey(soundNote);
  // 기존 음 재생 함수 호출 등
}

// 키보드 포커스 이벤트
const keys = document.querySelectorAll(".white-key, .black-key");

keys.forEach((key) => {
  key.addEventListener("focus", () => {
    const note = key.dataset.note;
    console.log("작동됨 🎹", note); // 👉 이걸로 먼저 확인
  });
});
