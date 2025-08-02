import { initGameLife } from "../../src/utils/quiz/quiz-common.js";
import {
  handleWrongAnswer,
  updateLifeBar,
} from "../../src/components/common/life/life.js";
import { initExplainBox } from "../../src/components/common/explain-box/explain-box.js";
import { loadExplanations } from "../../src/utils/load-explanations.js";
import { speak } from "../../src/utils/tts-utils.js";
import { renderNavList } from "../../src/components/common/nav-buttons/nav-list-renderer.js";

(async () => {
  // nav 버튼 UI 삽입
  const navRes = await fetch("/components/nav-buttons.html");
  const navHtml = await navRes.text();
  document.querySelector(".nav-button-wrapper").innerHTML = navHtml;

  // 목숨 UI 삽입
  const lifeRes = await fetch("/components/life.html");
  const lifeHtml = await lifeRes.text();
  document.querySelector(".life-wrapper").innerHTML = lifeHtml;

  // 설명창 UI 삽입
  const explainRes = await fetch("/components/explain-box.html");
  const explainHtml = await explainRes.text();
  document.querySelector(".explain-box-wrapper").innerHTML = explainHtml;

  // 현재 단계 정보 - 추후 import로 바꿔줘야함
  const type = "game";
  const mode = "see"; // see, together, listen 중 택
  const step = "1";

  // 설명 데이터 로딩
  const explanations = await loadExplanations({ type, mode, step });

  // 설명창 초기화
  initExplainBox({
    explanations,
    onSpeak: speak,
    mode,
  });
  renderNavList();

  // 목숨 상태 초기화 및 UI 첫 렌더링
  initGameLife();
  updateLifeBar(mode);
})();
