import { stringToElement } from '../utils/string.js';
import { Primer, PrimerDefaults } from '../primer.js';

export const ListDefaults = {
  ...PrimerDefaults,
  items: [],
  createItem: () => {}, // must return element
}

export class List extends Primer {
  constructor(options = ListDefaults) {
    options = {...ListDefaults, ...options};
    super(options);

    this.createItem = options.createItem;

    this.element = stringToElement(`
      <ul>
      </ul>
    `);

    let items = options.items;
    const isArray = Array.isArray(options.items);
    if (!isArray) {
      items = Object.keys(options.items);
    }
    for (let itemData of items) {
      if (!isArray) {
        itemData = options.items[itemData];
      }
      this.addItem(itemData);
    }

    this.applyOptions();
  }

  getElement() {
    return this.element;
  }

  addItem(itemData) {
    const li = stringToElement(`<li></li>`)
    let item = this.createItem(itemData, li);

    if (!li.hasChildNodes()) {
      li.append(item);
    }

    this.element.append(li);
  }
}
