const canvas = document.getElementById('canvas');
const addButton = document.getElementById('addButton');
const saveButton = document.getElementById('saveButton');

addButton.addEventListener('click', () => {
  const buttonText = prompt('Digite o nome do botão:');
  const buttonLink = prompt('Digite o link do botão:');

  const newButton = document.createElement('a');
  newButton.classList.add('draggable');
  newButton.textContent = buttonText || 'Novo Link';
  newButton.href = buttonLink || '#';
  newButton.target = '_blank';

  newButton.style.top = '50%';
  newButton.style.left = '50%';

  makeDraggable(newButton);

  canvas.appendChild(newButton);
});

function makeDraggable(element) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    element.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    element.style.left = `${x}vw`;
    element.style.top = `${y}vh`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    element.style.cursor = 'grab';
  });
}

saveButton.addEventListener('click', () => {
  let layoutHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Layout</title>
  <style>
    body {
      margin: 0;
      position: relative;
      height: 100vh;
      background-color: #ecf0f1;
    }
    a {
        text-decoration: none;
    }
    .draggable {
      position: absolute;
      padding: 1vw 1.5vh;
      background-color: #3498db;
      color: white;
      font-size: 1.3vw;
      border-radius: 5px;
      user-select: none;
      transform: translate(-50%, -50%);
    }
  </style>
</head>
<body>
`;

  const elements = document.querySelectorAll('.draggable');
  elements.forEach(element => {
    const style = window.getComputedStyle(element);
    const top = element.style.top;
    const left = element.style.left;
    const content = element.textContent;
    const href = element.href;
    layoutHtml += `<a class="draggable" style="top: ${top}; left: ${left};" href="${href}" target="_blank">${content}</a>\n`;
  });

  layoutHtml += `</body>\n</html>`;

  const blob = new Blob([layoutHtml], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'layout.html';
  a.click();
});