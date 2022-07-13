import { noop } from "../utils/utils.js";

export function applyRequisites(component, requisites, settings) {
  const keys = Object.keys(requisites);

  for (const key of keys) {
    const requisite = component[key];
    const hasRequisite = requisite != undefined;
    const isFunction = typeof(settings[key]) === 'function';
    if (!hasRequisite) {
      if (isFunction) {
        component[key] = settings[key].bind(component);
        continue;
      }
      component[key] = settings[key];
    }

    if (isFunction) {
      if (settings[key] !== noop) {
        if (!component[`_${key}`]) {
          component[`_${key}`] = settings[key].bind(component);
        }
      }
      continue;
    }
  }
}

/**
 *
 * @param {Component | HTMLElement} element
 * @returns {Component}
 */
export function getComponent(element) {
  if (!element || element.isComponent) {
    return element;
  }

  return element.getComponent && element.getComponent();
}

/**
 *
 * @param {Component | HTMLElement} component
 */
 export function isComponent(component) {
   if (!component) {
     return false;
   }

   if (component.isComponent === undefined) {
     component = getComponent(component);
   }

  return component.isComponent;
}
