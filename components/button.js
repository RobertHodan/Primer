import { actionable } from '../component-mutators/actionable.js';
import { Component } from './component.js';

/**
 * @typedef {Object} ComponentParams
 * @property {Function?} action
 * @property {boolean?} keyboardFocusable
 */

const defaults = {
  action: () => {},
  keyboardFocusable: true,
}

export class Button extends Component {
  /**
   *
   * @param {ComponentParams} settings
   */
  constructor(settings) {
    settings = {...defaults, ...settings};

    settings.tagName = settings.keyboardFocusable ? 'button' : 'div';
    super(settings);

    actionable(this);
    this._onAction = settings.action;
  }

  action() {
    this._onAction(this);
  }
}
