import { AddEventListener, AngleTo } from '../utils/utils.js';

export const RotateableOptions = {
  hitboxRadius: 1.5,
  hitboxOffset: 2,
};

export function Rotateable(element, options) {
  options = {...RotateableOptions, ...options};

  const state = {
    angle: 0,
    prevAngle: -1,
    debug: options.debug || true,
  };

  const dirs = ['topRight', 'bottomRight', 'bottomLeft', 'topLeft'];
  for(const dir of dirs) {
    const hitbox = createHitbox(element, state, options, dir);
    let isHitboxActive = false;

    const removeMousedown = AddEventListener(hitbox, 'mousedown', () => {
      isHitboxActive = true;
    });

    const removeMouseup = AddEventListener(document, 'mouseup', () => {
      isHitboxActive = false;
      state.prevAngle = -1;
    });

    const removeMousemove = AddEventListener(document, 'mousemove', (mouseEvent) => {
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
        const degrees = AngleTo(elementVector, mouseVector, true);

        let angleDiff = degrees - state.prevAngle;
        if (state.prevAngle < 0) {
          angleDiff = 0;
        }

        state.angle += angleDiff;
        state.prevAngle = degrees;

        if (state.angle > 360) {
          state.angle -= 360;
        } else if (state.angle < 0) {
          state.angle += 360;
        }

        element.style.setProperty('transform', `rotate(${state.angle}deg)`);
      }
    });

    element.append(hitbox);
  }

  return () => {
      removeMousedown();
      removeMouseup();
      removeMousemove();
    }
}


function createHitbox(element, state, options, direction) {
  const hitbox = document.createElement('div');

  const style = hitbox.style;
  style.setProperty('background', 'green');
  style.setProperty('position', 'absolute');
  style.setProperty('border-radius', '50%');
  style.setProperty('user-select', 'none');
  style.setProperty('width', `${options.hitboxRadius}em`);
  style.setProperty('height', `${options.hitboxRadius}em`);

  if (direction == 'topRight') {
    style.setProperty('top', '0px');
    style.setProperty('right', '0px');
    style.setProperty('margin-top', `-${options.hitboxOffset}em`);
    style.setProperty('margin-right', `-${options.hitboxOffset}em`);
  } else if (direction == 'bottomRight') {
    style.setProperty('bottom', '0px');
    style.setProperty('right', '0px');
    style.setProperty('margin-bottom', `-${options.hitboxOffset}em`);
    style.setProperty('margin-right', `-${options.hitboxOffset}em`);
  } else if (direction == 'bottomLeft') {
    style.setProperty('bottom', '0px');
    style.setProperty('left', '0px');
    style.setProperty('margin-bottom', `-${options.hitboxOffset}em`);
    style.setProperty('margin-left', `-${options.hitboxOffset}em`);
  } else if (direction == 'topLeft') {
    style.setProperty('top', '0px');
    style.setProperty('left', '0px');
    style.setProperty('margin-top', `-${options.hitboxOffset}em`);
    style.setProperty('margin-left', `-${options.hitboxOffset}em`);
  }

  return hitbox;
}