/* eslint-disable import/prefer-default-export */

export const getNestedValue = (patron, key) => {
  if (patron && patron[key]) {
    return patron[key].value ? patron[key].value : patron[key];
  }
  return "";
};
