import { stringToElement } from './utils.js';

export const UnorderedListDefaults = {
  className: '',
}

export function UnorderedList(itemData, itemFunc, options = UnorderedListDefaults) {
  options = {...UnorderedListDefaults, ...options};

  const element = stringToElement(`
    <ul>
    </ul>
  `);

  if (options.className.length > 0) {
    element.className = options.className;
  }

  for (const data of itemData) {
    const item = itemFunc(data);

    element.append(item);
  }

  return element;
}
