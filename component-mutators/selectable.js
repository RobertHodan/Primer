import { applyRequisites, getComponent } from '../component-mutators/utils.js';
import { noop } from '../utils/utils.js';

/**
 * @typedef {Object} selectable
 * @property {Function} select
 * @property {Function} onSelect // Boolean parameter, isSelected
 */
const requisites = {
  toggle: function(isSelected) {
    if (isSelected === undefined) {
      isSelected = !this.select.classList.contains('selected');
    }

    if (isSelected === this.isSelected) {
      return;
    }

    if (isSelected) {
      this.el.classList.add('selected');
    } else {
      this.el.classList.remove('selected');
    }
    this.isSelected = isSelected;

    this.onSelect(isSelected);
  },
  select: function() {
    this.toggle(true);
  },
  deselect: function() {
    this.toggle(false);
  },
  onSelect: noop,
  isSelected: false,
}

/**
 *
 * @param {Component} component
 * @param {*} settings
 */
export function selectable(component, settings) {
  settings = {...requisites, ...settings};

  if (component.isSelectable) {
    return;
  }

  component.isSelectable = true;

  applyRequisites(component, requisites, settings);
}

/**
 *
 * @param {Component | HTMLElement} component
 */
export function isSelectable(component) {
  if (!component || !component.isComponent) {
    component = getComponent(component);

    if (!component) {
      return false;
    }
  }

  return component.isSelectable;
}
