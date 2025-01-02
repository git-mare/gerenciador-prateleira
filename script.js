// -----------------------------------------------------------------
// Código Adicionar Botão -> CTRL + F -> Evento de Adicionar Botão
// Código Adicionar Background -> CTRL + F -> Evento de Adicionar Background
// Código Arrastar Botão -> CTRL + F -> Eventos de Arrastar Botão
// Código Salvar Página -> CTRL + F -> Salvar Layout de Página
// -----------------------------------------------------------------

const canvas = document.getElementById('canvas');
const addButton = document.getElementById('addButton');
const saveButton = document.getElementById('saveButton');
const backgroundButton = document.getElementById('addBackground');

let backgroundImage = null;

// Evento de Adicionar Botão
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

// Evento de Adicionar Background
backgroundButton.addEventListener('click', () => {
  const imageUrl = prompt('Digite o URL da imagem de background:');
  if (imageUrl) {
    backgroundImage = imageUrl;
    canvas.style.backgroundImage = `url(${imageUrl})`;
    canvas.style.backgroundSize = 'contain';
    canvas.style.backgroundRepeat = 'no-repeat';
    canvas.style.backgroundPosition = 'center';
  }
});

// Eventos de Arrastar Botão
function makeDraggable(element) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  const originalHref = element.href;

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
    if (isDragging) {
      isDragging = false;
      element.style.cursor = 'grab';
      element.href = originalHref;
      element.target = '_blank';
    }
  });

 // Evitar que links abram durante a edição da página
 element.addEventListener('click', () => {
  element.href = 'javascript:void(0)';
  element.target = '_self';
})

  element.addEventListener('mouseout', () => {
    if (!isDragging) {
      element.href = originalHref;
      element.target = '_blank';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isDragging) {
      isDragging = false;
      element.style.cursor = 'grab';
      element.href = originalHref;
      element.target = '_blank';
    }
  });
}

// Salvar Layout de Página
saveButton.addEventListener('click', () => {
  let layoutHtml = `<!DOCTYPE html>
<html lang="pt-br">
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
      ${backgroundImage ? `background-image: url('${backgroundImage}');` : ''}
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
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
