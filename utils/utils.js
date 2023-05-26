// http://answers.unity.com/answers/1313644/view.html
// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-34.php
const vectorDefault = {x: 0, y: 0};
export function angleTo(origin = vectorDefault, target = vectorDefault, inDegrees = false) {
  const radians = Math.atan2(target.y - origin.y, target.x - origin.x);
  let angle = radians;

  if (inDegrees) {
    angle = radians * (180 / Math.PI);
  }

  if (angle < 0) {
    angle += inDegrees ? 360 : (2 * Math.PI);
  }

  return angle;
}

export const noop = () => {};

let id = 0;
export function nextId() {
  return id += 1;
}

export function getId(element) {
  return element.getAttribute('data-primer-id');
}

export function getProperty(element, property) {
  let propValue = element.style.getPropertyValue(property);
  if (propValue.length === 0) {
    const comp = window.getComputedStyle(element);
    propValue = comp[property];
  }

  return propValue;
}

export function setProperty(element, property, value) {
  element.style.setProperty(property, value);
}

export function incrementProperty(element, property, value, cap) {
  let propValue = element.style.getPropertyValue(property);

  let num = Number.parseFloat(propValue) || 0;
  const numStr = num.toString();

  num += value;


  if ( cap != undefined ) {
    const canIncrement = (value > 0) && num <= cap;
    const canDecrement = (value < 0) && num >= cap;

    if (!canIncrement && !canDecrement) {
      return;
    }
  }

  if (propValue.length === 0) {
    propValue = num.toString();
  } else {
    propValue = propValue.replace(numStr, num.toString());
  }
  element.style.setProperty(property, propValue);
}

// Intended to be used prior to removal of element
export function cleanup(element) {
  const cleaners = getCleaners(element);
  for (let cleaner of cleaners) {
    cleaner();
  }
}

export function getCleaners(element) {
  return element.primerCleaners || [];
}

export function setCleaners(element, cleaners) {
  element.primerCleaners = cleaners;
}

export function addCleaner(element, callback) {
  const cleaners = getCleaners(element);
  cleaners.push(callback);
  setCleaners(element, cleaners);
}

export function removeCleaner(element, callback) {
  const cleaners = getCleaners(element);
  if (cleaners.length === 0) {
    return;
  }

  const index = cleaners.indexOf(callback);
  if (index >= 0) {
    cleaners.splice(index, 1);
  }
}

const linkCSSDefaults = {
  prepend: false,
}
export function linkCSS(cssLink, options = linkCSSDefaults) {
  options = {...linkCSSDefaults, ...options};

  const head = document.getElementsByTagName('head')[0];
  const links = head.getElementsByTagName('link');

  let shouldAdd = true;
  for (const link of links) {
    if (link.href === cssLink) {
      shouldAdd = false;
    }
  }

  if (shouldAdd) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', cssLink);

    if (options.prepend) {
      head.prepend(link);
    } else {
      head.append(link);
    }
  }
}

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce
export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
  	var context = this, args = arguments;
  	clearTimeout(timeout);
  	timeout = setTimeout(function() {
  		timeout = null;
  		if (!immediate) func.apply(context, args);
  	}, wait);
  	if (immediate && !timeout) func.apply(context, args);
  };
}

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_throttle
export function throttle(func, timeFrame) {
  var lastTime = 0;
  return function (...args) {
      var now = new Date();
      if (now - lastTime >= timeFrame) {
          func(...args);
          lastTime = now;
      }
  };
}

export function clamp(value, min, max) {
  // If neither are provided, assume a "0 and 1" clamp
  if (min == undefined && max == undefined) {
    min = 0;
    max = 1;
  }

  if (max != undefined && value > max) {
    value = max;
  }

  if (min != undefined && value < min) {
    value = min;
  }

  return value;
}

export function setInterval(callback, options) {
  if (Number.isFinite(options)) {
    options = {
      interval: options,
    };
  } else {
    if (!options.isCopy) {
      options = {...options};
      options.isCopy = true;
    }
  }

  const func = () => {
    callback();

    if (options.step) {
      options.interval += options.step;
    }

    if (options.multiply) {
      options.interval *= options.multiply;
    }

    if (options.max || options.min) {
      options.interval = clamp(options.interval, options.min, options.max);
    }

    setInterval(callback, options);
  }
  options.timeout = setTimeout(func, options.interval);

  return () => {
    clearTimeout(options.timeout);
  }
};

export function wrapAround(value, min=0, max=1) {
  if (value > max) {
    value = value % (max + 1);
  }

  if (value < min) {
    value = max + (value + 1) % (max + 1);
  }

  return value;
}

export function clearElement(element) {
  if (!element) {
    return;
  }

  let child;
  while (child = element.firstChild) {
      element.removeChild(child);
  }
}

// eventAnchor:
//    Element that the event is tied to. When cleanup is called on the eventAchor element, all
//    events linked to it will be removed. If undefined, the scope parameter is used instead
export function addEventListener(scope = document, event = 'click', callback, eventAnchor) {
  const cleaner = _addEventListener(scope, event, callback);

  if (!eventAnchor) {
    eventAnchor = scope;
  }

  _addCleanerEventAnchor(eventAnchor, cleaner);

  return () => {
    cleaner();

    removeCleaner(eventAnchor, cleaner);
  }
}

function _addCleanerEventAnchor(eventAnchor, cleaner) {
  addCleaner(eventAnchor, cleaner);
}

function _addEventListener(scope = document, event = 'click', callback) {
  scope.addEventListener(event, callback);

  const remover = () => {
    scope.removeEventListener(event, callback);
  };

  return remover;
}

export function getChildAbsolute(element, includeParent = false) {
  return getChildAbsoluteRecursive(element, includeParent);
}

function getChildAbsoluteRecursive(element, includeParent = false, recusionCount = 0) {
  if (!element) {
    return;
  }

  let foundAbsolute = false;
  const style = window.getComputedStyle(element);

  if (style.position === 'absolute') {
    foundAbsolute = true;
  }

  if (recusionCount === 0 && !includeParent) {
    foundAbsolute = false;
  }

  if (foundAbsolute) {
    return element;
  } else {
    return getChildAbsoluteRecursive(element.parentElement, includeParent, recusionCount + 1);
  }
}

export function isAbsolute(element) {
  const style = window.getComputedStyle(element);

  return style.position === 'absolute';
}

// Returns in px
export function getWidth(element) {
  const value = element.style.getPropertyValue('width');
  let width = Number.parseFloat(value) || 0;

  // Calculate instead
  if (!value.includes('px') || value.length === 0) {
    const rect = element.getBBox ? element.getBBox() : element.getBoundingClientRect();

    width = rect.width;
  }

  return width;
}

// Returns in px
export function getHeight(element) {
  const value = element.style.getPropertyValue('height');
  let height = Number.parseFloat(value) || 0;

  // Calculate instead
  if (!value.includes('px') || value.length === 0) {
    const rect = element.getBBox ? element.getBBox() : element.getBoundingClientRect();

    height = rect.height;
  }

  return height;
}

// Useful for testing memory leaks
export function create1MBString() {
  return new Array(1000000).join('*');
}

const boundsDefault = {min: undefined, max: undefined};

// Returns bounds of a set of children or descendants
export function getDescendantBounds(
  container,
  getDescendant = (item) => {return item},
) {
  let xBounds = {...boundsDefault};
  let yBounds = {...boundsDefault};
  const descendants = [];

  // Determine bounds
  for(const item of container.children) {
    const child = getDescendant(item);

    if (!child) {
      continue;
    }

    let rect = child.getBoundingClientRect();
    updateBounds(rect.x, rect.width, xBounds);
    updateBounds(rect.y, rect.height, yBounds);

    descendants.push({
      element: child,
      rect: rect,
    });
  }

  return {
    x: xBounds,
    y: yBounds,
    elementsData: descendants,
  }
}

export function getChildRelativeData(container, options = {
  createChildrenData: noop,
}) {
  return getDescendantRelativeData(container, undefined, options);
}

// Returns position of a set of children or descendants, such that the most top-left element represents [0, 0]
export function getDescendantRelativeData(
  container,
  getDescendant = (item) => {return item},
  options,
) {
  const bounds = getDescendantBounds(container, getDescendant);

  const childrenData = [];
  for (const data of bounds.elementsData) {
    const {element, rect} = data;
    let rotation = getTransformValues(element, 'rotate')[0];
    rotation = Number.parseFloat(rotation) || 0;
    const zIndex = Number.parseInt(getProperty(element, 'z-index')) || 0;

    const elData = {
      position: {
        x: rect.x - bounds.x.min,
        y: rect.y - bounds.y.min,
      },
      rotation,
      zIndex,
    };
    if (options.createChildrenData === noop) {
      childrenData.push({
        element: element,
        ...elData,
      });
    } else {
      childrenData.push(options.createChildrenData(element, elData));
    }
  }

  return {
    width: bounds.x.max - bounds.x.min,
    height: bounds.y.max - bounds.y.min,
    childrenData,
  }
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

export function offsetElementBy(element, offsetX, offsetY) {
  let x = 0;
  let y = 0;
  let left = element.style.getPropertyValue('left');
  let top = element.style.getPropertyValue('top');
  if (top.length > 0 && left.length > 0) {
    x = Number.parseFloat(left);
    y = Number.parseFloat(top);
  } else {
    let rect = element.getBoundingClientRect();
    x = rect.x;
    y = rect.y;
  }

  moveElementTo(element, x + offsetX, y + offsetY);
}

export function moveElementTo(element, posX = 0, posY = 0) {
  element.style.setProperty('left', `${posX}px`);
  element.style.setProperty('top', `${posY}px`);
}

export function centerElementTo(element, posX = 0, posY = 0) {
  element.style.setProperty('left', `${posX - element.clientWidth / 2}px`);
  element.style.setProperty('top', `${posY - element.clientHeight / 2}px`);
}

export function translateBy(element, x, y) {
  let vals = getTransformValues(element, 'translate') || [0, 0];

  vals[0] = `${Number.parseFloat(vals[0]) + x}px`;
  vals[1] = `${Number.parseFloat(vals[1]) + y}px`;;

  setTransformValues(element, 'translate', vals);
}

export function setTransformValues(element, transformKey, values, asAttribute = false) {
  let transform = element.style.transform;

  let newVal = `${transformKey}(`;
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    newVal += val;

    if (i < values.length - 1) {
      newVal += ', ';
    }
  }
  newVal += ')';

  if (transform.includes(transformKey)) {
    const startIndex = transform.indexOf(transformKey);
    const endIndex = transform.indexOf(')', startIndex);
    const substr = transform.substring(startIndex, endIndex + 1);

    transform = transform.replace(substr, newVal);
  } else {
    if (transform.length !== 0) {
      transform += ' ';
    }

    transform += newVal;
  }

  if (asAttribute) {
    element.setAttribute('transform', transform);
  } else {
    element.style.setProperty('transform', transform);
  }
}

export function getTransformValues(element, transformKey) {
  const transform = element.style.transform;
  let values = [];
  if (transform.includes(transformKey)) {
    values = transform.split(`${transformKey}(`)[1].split(')')[0].replaceAll(' ', '').split(',');
  }

  return values;
}

// button = left, right, middle
// actionType = hold
const AddMouseListenerDefaults = {
  button: 'left',
  actionType: 'hold',
  includeDrag: true,
};
export function addMouseListener(
  element = document,
  options = AddMouseListenerDefaults,
  callback = ()=>{},
  eventAnchor,
) {
  options = {...AddMouseListenerDefaults, ...options};

  const state = {
    isActive: false,
  };

  let cleaner = () => {};
  if (options.actionType === 'hold') {
    cleaner = _addMouseListenerHold(element, state, options, callback);
  }

  if (!eventAnchor) {
    eventAnchor = element;
  }

  _addCleanerEventAnchor(eventAnchor, cleaner);

  return () => {
    cleaner();

    removeCleaner(eventAnchor, cleaner);
  }
}

const buttonStringToInt = {
  'left': 0,
  'middle': 1,
  'right': 2,
};

function _addMouseListenerHold(element, state, options, callback) {
  const removeMouseUp = _addEventListener(window, 'mouseup', () => {
    state.isActive = false;
  });

  const removeHold = _addEventListener(element, 'mousedown', (mouseEvent) => {
    if (mouseEvent.button === buttonStringToInt[options.button]) {
      state.isActive = true;
      callback(mouseEvent);
    }
  });

  let removeMove = () => {};
  if (options.includeDrag) {
    removeMove = _addEventListener(document, 'mousemove', (mouseEvent) => {
      if (state.isActive) {
        callback(mouseEvent);
      }
    });
  }

  return () => {
    removeMouseUp();
    removeHold();
    removeMove();
  };
}

export function freezeScroll() {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const unfreeze = addEventListener(document, 'scroll', (event) => {
    window.scrollTo(scrollX, scrollY);
  });

  return unfreeze;
}

export function isIterable(element) {
  if (!element) {
    return false;
  }

  return typeof(element[Symbol.iterator]) === 'function';
}
