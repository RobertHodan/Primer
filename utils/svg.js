import { isIterable, setTransformValues } from './utils.js';
import { stringToElement } from './string.js';

const getSVGNoop = (element) => { return element };

export function combineSVGs(container, options = {
  getSVG: getSVGNoop,
}) {
  const svg = stringToElement('<svg xmlns="http://www.w3.org/2000/svg"></svg>');

  let children;
  if (!isIterable(container)) {
    children = [...container.children] || [];
  } else {
    children = [...children];
  }

  // Sort based on z-index
  children.sort((a, b) => {
    let azi = Number.parseInt(a.style.getPropertyValue('z-index')) || 0;
    let bzi = Number.parseInt(b.style.getPropertyValue('z-index')) || 0;

    return azi - bzi;
  });

  let svgs = [];
  let xBounds = {min: undefined, max: undefined};
  let yBounds = {min: undefined, max: undefined};
  // Collect necessary data
  for(const item of children) {
    let svg = item;
    if (options.getSVG !== getSVGNoop) {
      svg = options.getSVG(item);
    }

    if (svg.tagName === 'svg') {
      let rect = svg.getBoundingClientRect();
      let box = svg.getBBox();
      updateBounds(rect.x + box.x, box.width, xBounds);
      updateBounds(rect.y + box.y, box.height, yBounds);

      svgs.push({
        svg,
        rect,
        box,
        xBounds,
        yBounds,
      });
    }
  }

  if (svgs.length === 0) {
    return undefined;
  }

  // merge SVGs
  let newSize = {
    x: xBounds.max - xBounds.min,
    y: yBounds.max - yBounds.min,
  };

  svg.setAttribute('viewBox', `0 0 ${newSize.x} ${newSize.y}`);
  for (const data of svgs) {
    cloneInto(data, svg);
  }

  return svg;
}

function updateBounds(value, size, bounds = {min, max}) {
  const {min, max} = bounds;

  if (!min || value < min) {
    bounds.min = value;
  }

  if (!max || value + size > max) {
    bounds.max = value + size;
  }
}

function cloneInto(data, newSvg) {
  let x = data.rect.x - data.xBounds.min;
  let y = data.rect.y - data.yBounds.min;
  for (const c of data.svg.children) {
    const child = c.cloneNode(true);
    // if (child.tagName === 'rect') {
    //   x += getAttributeFloat(child, 'x');
    //   y += getAttributeFloat(child, 'y');
    //   child.setAttribute('x', x);
    //   child.setAttribute('y', y);
    // } else if (child.tagName === 'circle' || child.tagName === 'ellipse') {
    //   x += getAttributeFloat(child, 'cx');
    //   y += getAttributeFloat(child, 'cy');
    //   child.setAttribute('cx', x);
    //   child.setAttribute('cy', y);
    // } else {
    //   child.setAttribute('transform', `translate(${x},${y})`);
    // }

    // For now, use this for all
    setTransformValues(child, 'translate', [x, y], true);

    newSvg.append(child);
  }
}

function getAttributeFloat(el, property) {
  return Number.parseFloat(el.getAttribute(property)) || 0;
}
