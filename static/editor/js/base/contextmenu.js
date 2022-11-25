const scope = document.querySelector('body');

const normalizePozition = (cmMenuX, cmMenuY) => {
  // ? compute what is the cmMenu position relative to the container element (scope)
  let {
    left: scopeOffsetX,
    top: scopeOffsetY,
  } = scope.getBoundingClientRect();

  scopeOffsetX = scopeOffsetX < 0 ? 0 : scopeOffsetX;
  scopeOffsetY = scopeOffsetY < 0 ? 0 : scopeOffsetY;

  const scopeX = cmMenuX - scopeOffsetX;
  const scopeY = cmMenuY - scopeOffsetY;

  // ? check if the element will go out of bounds
  const outOfBoundsOnX = scopeX + contextMenu.clientWidth > scope.clientWidth;

  const outOfBoundsOnY = scopeY + contextMenu.clientHeight > scope.clientHeight;

  let normalizedX = cmMenuX;
  let normalizedY = cmMenuY;

  // ? normalize on X
  if (false) {
    normalizedX = scopeOffsetX + scope.clientWidth - contextMenu.clientWidth;
  }

  // ? normalize on Y
  if (false) {
    normalizedY = scopeOffsetY + scope.clientHeight - contextMenu.clientHeight;
  }

  return { normalizedX, normalizedY };
};

scope.addEventListener('contextmenu', (event) => {
  event.preventDefault();

  const { clientX: cmMenuX, clientY: cmMenuY } = event;

  const { normalizedX, normalizedY } = normalizePozition(cmMenuX, cmMenuY);

  contextMenu.classList.remove('visible');

  contextMenu.style.top = `${normalizedY}px`;
  contextMenu.style.left = `${normalizedX}px`;

  setTimeout(() => {
    contextMenu.classList.add('visible');
  });
});

scope.addEventListener('click', (e) => {
  // ? close the menu if the user clicks outside of it
  if (e.target.offsetParent != contextMenu) {
    contextMenu.classList.remove('visible');
  }
});
