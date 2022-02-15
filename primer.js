import { addEventListener } from './utils/utils.js';

export const PrimerDefaults = {
  overideClassName: false,
}

export class Primer {
  constructor(options) {
    this.removers = [];
    this.element;
    this.options = options;
  }

  applyOptions() {
    if (this.options.overideClassName) {
      this.element.className = '';
    }

    if (this.options.className) {
      this.element.className = this.options.className;
    }
  }

  addEventListener(scope = document, event = '', callback = () => {}) {
    this.addRemover(addEventListener(scope, event, callback));
  }

  addRemover(removerCb = ()=>{}) {
    this.removers.push(removerCb);
  }

  removeEvents() {
    for (const remove of this.removers) {
      remove();
    }
  }

  delete() {
    this.removeEvents();

    if (this.element) {
      this.element.remove();
    }
  }
}