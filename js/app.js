(() => {
  document.querySelectorAll('.region-stack').forEach((stack) => {
    const cards = [...stack.querySelectorAll('.region-card')];
    if (cards.length > 1) stack.classList.add('has-multiple');

    cards.forEach((card, index) => {
      card.style.setProperty('--index', index);
      const current = card.querySelector('[data-card-index]');
      if (current) current.textContent = String(index + 1).padStart(2, '0');
    });
  });
})();
