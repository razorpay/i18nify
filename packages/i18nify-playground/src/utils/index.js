export function removeEmptyValues(obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
      if (key === 'fractionalSecondDigits') newObj[key] = +obj[key];
      else if (key === 'useGrouping') {
        if (obj[key] === 'true') obj[key] = true;
        else obj[key] = false;
      } else newObj[key] = obj[key];
    }
    return newObj;
  }, {});
}
