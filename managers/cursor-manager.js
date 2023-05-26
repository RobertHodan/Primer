import { selectable } from '../component-mutators/selectable.js';
import { isComponent } from '../component-mutators/utils.js';
import { StringController } from '../string-controller.js';
import { centerElementTo, moveElementTo, noop, wrapAround } from '../utils/utils.js';
import { Button } from '../components/button.js';
import { Component } from '../components/component.js';
import { numPadNumericSimple } from '../components/virtual-keyboard-templates.js';

/**
 * @typedef {Object} ComponentParams
 * @property {Function?} action
 * @property {boolean?} keyboardFocusable
 * @property {Array<Array<TemplateObject>} template
 */

/**
 * @typedef {Object} TemplateObject
 * @property {HTMLElement} content
 * @property {string} action
 */

const defaults = {
  action: noop,
  onValueUpdated: noop,
  onSubmit: noop,
  keyboardFocusable: true,
  className: 'cursor-manager'
}

export class CursorManager extends Component {
  /**
   *
   * @param {ComponentParams} settings
   */
  constructor(settings) {
    settings = {...defaults, ...settings};
    super(settings);

    this.cursor = new Component({className: 'cursor'});
    document.body.append(this.cursor.el);

    document.addEventListener('mousemove', (e) => {
      this.moveTo(e.x, e.y);
    });
  }

  click() {
    const coord = this.getCursorCoord();
    const element = document.elementFromPoint(coord.x, coord.y);
    element.click();
  }

  moveTo(x, y) {
    centerElementTo(this.cursor.el, x, y);
  }

  getCursorCoord() {
    const rect = this.cursor.el.getBoundingClientRect();
    return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };
  }

  showCursor() {

  }
}
