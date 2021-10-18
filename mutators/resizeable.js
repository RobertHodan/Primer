import { stringToElement } from '../utils/utils.js';

export const ResizeableOptions = {
  top: true,
  right: true,
  bottom: true,
  left: true,
};

export function Resizeable(element, options) {
  options = {...ResizeableOptions, ...options};

  let isDraggable = false;

  let hitboxes = [];

  hitboxes.push(stringToElement(`<div class="resize-hitbox top"></div>`));
  hitboxes.push(stringToElement(`<div class="resize-hitbox right"></div>`));
  hitboxes.push(stringToElement(`<div class="resize-hitbox bottom"></div>`));
  hitboxes.push(stringToElement(`<div class="resize-hitbox left"></div>`));

  let activeEdges = [false, false, false, false];

  for (let i = 0; i < hitboxes.length; i += 1) {
    const hitbox = hitboxes[i];

    if (!hasEdge(options, i)) {
      continue;
    }

    hitbox.addEventListener('mousedown', () => {
      isDraggable = true;
      activeEdges[i] = true;
    });

    element.append(hitbox);
  }

  document.addEventListener('mouseup', () => {
    isDraggable = false;
    activeEdges[0] = false;
    activeEdges[1] = false;
    activeEdges[2] = false;
    activeEdges[3] = false;
  });

  document.addEventListener('mousemove', (mouseEvent) => {
    if (isDraggable) {
      let bounding = element.getBoundingClientRect();

      if (activeEdges[0]) {
        const inverse = calcPos(bounding.y, mouseEvent.pageY, bounding.height);
        const height = bounding.height - inverse;

        if (!(height <= bounding.height && bounding.height <= 10)) {
          element.style.setProperty('height', `${height}px`);
          element.style.setProperty('top', `${bounding.top + inverse}px`);
        }
      }

      if (activeEdges[1]) {
        const width = calcPos(bounding.x, mouseEvent.pageX, bounding.width);

        element.style.setProperty('width', `${width}px`);
      }

      if (activeEdges[2]) {
        const height = calcPos(bounding.y, mouseEvent.pageY, bounding.height);

        element.style.setProperty('height', `${height}px`);
      }

      if (activeEdges[3]) {
        const inverse = calcPos(bounding.x, mouseEvent.pageX, bounding.width);
        const width = bounding.width - inverse;

        if (!(width <= bounding.width && bounding.width <= 10)) {
          element.style.setProperty('width', `${width}px`);
          element.style.setProperty('left', `${bounding.left + inverse}px`);
        }
      }

      bounding = element.getBoundingClientRect();

      if (bounding.height < 10) {
        element.style.setProperty('height', `${10}px`);
      }

      if (bounding.width < 10) {
        element.style.setProperty('width', `${10}px`);
      }
    }
  });
}

function hasEdge(options, index) {
  if (index === 0 && options.top) {
    return true;
  }

  if (index === 1 && options.right) {
    return true;
  }

  if (index === 2 && options.bottom) {
    return true;
  }

  if (index === 3 && options.left) {
    return true;
  }

  return false;
}

function calcPos(elementPos, mousePos, elementSize) {
  const diff = mousePos - elementPos;
  const perc = diff / elementSize;

  let newVal = elementSize * perc;

  return newVal;
}