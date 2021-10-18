import { addEventListener } from "../utils/utils.js";

export const ZoomableDefaults = {
  mouseButton: 'left',
  scale: 1,
  appendListenerTo: undefined,
};

export function Zoomable(element, options = ZoomableDefaults, callback = ()=>{}) {
  if (typeof(options) === 'function') {
    callback = options;
    options = ZoomableDefaults;
  }

  return _zoomable(element, options, callback);
}

function _zoomable(element, options = ZoomableDefaults, callback = ()=>{}) {
  options = {...ZoomableDefaults, ...options};
  const { appendListenerTo } = options;

  const listenerElement = appendListenerTo || element;
  let scale = options.scale;
  const removeListener = addEventListener(listenerElement, 'wheel', (event) => {
    const isUp = event.deltaY > 0;
    const i = 0.1;
    scale += isUp ? -i : i;

    callback(event, scale);
  });

  return removeListener;
}
