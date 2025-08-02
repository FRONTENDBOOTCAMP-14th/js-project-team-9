import { renderNavList } from "./nav-list-renderer.js";
import modalController from "../../../../src/utils/click-event-modals.js";

async function initializeApp() {
  await renderNavList();
  modalController.init();
}
initializeApp();
