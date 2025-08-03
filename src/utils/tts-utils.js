/**
 * tts-utils.js
 *
 * Web Speech API 기반 TTS 유틸 모듈
 */

let currentUtterance = null;

/**
 * speak(text)
 * 텍스트를 음성으로 읽고 끝날 때까지 기다립니다.
 * 기존 발화가 있으면 중단하고 새로 시작합니다.
 *
 * @param {string} text
 * @returns {Promise<void>}
 */
export function speak(text) {
  stopSpeaking();

  if (!text || typeof text !== "string") return Promise.resolve();

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => resolve();

    currentUtterance = utterance;
    speechSynthesis.speak(utterance);
  });
}

/**
 * speakAndWait(text)
 * speak와 동일하지만 함수 이름만 명시적. speak(text)와 기능 동일.
 *
 * @param {string} text
 * @returns {Promise<void>}
 */
export function speakAndWait(text) {
  return speak(text); // 내부적으로 speak 사용
}

/**
 * stopSpeaking()
 * 현재 음성 출력 중단
 */
export function stopSpeaking() {
  if (speechSynthesis.speaking || speechSynthesis.pending) {
    speechSynthesis.cancel();
  }
  currentUtterance = null;
}

/**
 * isSpeaking()
 * 현재 말하고 있는지 여부
 *
 * @returns {boolean}
 */
export function isSpeaking() {
  return speechSynthesis.speaking;
}
