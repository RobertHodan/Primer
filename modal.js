import { stringToElement, linkCSS } from './utils/utils.js';
import { Primer, PrimerDefaults } from './primer.js';
import { focusTrap } from './focus-trap.js';

linkCSS('/primer/modal.css');

export const ModalDefaults = {
  ...PrimerDefaults,
  content: document.body,
  startOpen: false,
}

export class Modal extends Primer {
  constructor(options = ModalDefaults) {
    options = {...ModalDefaults, ...options};

    super(options);
    this.element = stringToElement(`
      <div class="modal">
        <dialog></dialog>
        <div class="background"></div>
      </div>
    `);

    this.dialog = this.element.getElementsByTagName('dialog')[0];
    const background = this.element.getElementsByClassName('background')[0];
    this.canScroll = true;

    this.addEventListener(window, 'keydown', (event) => {
      if (event.key === 'Escape') {
        this.hide();
      }
    });
    this.addEventListener(background, 'click', () => {
      this.hide();
    });

    if (options.content !== document.body) {
      this.dialog.append(options.content);
    }

    this.untrap;
    this.removers.push(() => {
      if (this.untrap) {
        this.untrap();
      }
    });

    if (options.startOpen) {
      this.show();
    } else {
      this.hide();
    }

    this.applyOptions();
  }

  show() {
    if (this.dialog.show) {
      this.dialog.show();
    } else {
      this.dialog.setAttribute('open', true);
    }

    if (this.element.classList.contains('hidden')) {
      this.element.classList.remove('hidden');
    }

    this.bodyOverflow = "overflow";
    document.body.style.setProperty('overflow', 'hidden');

    if (!this.untrap) {
      this.untrap = focusTrap(this.dialog);
    }
  }

  hide() {
    if (this.dialog.close) {
      this.dialog.close();
    } else {
      this.dialog.removeAttribute('close');
    }

    if (!this.element.classList.contains('hidden')) {
      this.element.classList.add('hidden');
    }

    document.body.style.removeProperty('overflow');

    if (this.untrap) {
      this.untrap();
      this.untrap = undefined;
    }
  }
}
