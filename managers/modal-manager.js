import { isComponent } from '../component-mutators/utils.js';
import { clearElement, noop } from '../utils/utils.js';
import { Component } from '../components/component.js';
import { focusTrap } from '../focus-trap.js';
import { createDynamicIcon } from '../../nav-ui/dynamic-icon.js';
import { NAVACTIONS } from '../../nav-ui/nav-actions.js';
import { ActionBar } from '../../nav-ui/components/action-bar.js';

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
  onShow: noop,
  onHide: noop,
  keyboardFocusable: true,
  footer: undefined,
  header: undefined,
  className: 'modal-manager'
}

export class ModalManager extends Component {
  /**
   *
   * @param {ComponentParams} settings
   */
  constructor(settings) {
    settings = {...defaults, ...settings};
    super(settings);

    this.modals = {};

    this.container = new Component({className: 'modal-container'});
    this.append(this.container);

    this.header = new Component({className: 'modal-header'});
    this.container.append(this.header);

    this.content = new Component({className: 'modal-content'});
    this.container.append(this.content);

    this.footer = new Component({className: 'modal-footer'});
    this.container.append(this.footer);

    if (settings.footer) {
      this.setFooter(settings.footer);
    }

    if (settings.header) {
      this.header.append(settings.header);
    }

    this.container.append(this.actionBar);
    this.getValueMap = {};
    this.setValueMap = {};

    this.modalCloseCb = noop;
    this.activeId = '';

    this.onShow = settings.onShow;
    this.onHide = settings.onHide;

    this.el.addEventListener('click', (e) => {
      if (e.target === this.el) {
        this.cancel();
      }
    });

    this.disableFocusTrap = noop;

    this._hide();
  }

  setFooter(footer) {
    this.footer.removeChildren();
    this.footer.append(footer);
  }

  addModal(id, modal, callbacks) {
    if (isComponent(modal)) {
      modal = modal.el;
    }

    this.modals[id] = modal;

    this.getValueMap[id] = callbacks.getValue;
    this.setValueMap[id] = callbacks.setValue;
  }

  cancel() {
    this._hide(false);
  }

  submit() {
    this._hide(true);
  }

  _hide(isSuccess) {
    const modalValue = this.getValueMap[this.activeId];
    const modal = this.modals[this.activeId];

    this.disableFocusTrap();
    this.disableFocusTrap = noop;
    this.activeId = undefined;

    this.container.remove();
    this.el.classList.add('hidden');

    this.onHide();

    if (!modal) {
      return;
    }

    modal.remove();
    this.modalCloseCb(modalValue(), isSuccess);
  }

  _show() {
    this.append(this.container);
    this.el.classList.remove('hidden');

    this.onShow();
  }

  showModal(id, inputValue, onClose) {
    if (this.activeId === id) {
      return;
    }

    const modal = this.modals[id];

    if (modal) {
      this._show();
      this._appendModal(modal);

      this.disableFocusTrap = focusTrap(this.container.el);

      this.modalCloseCb = onClose || noop;
      this.activeId = id;

      const setValue = this.setValueMap[id];
      if (setValue && inputValue != undefined) {
        setValue(inputValue);
      }
    }
  }

  _appendModal(modal) {
    this.content.el.append(modal);

    if (this.activeId) {
      const activeModal = this.modals[this.activeId];
      if (activeModal) {
        activeModal.remove();
      }
    }
  }
}
