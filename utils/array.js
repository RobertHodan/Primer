export function removeFromArray(arr, item) {
  const index = arr.indexOf(item);
  if (index >= 0) {
    arr.splice(index, 1);
  }
}

const defaultIsEqual = function(a, b) {
  return a === b;
};

export function isArrayEqual(arrA, arrB, isEqual = defaultIsEqual) {
  if (arrA === arrB) {
    return true;
  }

  if (arrA.length !== arrB.length) {
    return false;
  }

  let equal = true;
  for (let i = 0; i < arrA.length; i++) {
    if (!isEqual( arrA[i], arrB[i] )) {
      equal = false;
      break;
    }
  }

  return equal;
}
