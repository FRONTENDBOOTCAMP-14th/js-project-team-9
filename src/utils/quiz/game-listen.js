import { soundNote } from "../sound-utils.js";
import {
  resetQuizState,
  compareNotes,
  currentHandler,
  userInputs,
  initGameLife,
  handleGameMistake,
  convertScaleToKorean,
  setCurrentHandler,
} from "./quiz-common.js";
import { speak, speakAndWait } from "../tts-utils.js";
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
  const match = baseNote.match(/^([A-G]#?)(\d)$/);
  if (!match) return baseNote;

  const [_, scale, octaveStr] = match;
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
export async function startGameListen(auto, mode) {
  const {
    allowedNotes = ["C", "D", "E", "F", "G", "A", "B"],
    guideBefore = "기준음이 될 건반을 하나 눌러주세요.",
    guideAfter = "기준음을 확인했습니다.",
    compareBy = "scaleName",
  } = auto;

  resetQuizState();
  initGameLife();

  await speakAndWait(guideBefore); // 안내 후 기준음 대기

  document.addEventListener("keydown", handleFirstInput);
  setCurrentHandler(handleFirstInput);

  function handleFirstInput(e) {
    const inputNote = mapKeyToNote?.(e.code);
    if (!inputNote) return;

    const match = inputNote.match(/^([A-G]#?)(\d)$/);
    if (!match) return;

    const [_, scale] = match;

    if (!allowedNotes.includes(scale)) {
      speak(`"${scale}"은 사용할 수 없습니다. 다시 눌러주세요.`);
      return;
    }

    document.removeEventListener("keydown", handleFirstInput);
    setCurrentHandler(null);

    const answer = generateRelativeNote(inputNote);
    const koreanInput = convertScaleToKorean(inputNote);

    // 안내 → 기준음 발표 → 정답음 재생
    speakAndWait(`${guideAfter} 기준음은 ${koreanInput}입니다.`).then(() => {
      soundNote(answer);

      document.addEventListener("keydown", (e) => handleAnswerInput(e, answer));
      setCurrentHandler((e) => handleAnswerInput(e, answer));
    });
  }

  function handleAnswerInput(e, answer) {
    const inputNote = mapKeyToNote?.(e.code);
    if (!inputNote) return;

    document.removeEventListener("keydown", currentHandler);
    setCurrentHandler(null);

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
