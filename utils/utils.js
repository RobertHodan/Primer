// http://answers.unity.com/answers/1313644/view.html
// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-34.php
const vectorDefault = {x: 0, y: 0};
export function AngleTo(origin = vectorDefault, target = vectorDefault, inDegrees = false) {
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

export function clamp(value, min=0, max=1) {
  if (value > max) {
    value = max;
  }

  if (value < min) {
    value = min;
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

export function addEventListener(scope = document, event = 'click', callback, removers) {
  scope.addEventListener(event, callback);

  const remover = () => {
    scope.removeEventListener(event, callback);
  };

  if (removers != undefined) {
    removers.push(remover);
  }

  return remover;
}

export function stringToTemplate(htmlStr) {
  const template = document.createElement('template');
  template.innerHTML = htmlStr;

  return template;
}

export function stringToElement(htmlStr) {
  return stringToTemplate(htmlStr).content.firstElementChild;
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


// button = left, right, middle
// actionType = hold
const AddMouseListenerDefaults = {
  button: 'left',
  actionType: 'hold',
  includeDrag: true,
};
export function addMouseListener(element = document, options = AddMouseListenerDefaults, callback = ()=>{}) {
  options = {...AddMouseListenerDefaults, ...options};

  const state = {
    isActive: false,
  };

  let cleanup = () => {};
  if (options.actionType === 'hold') {
    cleanup = addMouseListenerHold(element, state, options, callback);
  }

  return () => {
    cleanup();
  };
}

const buttonStringToInt = {
  'left': 0,
  'middle': 1,
  'right': 2,
};

function addMouseListenerHold(element, state, options, callback) {
  const removeMouseUp = addEventListener(window, 'mouseup', () => {
    state.isActive = false;
  });

  const removeHold = addEventListener(element, 'mousedown', (mouseEvent) => {
    if (mouseEvent.button === buttonStringToInt[options.button]) {
      state.isActive = true;
      callback(mouseEvent);
    }
  });

  let removeMove = () => {};
  if (options.includeDrag) {
    removeMove = addEventListener(document, 'mousemove', (mouseEvent) => {
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
