/**
 * tts-utils.js
 *
 * Web Speech API 기반 TTS 유틸 모듈
 * 설명창, 퀴즈 안내 등에서 음성 출력을 위해 사용됩니다.
 *
 * 사용 예:
 * import { speak, stopSpeaking, isSpeaking } from "./tts-utils.js";
 * speak("안녕하세요");
 * stopSpeaking();
 */

let currentUtterance = null;

/**
 * speak(text)
 * 전달된 텍스트를 음성으로 출력합니다.
 * 기존 발화가 있다면 먼저 중단하고 새로 시작합니다.
 *
 * @param {string} text - 음성으로 읽을 텍스트
 */
export function speak(text) {
  stopSpeaking();

  if (!text || typeof text !== "string") return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR"; // 한국어로 설정
  utterance.rate = 1; // 재생 속도
  utterance.pitch = 1; // 음 높이

  currentUtterance = utterance;
  speechSynthesis.speak(utterance);
}

/**
 * stopSpeaking()
 * 현재 진행 중인 음성 출력을 중단합니다.
 */
export function stopSpeaking() {
  if (speechSynthesis.speaking || speechSynthesis.pending) {
    speechSynthesis.cancel();
  }
  currentUtterance = null;
}

/**
 * isSpeaking()
 * 현재 TTS가 재생 중인지 확인합니다.
 *
 * @returns {boolean}
 */
export function isSpeaking() {
  return speechSynthesis.speaking;
}
