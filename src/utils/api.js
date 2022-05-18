import Axios from "axios";
import {axios} from "utils";

const {post, get, put, destroy} = axios.methods;

export const HANDLE_ERROR = (e) => axios.handleError(e);

// PATRON
export const FETCH_PATRON = () => get("/patron");
export const FETCH_LOYALTY = () => get("/loyalty");
export const REDEEM_PROMO = (data, config) => post("/promotions", data, config);
export const VALIDATE_PROMO = (data, config) =>
  post("/promotions/validate", data, config);
export const UPDATE_PATRON = (data, config) => put("/patron", data, config);

export const PATRON_SOCIAL_SIGN_IN = (data, config) =>
  post("/patron/sign-in/social", data, config);
export const PATRON_SIGN_IN = (data, config) =>
  post("/patron/sign-in", data, config);
export const PATRON_SIGN_UP = (data, config) =>
  post("/patron/sign-up", data, config);
export const PATRON_VALIDATE = (data, config) =>
  post("/patron/validate", data, config);
export const PATRON_FORGOT_PASSWORD = (data, config) =>
  post("/patron/forgot-password", data, config);
export const PATRON_ADD_CARD = (data, config) => post("/cards", data, config);
export const PATRON_UPDATE_CARD = (id, data, config) =>
  put(`/cards/${id}`, data, config);
export const PATRON_DELETE_CARD = (id, data, config) =>
  destroy(`/cards/${id}`, data, config);

export const FETCH_PATRON_ADDRESS = (data, config) =>
  post("/patron/address", data, config);

export const FETCH_LOCATIONS = (data, config) =>
  post("/locations", data, config);
export const SET_SCHEDULE_DATE = ({date, data, config}) =>
  get(`locations/schedule-dates/${date}`, data, config);
export const FETCH_ADDRESS = (data, config) => get("/address", data, config);
export const FETCH_PLACES = (placeId) => get(`/places/${placeId}`);

export const FETCH_MENU = (data, config) => get("/menus", data, config);
export const FETCH_UPSELLS_MENU = (data, config) =>
  get("/upsells", data, config);
export const PATRON_SEND_PINCODE_BY_ACCOUNT = (account, config) =>
  post("/pincode", {account}, config);
export const PATRON_SEND_PINCODE = (data, config) =>
  post("/pincode/send", data, config);
export const PATRON_AUTH_PINCODE = (data, config) =>
  post("/pincode/auth", data, config);
export const PATRON_VERIFY_PINCODE = (data, config) =>
  post("/pincode/verify", data, config);
export const VALIDATE_TABLE_NUMBER = (data, config) =>
  post(`/tables/validate`, data, config);
export const VALIDATE_DISCOUNT = (data, config) =>
  post("/discount/validate", data, config);
export const VALIDATE_GIFTCARD = (code, token) =>
  post(`/stored-value-cards/${code}`, token);

export const GET_CREDENTIALS = (data, config) =>
  get("/location/credentials", data, config);
export const CREATE_PAYMENT_INTENT = (data, config) =>
  post("/order/create-payment-intent", data, config);

export const CHECK_PRICE = (data, config) =>
  post("/order/check-price", data, config);

export const GET_TRACKING_INFO = (orderId, config) =>
  get(`/order/${orderId}/tracking`, config);

export const GET_ORDER_INFO = (orderId, config) =>
  get(`/orders/${orderId}`, config);

export const GET_FACEBOOK_USER_ID = (token) => {
  return Axios({
    params: {
      access_token: token,
      fields: "name,email",
      locale: "en_US",
      method: "get",
      pretty: 0,
      sdk: "joey",
      suppress_http_code: 1,
    },
    url: "https://graph.facebook.com/v2.3/me",
  }).then(({data}) => {
    return {
      userID: data.id,
    };
  });
};

export default {
  CHECK_PRICE,
  FETCH_ADDRESS,
  FETCH_LOCATIONS,
  FETCH_LOYALTY,
  FETCH_MENU,
  FETCH_PATRON,
  FETCH_PATRON_ADDRESS,
  FETCH_PLACES,
  FETCH_UPSELLS_MENU,
  GET_FACEBOOK_USER_ID,
  PATRON_ADD_CARD,
  PATRON_AUTH_PINCODE,
  PATRON_DELETE_CARD,
  PATRON_FORGOT_PASSWORD,
  PATRON_SEND_PINCODE,
  PATRON_SEND_PINCODE_BY_ACCOUNT,
  PATRON_SIGN_IN,
  PATRON_SIGN_UP,
  PATRON_SOCIAL_SIGN_IN,
  PATRON_UPDATE_CARD,
  PATRON_VALIDATE,
  PATRON_VERIFY_PINCODE,
  REDEEM_PROMO,
  SET_SCHEDULE_DATE,
  VALIDATE_DISCOUNT,
  VALIDATE_PROMO,
  VALIDATE_TABLE_NUMBER,
};
