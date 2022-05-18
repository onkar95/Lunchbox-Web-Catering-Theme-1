const phoneRegExp = /^(\+1|1|)(-| )?\d{3}(-| )?\d{3}(-| )?\d{4}$/;
const hexColorRegExp = /^#[0-9A-F]{6}$/i;
const typeRegExp = /^Type\d*/;
const themeRegExp = /^theme\d*|^Type\d*/;
const tabRegExp = /^(pickup|delivery)$/;

export {phoneRegExp, hexColorRegExp, typeRegExp, themeRegExp, tabRegExp};

export default {
  hexColorRegExp,
  phoneRegExp,
  tabRegExp,
  themeRegExp,
  typeRegExp,
};
