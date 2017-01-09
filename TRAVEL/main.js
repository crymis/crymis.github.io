/* FUNCTIONALITY */

const panels = document.querySelectorAll('.panel');

function closeOthers(current) {
  const oneOpen = !current.classList.contains('open');
  panels.forEach(panel => {
    /* all gonna be closed */
    panel.style.filter = 'blur(0)';
    if (oneOpen && panel !== current) {
      panel.style.filter = 'blur(1px)';
    }
    panel.classList.remove('open', 'open-active')
  });
}

function togglePanel() {
  if (!this.classList.contains('open')) {
    closeOthers(this);
    this.classList.add('open');
  } else {
    /* open panel should be closed */
    closeOthers(this);
  }
}

function toggleDescription(e) {
  if (this.classList.contains('open')) {
    if (e.propertyName.includes('flex-grow')) {
      this.classList.add('open-active');
    }
  }
}

/* add click listeners */
panels.forEach(panel => panel.addEventListener('click', togglePanel));
panels.forEach(panel => panel.addEventListener('transitionend', toggleDescription));