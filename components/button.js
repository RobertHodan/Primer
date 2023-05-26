import { actionable } from '../component-mutators/actionable.js';
import { noop } from '../utils/utils.js';
import { Component } from './component.js';

/**
 * @typedef {Object} ComponentParams
 * @property {Function?} action
 * @property {boolean?} keyboardFocusable
 */

const defaults = {
  action: noop,
  onClick: noop,
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

    const {onClick} = settings;

    actionable(this, {
      onClick,
    });
    this._onAction = settings.action;
  }

  action() {
    this._onAction(this);
  }
}
