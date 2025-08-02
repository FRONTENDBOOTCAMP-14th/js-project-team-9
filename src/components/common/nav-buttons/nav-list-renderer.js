export function renderNavList() {
  const navListContainer = document.querySelector(".nav-list__container");
  const navListClasses = [
    ".btn-home",
    ".btn-menu",
    ".btn-settings",
    ".btn-help",
  ];

  fetch("/components/buttons.html")
    .then((response) => response.text())
    .then((htmlText) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const fragment = document.createDocumentFragment();

      // 각 메뉴를 클래스로 찾아서 fragment에 추가
      navListClasses.forEach((className) => {
        const menuElement = doc.querySelector(className);

        if (menuElement) {
          const listItem = document.createElement("li");
          listItem.classList.add("nav-list__element");
          listItem.appendChild(menuElement);
          fragment.appendChild(listItem);
        }
      });

      navListContainer.append(fragment);
    })
    .catch((error) => {
      console.error("HTML 파일 불러오기 중 오류 발생:", error);
    });
}
