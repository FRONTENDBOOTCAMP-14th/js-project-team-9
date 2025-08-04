const oerDialog = document.querySelector(".oer-dialog");
const closeOerDialogButton = oerDialog.querySelector(".oer-dialog__close");

document.addEventListener("DOMContentLoaded", async () => {
  oerDialog.showModal();
  closeOerDialogButton.addEventListener("click", () => {
    oerDialog.close();
  });
});
