import { soundNote } from "../../../utils/sound-utils.js";

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

const keys = document.querySelectorAll(".white-key, .black-key");

// 키 강조
keys.forEach((key) => {
  key.addEventListener("focus", () => {
    key.classList.add("pressed");
  });

  key.addEventListener("blur", () => {
    key.classList.remove("pressed");
  });
});

keys.forEach((key) => {
  key.addEventListener("click", () => {
    const note = key.dataset.note;
    if (note) soundNote(note);
  });
});
