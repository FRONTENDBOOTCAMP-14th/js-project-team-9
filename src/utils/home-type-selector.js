import { saveType } from "./stage-utils";

export function homeTypeSelector(selector = ".js-home-page-typeSelct") {
  const typeLinks = document.querySelectorAll(selector);

  if (typeLinks.length === 0) {
    console.warn(
      `[homeTypeSelector] 경고: '${selector}'에 해당하는 요소를 찾을 수 없습니다.`
    );
    return;
  }

  typeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const selectedType = event.currentTarget.dataset.type;

      if (selectedType) {
        saveType(selectedType);
        console.log(`Type '${selectedType}' 저장 완료!`);

        window.location.href = event.currentTarget.href;
      } else {
        console.warn(
          `[homeTypeSelector] 경고: 클릭된 요소에 data-type 속성이 없습니다.`
        );
      }
    });
  });
}
