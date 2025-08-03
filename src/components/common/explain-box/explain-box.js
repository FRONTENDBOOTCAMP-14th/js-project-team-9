import { setupNavigation } from "../../../utils/navigation-controller.js";
import { handleReplay } from "../../../utils/handle-replay.js";
import { handleAutoAction } from "../../../utils/action-handler.js";

export function initExplainBox({ explanations, onSpeak, mode, type }) {
  let index = 0;

  const textBox = document.querySelector(".explain-box__content");
  const btnPrev = document.querySelector(".js-explain-box-btnPrev");
  const btnNext = document.querySelector(".js-explain-box-btnNext");
  const btnRetry = document.querySelector(".js-explain-box-btnRetry");
  const statusBox = document.getElementById("explain-status");

  if (!textBox || !btnPrev || !btnNext || !btnRetry || !statusBox) {
    console.warn("설명창 관련 요소 누락");
    return;
  }

  document.addEventListener("keydown", (e) => {
    const isRetryVisible = !btnRetry.hidden;
    const isExplainVisible = textBox.offsetParent !== null;
    const isRetryOnlyKey = e.key === "1";

    if (isRetryOnlyKey && isRetryVisible && isExplainVisible) {
      e.preventDefault();
      btnRetry.click();
    }
  });

  async function show(indexToShow) {
    const item = explanations[indexToShow];
    textBox.textContent = item.text;

    // 1️TTS 음성 먼저
    if (onSpeak) {
      if (item.auto?.delayAfterText === true) {
        await onSpeak(item.speak);
      } else {
        onSpeak(item.speak);
      }
    }

    //  auto 액션 실행 (음 재생, 퀴즈 등)
    if (item.auto?.action) {
      if (item.auto?.delayAfterText === true && onSpeak) {
        // 이미 대기했으니 바로 실행
        handleAutoAction(item.auto, mode, type);
      } else if (!item.auto?.delayAfterText) {
        handleAutoAction(item.auto, mode, type);
      }
    }

    // 이전/다음 버튼 표시 제어
    btnPrev.classList.toggle("sr-only", indexToShow === 0);
    btnNext.classList.toggle(
      "sr-only",
      indexToShow === explanations.length - 1
    );

    // retry 버튼 처리 (모드별 분기 + speak & action 지원)
    if (item.retry === true) {
      btnRetry.hidden = false;

      // 모드에 따라 버튼 이름 결정
      let label = "다시 시도";
      if (mode === "listen") {
        label = "다시 듣기";
      } else if (mode === "see") {
        label = "다시 보기";
      } else if (item.label) {
        label = item.label;
      }

      btnRetry.textContent = label;
      btnRetry.setAttribute("aria-label", label);

      // 클릭 이벤트 처리
      btnRetry.onclick = async () => {
        if (mode === "listen") {
          // speak → replay 순서
          if (onSpeak && item.speak) await onSpeak(item.speak);
        }

        // 모든 모드 공통: action 또는 auto 실행
        const hasAction = item.auto || item.action;
        if (hasAction) {
          handleReplay(item);
        }
      };
    } else {
      btnRetry.hidden = true;
      btnRetry.onclick = null;
    }

    statusBox.textContent = "";
  }

  setupNavigation({
    getIndex: () => index,
    setIndex: (v) => (index = v),
    onShow: (i) => show(i),
    onAnnounce: (msg) => (statusBox.textContent = msg),
    totalCount: explanations.length,
    prevButton: btnPrev,
    nextButton: btnNext,
  });

  show(index);
}
