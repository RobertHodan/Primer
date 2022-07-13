import { applyRequisites, getComponent, isComponent } from '../component-mutators/utils.js';

/**
 * @typedef {Object} Actionable
 * @property {Function} action
 */
const defaults = {
  action: () => {},
  enableDefaultEvents: true,
}

/**
 *
 * @param {Component} component
 * @param {Actionable} settings
 */
export function actionable(component, settings) {
  settings = {...defaults, ...settings};

  if (component.actionable) {
    return;
  }

  component.isActionable = true;

  applyRequisites(component, defaults, settings);

  if (settings.enableDefaultEvents) {
    component.el.addEventListener('click', () => {
      component.action();
    });
  }
}

export function isActionable(component) {
  if (!isComponent(component)) {
    component = getComponent(component);

    if (!component) {
      return false;
    }
  }

  return component.isActionable();
}
