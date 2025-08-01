import { soundNote } from "../sound-utils.js";
import {
  resetQuizState,
  compareNotes,
  currentHandler,
  userInputs,
  initGameLife,
  handleGameMistake,
  convertScaleToKorean,
} from "./quiz-common.js";
import { speak } from "../tts-utils.js";
import { showClearModal } from "../modal-utils.js";

// TODO: 키 → 노트 매핑
function mapKeyToNote(code) {
  console.warn("mapKeyToNote는 아직 구현되지 않았습니다.");
  return "C4"; // 임시 테스트
}

// 기준음을 기준으로 랜덤 정답 생성
function generateRelativeNote(baseNote) {
  const chromaticScale = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const [scale, octaveStr] = baseNote.match(/^([A-G]#?)(\d)$/).slice(1);
  const octave = parseInt(octaveStr);

  const baseIndex = chromaticScale.indexOf(scale) + octave * 12;
  const randomDiff = [-2, -1, 1, 2][Math.floor(Math.random() * 4)];

  const newIndex = baseIndex + randomDiff;
  const newScale = chromaticScale[newIndex % 12];
  const newOctave = Math.floor(newIndex / 12);

  return `${newScale}${newOctave}`;
}

/**
 * 듣고 맞히기 게임 모드 실행
 * @param {object} auto - { allowedNotes, guideBefore, guideAfter }
 * @param {string} mode - "listen"
 */
export function startGameListen(auto, mode) {
  const {
    allowedNotes = ["C", "D", "E", "F", "G", "A", "B"],
    guideBefore = "기준음이 될 건반을 하나 눌러주세요.",
    guideAfter = "기준음을 확인했습니다.",
    compareBy = "scaleName",
  } = auto;

  resetQuizState();
  initGameLife();

  speak(guideBefore);

  document.addEventListener("keydown", handleFirstInput);
  currentHandler = handleFirstInput;

  function handleFirstInput(e) {
    const inputNote = mapKeyToNote?.(e.code);
    if (!inputNote) return;

    const [scale, oct] = inputNote.match(/^([A-G]#?)(\d)$/)?.slice(1) ?? [];
    if (!allowedNotes.includes(scale)) {
      speak(`"${scale}"은 사용할 수 없습니다. 다시 눌러주세요.`);
      return;
    }

    document.removeEventListener("keydown", handleFirstInput);

    const answer = generateRelativeNote(inputNote);

    const koreanInput = convertScaleToKorean(inputNote);
    speak(`${guideAfter} 기준음은 ${koreanInput}입니다.`);

    setTimeout(() => {
      soundNote(answer);

      // 음을 재생하고 정답 입력 대기
      document.addEventListener("keydown", (e) => handleAnswerInput(e, answer));
      currentHandler = (e) => handleAnswerInput(e, answer);
    }, 600);
  }

  function handleAnswerInput(e, answer) {
    const inputNote = mapKeyToNote?.(e.code);
    if (!inputNote) return;

    document.removeEventListener("keydown", currentHandler);
    currentHandler = null;

    const isCorrect = compareNotes(inputNote, answer, compareBy);
    if (isCorrect) {
      const koreanAnswer = convertScaleToKorean(answer);
      speak(`정답입니다! ${koreanAnswer}을 잘 눌렀어요.`);
      showClearModal();
    } else {
      handleGameMistake();
    }
  }
}
