export function removeEmptyValues(obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
    return newObj;
  }, {});
}
