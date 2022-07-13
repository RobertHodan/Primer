/**
 * @typedef {Object} DrawerParams
 * @property {Array<string | HTMLElement>} items
 */

 import { clearElement, noop, wrapAround } from '../utils/utils.js';
 import { Component } from './component.js';
 import { selectableGroup } from '../component-mutators/selectable-group.js';
import { selectable } from '../component-mutators/selectable.js';
import { actionable } from '../component-mutators/actionable.js';
import { Button } from './button.js';

 const defaults = {
   label: undefined,
   onShow: noop,
   onHide: noop,
   shouldPrependContent: false,
 }

export class Drawer extends Component {
  /**
  *
  * @param {DrawerParams} settings
  */
  constructor(settings) {
    settings = {...defaults, ...settings};

    super(settings);
    this.el.classList.add('drawer');

    this.onHide = settings.onHide;
    this.onShow = settings.onShow;
    this.isContentPrepended = settings.shouldPrependContent;

    this.labelContainer = new Button({
      className: 'drawer-label',
      keyboardFocusable: false,
      action: () => this.action()
    });
    this.el.append(this.labelContainer.el);

    this.drawerContent = new Component({
      className: 'drawer-content',
    });

    if (settings.label) {
      this.labelContainer.append(settings.label);
    }
  }

  setLabel(label) {
    this.labelContainer.removeChildren();
    this.labelContainer.append(label);
  }

  setContent(content) {
    this.drawerContent.removeChildren();
    this.drawerContent.append(content);
  }

  action() {
    this.isVisible() ? this.hide() : this.show();
  }

  removeChildren() {
    this.drawerContent.removeChildren();
  }

  append(item) {
    this.drawerContent.append(item);
  }

  show() {
    if (this.isVisible()) {
      return;
    }

    if (this.isContentPrepended) {
      this.el.prepend(this.drawerContent.el);
    } else {
      this.el.append(this.drawerContent.el);
    }
    this.el.classList.add('open');
    this.onShow();
  }

  hide() {
    if (!this.isVisible()) {
      return;
    }

    this.drawerContent.remove();
    this.el.classList.remove('open');
    this.onHide();
  }

  isVisible() {
    return this.el.classList.contains('open');
  }
}
