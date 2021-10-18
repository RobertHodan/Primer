import { addEventListener } from './utils/utils.js';

export const PrimerDefaults = {
  overideDefaultClassName: false,
}

export class Primer {
  constructor(options) {
    this.removers = [];
    this.element;
    this.options = options;
  }

  applyOptions() {
    if (this.options.overideDefaultClassName) {
      this.element.className = '';
    } else {
      this.element.className = 'primer ' + this.element.className;
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
}