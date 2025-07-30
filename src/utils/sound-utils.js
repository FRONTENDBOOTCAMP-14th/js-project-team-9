/**
 * sound-utils.js
 *
 * 음 이름을 입력받아 해당 음의 주파수(Hz)를 계산하거나
 * 실제로 그 주파수의 소리를 재생하는 함수입니다.
 * 설명창, 키보드, 퀴즈 등에서 사용할 수 있습니다.
 *
 * 사용 예시:
 *    soundNote("C4");         // 도 소리 출력
 *    soundNote("F#5", 1);     // 파# 소리 1초간 출력
 *    noteToFrequency("A4");   // → 440
 */

/**
 * noteToFrequency(note)
 *
 * 문자열 형태의 음 이름을 받아 해당 음의 주파수(Hz)를 계산합니다.
 * 예: "C4" → 261.63, "A4" → 440
 *
 * 유효하지 않은 note가 들어오면 null을 반환합니다.
 * soundNote()에서 필요한 함수기 때문에 단순히 소리 출력이 필요하시면 soundNote()를 사용하시면 됩니다.
 */
export function noteToFrequency(note) {
  const regex = /^([A-G])(#?)([1-7])$/;
  const match = note.match(regex);
  if (!match) return null;

  const [, letter, sharp, octaveStr] = match;
  const key = letter + sharp;
  const octave = parseInt(octaveStr, 10);

  const semitoneMap = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    "A#": 10,
    B: 11,
  };

  const index = semitoneMap[key];
  if (index === undefined) return null;

  const midi = (octave + 1) * 12 + index;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * soundNote(note, duration = 0.5)
 *
 * 주어진 음 이름(note)을 받아 해당 주파수를 계산하고,
 * Web Audio API를 사용해 소리를 재생합니다.
 *
 * 두 번째 인자인 duration은 소리를 얼마나 재생할지 (초 단위)입니다.
 * 기본값은 0.5초입니다.
 *
 * 예:
 *    soundNote("C4");       // 도 소리 0.5초간 출력
 *    soundNote("G#3", 1);   // 솔# 소리 1초간 출력
 */
export function soundNote(note = "C4", duration = 0.5) {
  const freq = noteToFrequency(note);
  if (!freq) {
    console.warn(`soundNote: 유효하지 않은 note '${note}'`);
    return;
  }

  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, ctx.currentTime);

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}
