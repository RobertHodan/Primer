import { addEventListener, angleTo, cleanup, create1MBString, getProperty, getTransformValues, setTransformValues } from '../utils/utils.js';

export const RotateableOptions = {
  debug: false,
};

export function Rotateable(element, options) {
  options = {...RotateableOptions, ...options};

  const angleArr = getTransformValues(element, 'rotate') || [];
  let angle = Number.parseFloat(angleArr[0]) || 0;
  let prevAngle = -1;

  const dirs = ['topRight', 'bottomRight', 'bottomLeft', 'topLeft'];
  const hitboxes = [];
  for(const dir of dirs) {
    const hitbox = createHitbox(options, dir);
    hitboxes.push(hitbox);
    let isHitboxActive = false;

    addEventListener(hitbox, 'mousedown', () => {
      isHitboxActive = true;
    }, hitbox);

    addEventListener(document, 'mouseup', () => {
      isHitboxActive = false;
      prevAngle = -1;
    }, hitbox);

    addEventListener(document, 'mousemove', (mouseEvent) => {
      if (isHitboxActive) {
        const bounds = element.getBoundingClientRect();
        const mouseVector = {
          x: mouseEvent.pageX,
          y: mouseEvent.pageY,
        };
        const elementVector = {
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2,
        };
        const degrees = angleTo(elementVector, mouseVector, true);

        let angleDiff = degrees - prevAngle;
        if (prevAngle < 0) {
          angleDiff = 0;
        }

        angle += angleDiff;
        prevAngle = degrees;

        if (angle > 360) {
          angle -= 360;
        } else if (angle < 0) {
          angle += 360;
        }

        setTransformValues(element, 'rotate', [`${angle}deg`]);
      }
    }, hitbox);

    element.append(hitbox);
  }

  return () => {
    for (const hitbox of hitboxes) {
      cleanup(hitbox);

      element.removeChild(hitbox);
    }
  }
}

function createHitbox(options, direction) {
  const hitbox = document.createElement('div');
  hitbox.classList.add('rotateable-hitbox');

  const style = hitbox.style;
  if (options.debug) {
    style.setProperty('background', 'green');
  }

  if (direction == 'topRight') {
    hitbox.classList.add('top-right');
  } else if (direction == 'bottomRight') {
    hitbox.classList.add('bottom-right');
  } else if (direction == 'bottomLeft') {
    hitbox.classList.add('bottom-left');
  } else if (direction == 'topLeft') {
    hitbox.classList.add('top-left');
  }

  return hitbox;
}