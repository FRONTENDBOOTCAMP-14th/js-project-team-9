// handle-replay.js

import { handleAutoAction } from "./handle-auto-action.js";

/**
 * handleReplay()
 *
 * 설명창의 retry 버튼에서 호출됩니다.
 * 설명 항목(item)의 action에 따라 적절한 동작을 실행합니다.
 *
 * mode와 type은 localStorage에서 가져옵니다.
 * - mode: "listen", "see", "together"
 * - type: "learn", "game"
 *
 * @param {object} item - 설명 항목 객체 (text, speak, action 등 포함)
 */
export function handleReplay(item) {
  if (!item || typeof item !== "object") {
    console.warn("handleReplay: 유효하지 않은 item", item);
    return;
  }

  const mode = localStorage.getItem("mode") || "together";
  const type = localStorage.getItem("type") || "learn";

  handleAutoAction(item, mode, type);
}
