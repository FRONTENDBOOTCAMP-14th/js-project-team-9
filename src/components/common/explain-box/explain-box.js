// navigation-controller 공통 모듈 import 해야함
// 아직 모듈이 없기 때문에, 임시 더미 함수로 테스트

function handleReplay(item) {
  console.warn(" handleReplay: 아직 구현되지 않았습니다.", item);
}

export function initExplainBox({ explanations, onSpeak, mode }) {
  let index = 0;

  const textBox = document.querySelector(".explain-box__text");
  const btnPrev = document.querySelector(".js-explain-box-btnPrev");
  const btnNext = document.querySelector(".js-explain-box-btnNext");
  // btnRetry 클래스 이름 변경될 수 있음
  const btnRetry = document.querySelector(".js-explain-box-btnRetry");
  const statusBox = document.getElementById("explain-status");

  if (!textBox || !btnPrev || !btnNext || !btnRetry || !statusBox) {
    console.warn("설명창 관련 요소 누락");
    return;
  }

  // 스페이스바를 btnRetry 단축키로 사용하기
  document.addEventListener("keydown", (e) => {
    const isRetryVisible = !btnRetry.hidden;
    const isExplainVisible = textBox.offsetParent !== null;
    const isRetryOnlyKey = e.key === "1";

    if (isRetryOnlyKey && isRetryVisible && isExplainVisible) {
      e.preventDefault(); // 다른 동작 방지
      btnRetry.click(); // 다시 시도
    }
  });

  function show(indexToShow) {
    const item = explanations[indexToShow];
    textBox.textContent = item.text;

    if (onSpeak) onSpeak(item.speak);

    // 버튼 표시 제어
    btnPrev.classList.toggle("sr-only", indexToShow === 0);
    btnNext.classList.toggle(
      "sr-only",
      indexToShow === explanations.length - 1
    );

    // retry 버튼 처리
    // retry 버튼 처리
    if (item.retry === true) {
      btnRetry.hidden = false;

      if (mode === "listen") {
        btnRetry.textContent = "다시 듣기";
        btnRetry.setAttribute("aria-label", "다시 듣기");
        btnRetry.onclick = () => {
          if (onSpeak && item.speak) {
            onSpeak(item.speak); // 설명 읽기
          }
          if (item.action) {
            handleReplay(item); // 문제 출제
          }
        };
      } else if (mode === "see") {
        btnRetry.textContent = "다시 보기";
        btnRetry.setAttribute("aria-label", "다시 보기");
        btnRetry.onclick = () => {
          handleReplay(item);
        };
      } else {
        btnRetry.textContent = item.label || "다시 시도";
        btnRetry.setAttribute("aria-label", item.label || "다시 시도");
        btnRetry.onclick = () => {
          handleReplay(item);
        };
      }
    } else {
      btnRetry.hidden = true;
      btnRetry.onclick = null;
    }

    // 스크린리더 안내 초기화
    statusBox.textContent = "";
  }

  // 공통 navigation 기능 연결
  setupNavigation({
    getIndex: () => index,
    setIndex: (v) => (index = v),
    onShow: (i) => show(i),
    onAnnounce: (msg) => (statusBox.textContent = msg),
    totalCount: explanations.length,
    prevButton: btnPrev,
    nextButton: btnNext,
  });

  // 초기 0번 보여주기
  show(index);
}
