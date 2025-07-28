const toggleBtn = document.querySelector('.btn-toggle');

toggleBtn.addEventListener('click', () => {
  const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
  toggleBtn.setAttribute('aria-pressed', !isPressed);
});