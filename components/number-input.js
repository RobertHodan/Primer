import { actionable } from '../component-mutators/actionable.js';
import { clamp, noop } from '../utils/utils.js';
import { Component } from './component.js';

/**
 * @typedef {Object} ComponentParams
 * @property {number?} max
 * @property {number?} min
 * @property {number?} step
 * @property {number?} value
 * @property {number?} toDecimal
 * Don't override values with decimal parsing
 * @property {boolean?} retainRawValue
 * @property {boolean?} keyboardFocusable
 * @property {Function?} onFocus
 * @property {Function?} onBlur
 */

const defaults = {
  step: 10,
  value: 0,
  keyboardFocusable: true,
  onFocus: noop,
  onBlur: noop,
  onChanged: noop,
  retainRawValue: true,
}

export class NumberInput extends Component {
  /**
   *
   * @param {ComponentParams} settings
   */
  constructor(settings) {
    settings = {...defaults, ...settings};

    settings.tagName = 'input',
    super(settings);

    actionable(this, {
      enableDefaultEvents: false,
    });

    this.value = settings.value;
    this.stepValue = settings.step;
    this.onBlur = settings.onBlur;
    this.onFocus = settings.onFocus;
    this.onChanged = settings.onChanged;
    this.retainRawValue = settings.retainRawValue;
    this.keyboardFocusable = settings.keyboardFocusable;
    this.toDecimal = settings.toDecimal;

    this.el.setAttribute('inputmode', 'numeric');
    this.el.setAttribute('pattern', '\d*');
    this.el.setAttribute('step', settings.step);
    this.el.setAttribute('value', settings.value);

    if (!this.keyboardFocusable) {
      this.el.setAttribute('tabIndex', -1);
    }

    if (settings.max != undefined) {
      this.max = settings.max;
    }

    if (settings.min != undefined) {
      this.min = settings.min;
    }

    this.el.addEventListener('focus', () => {
      this._setFocusFlag(true);
    });
    this.el.addEventListener('blur', () => {
      this._setFocusFlag(false);
    });

    this.el.addEventListener('input', () => {
      this._validateInput();
    })
  }

  _validateInput() {
    let value = this.el.value;

    value = Number.parseFloat(value);

    if (Number.isNaN(value)) {
      value = 0;
    }

    this.setWorkingValue(value);
  }

  action() {
    if (this.isFocused) {
      this.blur();
      this.setValue(this.value);
    } else {
      this.focus();
    }
  }

  _setFocusFlag(isFocused) {
    this.isFocused = isFocused;

    if (this.isFocused) {
      this.onFocus();
    } else {
      this.onBlur();
    }
  }

  focus() {
    this._setFocusFlag(true);
    this.el.focus();
  }

  blur() {
    this._setFocusFlag(false);
    this.el.blur();
  }

  stepUp() {
    this.step(this.stepValue);
  }

  stepDown() {
    this.step(-this.stepValue);
  }

  step(value) {
    let newValue = this.value + value;

    this.setValue(newValue);
  }

  setWorkingValue(value) {
    this.value = value;

    if (this.toDecimal) {
      value = Number.parseFloat(value.toFixed(2));
    }
    if (!this.retainRawValue) {
      this.value = value;
    }
    this.el.value = value;
  }

  setValue(value) {
    if (this.min || this.max) {
      value = clamp(value, this.min, this.max);
    }

    this.setWorkingValue(value);
    this.onChanged(this.value);
  }
}
