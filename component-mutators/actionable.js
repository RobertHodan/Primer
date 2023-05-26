import { applyRequisites, getComponent, isComponent } from '../component-mutators/utils.js';
import { noop } from '../utils/utils.js';

/**
 * @typedef {Object} Actionable
 * @property {Function} action
 */
const defaults = {
  action: noop,
  onClick: noop,
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
    let onClick = () => {
      component.action();
    };

    if (settings.onClick != noop) {
      onClick = settings.onClick;
    }

    component.el.addEventListener('click', onClick);
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
