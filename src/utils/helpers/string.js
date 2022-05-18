const matchesRegex = (regexpArray, stringToTest) =>
  regexpArray.some((i) => i.test(stringToTest));

const parseStringFloat = (number, showSign = true) =>
  `${number < 0 ? "-" : ""}${showSign ? "$" : ""}${parseFloat(
    Math.abs(number),
  ).toFixed(2)}`;

const stringReplacer = (str, arr) => {
  let newStr = str;
  arr.forEach((targetString) => {
    newStr = newStr.replace(
      targetString.replaceTarget,
      targetString.replaceValue,
    );
  });

  return newStr;
};

const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = `${phoneNumberString}`.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
};

const formatPrice = (price, showSign = true) => {
  if (!price) return "";
  return Array.isArray(price)
    ? `${parseStringFloat(price[0], showSign)} - ${parseStringFloat(
        price[1],
        showSign,
      )}`
    : parseStringFloat(price, showSign);
};

const formatCalories = (calories) => {
  const min = calories?.[0];
  const max = calories?.[1];
  if (!Array.isArray(calories)) {
    return calories;
  }
  if (!min || !max) {
    return null;
  }
  if (min !== max) {
    return min < max ? `${min} - ${max}` : `${max} - ${min}`;
  }
  return `${min}`;
};
const parseAndReplaceDigitInString = (i) => i.replace(/\d/g, "");
const getValue = (e) => e.target.value.trim().replace(/。/g, ".");
export {
  matchesRegex,
  parseStringFloat,
  stringReplacer,
  formatPhoneNumber,
  formatPrice,
  formatCalories,
  parseAndReplaceDigitInString,
  getValue
};

export default {
  formatCalories,
  formatPhoneNumber,
  formatPrice,
  matchesRegex,
  parseStringFloat,
  stringReplacer,
  parseAndReplaceDigitInString,
  getValue
};
