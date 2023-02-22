const cols = document.querySelectorAll('.col');

document.addEventListener('keydown', (event) => {
  event.preventDefault();
  if (event.code == 'Space') {
    setRandomColors();
  }
});

document.addEventListener('click', (event) => {
  const targetEl = event.target.closest('[data-type="lock"]') || null;
  if (targetEl) {
    const icon = targetEl.querySelector('i');
    icon.classList.toggle('fa-lock-open');
    icon.classList.toggle('fa-lock');
  }
});

document.addEventListener('click', (event) => {
  if (event.target.tagName == 'H2') {
    copyToClipboard(event.target.innerHTML);
  }
});

function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

function generateRandomColor() {
  const hexCodes = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
  }

  return color;
}

function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];
  cols.forEach((col, index) => {
    let isLocked = col.querySelector('i').classList.contains('fa-lock');
    const button = col.querySelector('button');
    let color = null;
    if (isInitial) {
      if (colors[index]) {
        color = colors[index];
      } else {
        color = generateRandomColor();
        updateColorsHash();
      }
    } else {
      color = generateRandomColor();
      updateColorsHash();
    }
    const h2El = col.querySelector('h2');

    if (isLocked) {
      colors.push(h2El.textContent);
      return;
    }

    if (!isInitial) {
      colors.push(color);
    }

    setTextColor(button, color);

    h2El.textContent = color;
    setTextColor(h2El, color);

    col.style.backgroundColor = color;
  });

  updateColorsHash(colors);
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split('-')
      .map((color) => {
        return (color = `#${color}`);
      });
  }
  return [];
}

function updateColorsHash(colors = []) {
  document.location.hash = colors.map((color) => color.substring(1)).join('-');
}

function setTextColor(text, bgColor) {
  const luminance = chroma(bgColor).luminance();
  text.style.color = luminance > 0.5 ? 'black' : 'white';
}

setRandomColors(true);
