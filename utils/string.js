export function stringToTemplate(htmlStr) {
  const template = document.createElement('template');
  template.innerHTML = htmlStr;

  return template;
}

export function stringToElement(htmlStr) {
  return stringToTemplate(htmlStr).content.firstElementChild;
}

// Replace '-' with spaces, and capitalize every word
export function prettifyLabel(str) {
  str = str.replace('-', ' ');

  let newStr = "";
  // Uppercase the first letter of every word
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (i === 0 || str[i-1] === ' ') {
      newStr += char.toUpperCase();
      continue;
    }

    newStr += char;
  }

  return newStr;
}
