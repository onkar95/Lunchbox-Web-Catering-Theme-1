import {Schemas, config} from "utils";

const initOrderType = config.default_tab || "pickup";
const {localStorage} = window;

const INIT_ORDER = (values = {}) => ({
  address: "",
  contactName: "",
  contactPhone: "",
  deliveryInfo: {
    city: "",
    lat: "",
    long: "",
    state: "",
    street1: "",
    street2: "",
    zip: "",
  },
  discount: null,
  isCart: false,
  isCatering: true,
  needsEatingUtensils: true,
  needsServingUtensils: false,
  note: "",
  numberOfGuests: 1,
  orderType: initOrderType,
  patronCompany: "",
  recentAddresses: [],
  scheduledAt: null,
  taxExemptId: "",
  ...values,
});

const initializeLocation = () => {
  const location = JSON.parse(localStorage.getItem("location"));

  if (location && location.address) {
    const {street1, street2, city, state, zip} = location.address;
    try {
      Schemas.AddressSchema.validateSync({
        city,
        state,
        street1,
        street2,
        zip,
      });
      return location;
    } catch (e) {
      console.error(e);
      return {...location, address: {}};
    }
  }
  return {};
};

const initializeOrder = (initialValues) => {
  const order = JSON.parse(localStorage.getItem("order"));
  return {
    ...INIT_ORDER(initialValues),
    ...order,
    discount: null,
  };
};
const initializeItems = () => {
  const items = JSON.parse(localStorage.getItem("items"));
  return items || [];
};

const initializeMemoryLocation = (initialLocation) => {
  return initialLocation || {};
};

const initializeMemoryOrder = (initialValues) => {
  return {
    ...INIT_ORDER(initialValues),
  };
};
const intitializeMemoryItems = (initialValues) => {
  return initialValues || [];
};

export {
  INIT_ORDER,
  initializeLocation,
  initializeOrder,
  initializeItems,
  initializeMemoryLocation,
  initializeMemoryOrder,
  intitializeMemoryItems,
};
export default {
  INIT_ORDER,
  initializeItems,
  initializeLocation,
  initializeMemoryLocation,

  initializeMemoryOrder,
  initializeOrder,
  intitializeMemoryItems,
};
