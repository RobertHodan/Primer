import { addMouseListener } from "../utils/utils.js";

export const DraggableDefaults = {
  mouseButton: 'left',
  appendListenerTo: undefined,
};

export function Draggable(element, options = DraggableDefaults, callback = ()=>{}) {
  if (typeof(options) === 'function') {
    callback = options;
    options = DraggableDefaults;
  }

  return _draggable(element, options, callback);
}

function _draggable(element, options = DraggableDefaults, callback = ()=>{}) {
  options = {...DraggableDefaults, ...options};
  const { appendListenerTo } = options;

  const listenerElement = appendListenerTo || element;
  const removeListener = addMouseListener(listenerElement, {
    button: options.mouseButton,
  }, (mouseEvent) => {
    let scale = 1;
    const transform = element.style.transform;
    if (transform && transform.includes('scale')) {
      const scaleStr = element.style.transform.split('(')[1].split(')')[0];

      scale = Number.parseFloat(scaleStr);
    }

    callback(mouseEvent);

    element.style.setProperty('left', `${element.offsetLeft + mouseEvent.movementX}px`);
    element.style.setProperty('top', `${element.offsetTop + mouseEvent.movementY}px`);
  });

  return removeListener;
}
