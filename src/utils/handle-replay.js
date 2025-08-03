// handle-replay.js

import { handleAutoAction } from "./action-handler.js";

export function handleReplay(item) {
  if (!item || typeof item !== "object") {
    console.warn("handleReplay: 유효하지 않은 item", item);
    return;
  }

  const mode = localStorage.getItem("mode") || "together";
  const type = localStorage.getItem("type") || "learn";

  // auto 우선, 없으면 action/note로 구성
  const actionPayload = item.auto ?? {
    action: item.action,
    note: item.note,
  };

  if (!actionPayload?.action) {
    console.warn("handleReplay: 실행할 action이 없습니다", item);
    return;
  }

  handleAutoAction(actionPayload, mode, type);
}
