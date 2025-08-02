const navList = document.querySelector(".nav-list");
const musicSheetViewer = document.querySelector(".music-sheet__viewer");
// const toggleButtons = document.querySelector(".toggle-buttons");
// const octave = document.querySelector(".octave");
// const piano = document.querySelector(".piano");

renderHTML("../../src/components/common/nav-buttons/nav-buttons.html", navList)
  .then(() => {
    return import(
      "../../src/components/common/nav-buttons/nav-list-renderer.js"
    );
  })
  .then((navButtonsModule) => {
    navButtonsModule.renderNavList();
    return renderHTML(
      "../../src/components/common/music-sheet-select/music-sheet-select.html",
      musicSheetViewer
    );
  })
  .then(() => {
    return import(
      "../../src/components/common/music-sheet-select/card-rederer.js"
    );
  })
  .then((musicSheetCardRendererModule) => {
    musicSheetCardRendererModule.renderMusicSheetCards();
  })
  .then(() => {
    return import(
      "../../src/components/common/music-sheet-select/event-handlers.js"
    );
  })
  .then((musicSheetEventHandlersModule) => {
    musicSheetEventHandlersModule.setupEventListeners();
    console.log("모든 HTML 파일이 성공적으로 렌더링되었습니다.");
  })
  .catch((error) => {
    console.error("HTML 파일을 불러오는 중 오류 발생:", error);
  });

// renderHTML(
//   "../src/components/common/music-sheet-select/music-sheet-select.html",
//   musicSheetViewer
// );
// renderHTML('../src/components/common/*/*.html', toggleButtons)
// renderHTML('../src/components/common/*/*.html', octave)
// renderHTML('../src/components/common/*/*.html', piano)

function renderHTML(url, element) {
  return fetch(url)
    .then((response) => response.text())
    .then((htmlText) => {
      if (element) {
        element.innerHTML = htmlText;
      } else {
        console.error("Error: 요소를 찾을 수 없습니다.");
      }
    });
}
