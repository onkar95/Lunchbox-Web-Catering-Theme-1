import {formatAddress, mapGoogleAddressComponents} from "./geo";
import {
  disableScroll,
  enableScroll,
  onWheelElementHandler,
  scrollWithOffset,
} from "./scroll";

import {isJSON} from "./json";

import {
  determineBreakPoint,
  transformRequestError,
  orderModsAsObject,
  uuidv4,
  debounce,
  getPropValue,
  toObjectByKey,
} from "./other";

import {roundFloat} from "./math";

import {
  matchesRegex,
  parseStringFloat,
  stringReplacer,
  formatPhoneNumber,
  formatPrice,
  formatCalories,
} from "./string";

import {
  formatHour,
  toCivilianTime,
  toDayOfWeek,
  combineHours,
  sortAndSplitHours,
  formatTime,
  stdTimezoneOffset,
  mapTimeZone,
  displayScheduledAtTime,
  displayScheduledAtTimeDelivery,
} from "./time";

import {phoneRegExp} from "./regexps";

import ErrorFocus from "./errorFocus";

export {
  ErrorFocus,
  formatAddress,
  mapGoogleAddressComponents,
  isJSON,
  determineBreakPoint,
  transformRequestError,
  orderModsAsObject,
  uuidv4,
  debounce,
  getPropValue,
  roundFloat,
  matchesRegex,
  parseStringFloat,
  stringReplacer,
  formatPhoneNumber,
  formatPrice,
  formatCalories,
  formatHour,
  toCivilianTime,
  toDayOfWeek,
  combineHours,
  sortAndSplitHours,
  formatTime,
  stdTimezoneOffset,
  mapTimeZone,
  displayScheduledAtTime,
  displayScheduledAtTimeDelivery,
  phoneRegExp,
  toObjectByKey,
  enableScroll,
  disableScroll,
  onWheelElementHandler,
  scrollWithOffset,
};

export default {
  combineHours,
  debounce,
  determineBreakPoint,
  disableScroll,
  displayScheduledAtTime,
  displayScheduledAtTimeDelivery,
  enableScroll,
  ErrorFocus,
  formatAddress,
  formatCalories,
  formatHour,
  formatPhoneNumber,
  formatPrice,
  formatTime,
  getPropValue,
  isJSON,
  mapGoogleAddressComponents,
  mapTimeZone,
  matchesRegex,
  onWheelElementHandler,
  orderModsAsObject,
  parseStringFloat,
  phoneRegExp,
  roundFloat,
  scrollWithOffset,
  sortAndSplitHours,
  stdTimezoneOffset,
  stringReplacer,
  toCivilianTime,
  toDayOfWeek,
  toObjectByKey,
  transformRequestError,
  uuidv4,
};
