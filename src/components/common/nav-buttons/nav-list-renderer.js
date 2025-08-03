export async function renderNavList() {
  const navListContainer = document.querySelector(".nav-list__container");
  const navListClasses = [
    ".btn-home",
    ".btn-menu",
    ".btn-settings",
    ".btn-help",
  ];

  try {
    const response = await fetch("/components/buttons.html");
    const htmlText = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const fragment = document.createDocumentFragment();

    // 각 메뉴를 클래스로 찾아서 fragment에 추가
    navListClasses.forEach((className) => {
      const menuElement = doc.querySelector(className);

      if (menuElement) {
        const listItem = document.createElement("li");
        listItem.classList.add("nav-list__element");
        if (className === ".btn-home") {
          menuElement.href = "../home/home.html";
        }
        listItem.appendChild(menuElement);
        fragment.appendChild(listItem);
      }
    });

    navListContainer.append(fragment);
  } catch (error) {
    console.error("HTML 파일 불러오기 중 오류 발생:", error);
  }
}
