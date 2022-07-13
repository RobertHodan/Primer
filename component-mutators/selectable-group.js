import { addEventListener, clamp, noop, wrapAround } from '../utils/utils.js';
import { applyRequisites, getComponent, isComponent } from '../component-mutators/utils.js';
import { isSelectable } from './selectable.js';

/**
 * @typedef {Object} SelectableGroup
 * @property {Function?} select
 * @property {Function?} selectNext
 * @property {Function?} selectPrev
 * @property {Function?} onSelect
 * @property {boolean?} wrapAround
 * @property {Function?} canSelect
 */

const requisites = {
  select: function(index, items, skipCallback) {
    items = items || this.getItems();
    if (typeof(index) !== 'number') {
      index = items.indexOf(index);

      if (index < 0) {
        return false;
      }
    }

    if (!this.canSelect()) {
      return false;
    }

    if (this.wrapAround) {
      index = wrapAround(index, 0, items.length - 1);
    } else {
      index = clamp(index, 0, items.length - 1);
    }

    this.index = index;

    let child = items[index];
    if (!skipCallback) {
      this.onSelect(child, index);
    }

    if (isSelectable(child)) {
      this._selectChildComponent(child);
    }

    return true;
  },
  selectNext: function() {
    let items = this.getItems();
    let index =  items.indexOf(this.prevChild);
    if (index < 0) {
      index = this.index;
    }
    this.select(index + 1)
  },
  selectPrev: function() {
    let items = this.getItems();
    let index =  items.indexOf(this.prevChild);
    if (index < 0) {
      index = this.index;
    }
    this.select(index - 1)
  },
  getSelectedIndex: function() { return this.index },
  onSelect: noop,
  _deselectPreviousChild: noop,
  getItems: function() {
    return Array.from(this.el.children);
  },
  _selectChildComponent: function(child) {
    let component = child;
    if (child.getComponent) {
      component = child.getComponent();
    }
    this._deselectPreviousChild();

    component.select();

    this._deselectPreviousChild = () => {
      component.deselect();
      this._deselectPreviousChild = noop;
    }

    this.prevChild = child;
  },
  wrapAround: false,
  selectOnHover: false,
  index: 0,
  selectedChild: 0,
  canSelect: function() { return true },
}

/**
 *
 * @param {Component} component
 * @param {SelectableGroup} settings
 */
export function selectableGroup(component, settings) {
  settings = {...requisites, ...settings};

  if (component.isSelectableGroup) {
    return;
  }

  component.isSelectableGroup = true;

  applyRequisites(component, requisites, settings);

  if (component.selectOnHover) {
    const el = component.getElement();
    const removers = [];
    el.addEventListener('mouseenter', () => {
      const items = component.getItems();
      for (const item of items) {
        const itemEl = item.isComponent ? item.getElement() : item;
        const remover = addEventListener(itemEl, 'mouseenter', () => {
          const index = items.indexOf(item);
          component.select(index);
        });
        removers.push(remover);
      }
    });

    el.addEventListener('mouseleave', () => {
      for (const remover of removers) {
        remover();
      }
    });
  }
}
