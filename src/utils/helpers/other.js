import {handleError} from "../axios";

const determineBreakPoint = (width) => {
  const breakPoints = [
    {name: "sm", width: 48},
    {name: "md", width: 60},
    {name: "lg", width: 72},
    {name: "xl", width: 84},
    {name: "xxl", width: 96},
  ];
  const widthAsEm = width / 16;
  return breakPoints.reduce((accu, i) => (widthAsEm < i.width ? accu : i), {
    name: "xs",
    width: 0,
  });
};

const transformRequestError = (error) => {
  const e = handleError(error);
  if (e.type === "response") {
    if (e.status === 401) {
      e.message = "You must be logged in to place an order.";
    } else if (e.status === 400) {
      e.message = e.data;
    } else if (e.status === 500) {
      e.message = e.data;
    }
  }
  return e;
};

const orderModsAsObject = (mods) =>
  mods.reduce((accu, i) => ({...accu, [i.option]: i.items}), {});

const uuidv4 = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// The debounce function receives our function as a parameter
const debounce = (fn) => {
  let frame;
  return (...params) => {
    if (frame) {
      cancelAnimationFrame(frame);
    }
    frame = requestAnimationFrame(() => {
      fn(...params);
    });
  };
};

// use for obsecure destructuring where we don't know if ht nested object key will be the same
const getPropValue = (obj, key) =>
  key.split(".").reduce((o, x) => (o === undefined ? o : o[x]), obj);

const toObjectByKey = (array, key) =>
  array.reduce((accu, i) => {
    accu[i[key]] = i;
    return accu;
  }, {});

export {
  determineBreakPoint,
  transformRequestError,
  orderModsAsObject,
  uuidv4,
  debounce,
  getPropValue,
  toObjectByKey,
};

export default {
  debounce,
  determineBreakPoint,
  getPropValue,
  orderModsAsObject,
  toObjectByKey,
  transformRequestError,
  uuidv4,
};
