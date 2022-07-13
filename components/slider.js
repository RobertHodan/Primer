import { actionable } from '../component-mutators/actionable.js';
import { addEventListener, clamp, noop } from '../utils/utils.js';
import { Component } from './component.js';

/**
 * @typedef {Object} SliderParams
 * @property {number?} max
 * @property {number?} min
 * @property {number?} step
 * @property {number?} value
 * @property {Function?} onFocus
 * @property {Function?} onBlur
 */

const defaults = {
  min: 0,
  max: 100,
  step: 10,
  value: 0,
  onChanged: noop,
  onWorkingChanged: noop,
}

export class Slider extends Component {
  /**
   *
   * @param {SliderParams} settings
   */
  constructor(settings) {
    settings = {...defaults, ...settings};

    settings.tagName = 'div',
    super(settings);

    this.el.classList.add('slider');

    this.value = settings.value;
    this.stepValue = settings.step;
    this.onChanged = settings.onChanged;
    this.onWorkingChanged = settings.onWorkingChanged;

    this.min = settings.min;
    this.max = settings.max;

    this._addMouseActions();

    this._createContents();
  }

  _addMouseActions() {
    let removeMove = noop;
    this.el.addEventListener('mousedown', (e) => {
      const value = this._getValueByScreenPos(e.clientX);
      this.setWorkingValue(value);
      document.addEventListener('mouseup', (e) => {
        removeMove();
      }, {
        once: true,
      });

      const onMove = (e) => {
        const value = this._getValueByScreenPos(e.clientX);
        this.setWorkingValue(value);
      }
      document.addEventListener('mousemove', onMove);
      removeMove = () => {
        document.removeEventListener('mousemove', onMove);
      };
    });
  }

  _getValueByScreenPos(pos) {
    const rect = this.bar.getBoundingClientRect();
    const relative = pos - rect.x;
    const value = this._getValueByPx(relative);

    return value;
  }

  _createContents() {
    const bar = document.createElement('div');
    this.bar = bar;
    bar.classList.add('bar');

    const thumb = document.createElement('div');
    this.thumb = thumb;
    thumb.classList.add('thumb');

    this.el.append(bar);
    this.el.append(thumb);
  }

  stepUp() {
    this.step(this.stepValue);
  }

  stepDown() {
    this.step(-this.stepValue);
  }

  step(value) {
    value = this.value + value;

    this.setValue(value);
  }

  _getValueByPx(pos) {
    const width = this.bar.clientWidth;
    const percent = pos / width;

    return this.max * percent;
  }

  _updateThumbPosition() {
    const width = this.bar.clientWidth;
    const pos = this.value / (this.max - this.min);
    const thumbPos = width * pos;
    this.thumb.style.setProperty('left', `${thumbPos}px`);
  }

  setWorkingValue(value) {
    value = Number.parseFloat(value);
    value = clamp(value, this.min, this.max);

    this.value = value;
    this._updateThumbPosition();

    this.onWorkingChanged(value);
  }

  setValue(value) {
    this.setWorkingValue(value);

    this.onChanged(this.value);
  }
}
