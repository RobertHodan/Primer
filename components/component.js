/**
 * @typedef {Object} ComponentParams
 * @property {string | HTMLElement} content
 * @property {string?} elementType
 * @property {string?} className
 */

import { clearElement, noop } from '../utils/utils.js';

const defaults = {
  elementType: 'span',
  tagName: 'div',
}

export class Component {
  /**
  *
  * @param {ComponentParams} settings
  */
  constructor(settings) {
    settings = {...defaults, ...settings};

    this.el = document.createElement(settings.tagName);

    if (settings.addMutators) {
      settings.addMutators.call(this);
    }

    if (settings.content && settings.content.getElement) {
      settings.content = settings.content.getElement();
    }

    if (settings.content) {
      this.setContent(settings.content);
    }

    if (settings.className) {
      if (Array.isArray(settings.className)) {
        this.el.classList.add(...settings.className);
      } else {
        this.el.classList.add(settings.className);
      }
    }

    this.isComponent = true;

    this.el.component = new WeakRef(this);
    this.el.getComponent = () => {
      return this.el.component.deref();
    };
  }

  append(child) {
    if (!child) {
      return;
    }

    if (child.getElement) {
      child = child.getElement();
    }

    this.el.append(child);
  }

  getElement() {
    return this.el;
  }

  setContent(content) {
    this.removeChildren();

    this.append(content);
  }

  removeChildren() {
    clearElement(this.el);
  }

  remove() {
    this.el.remove();
  }

  destroy() {
    delete this.el;
  }
}
