// input-utils.js (혹은 utils/input-utils.js)
export function mapKeyToNote(code) {
  const keyToNoteMap = {
    KeyA: "C4",
    KeyS: "D4",
    KeyD: "E4",
    KeyF: "F4",
    KeyG: "G4",
    KeyH: "A4",
    KeyJ: "B4",
    // 필요한 만큼 추가
  };

  return keyToNoteMap[code] || null;
}
