import overrideData from "LanguageData";
import ELEMENTS_STATIC from "./elements";
import DELIVERY_FORM_STATIC from "./deliveryForm";
import FORGOT_PASSWORD_STATIC from "./forgotPassword";
import GIFT_CARD_STATIC from "./giftCards";
import ITEM_DETAILS_STATIC from "./itemDetails";
import LOCATION_LIST_STATIC from "./locationList";
import LOGIN_STATIC from "./login";
import LOGIN_SIGNUP_STATIC from "./loginSignUp";
import PASSWORD_STATIC from "./password";
import PAYMENT_FORM_STATIC from "./paymentForm";
import SIGN_UP_STATIC from "./signUp";
import UPDATE_EMAIL_STATIC from "./updateEmail";
import UPDATE_PHONE_STATIC from "./updatePhone";
import VALIDATE_LOGIN_STATIC from "./validaLogin";
import HEADER_STATIC from "./header";
import CART_STATIC from "./cart";
import CHECKOUT_STATIC from "./checkout";
import LIVE_SEARCH_STATIC from "./liveSearch";
import LOCATIONS_STATIC from "./locations";
import LOGOUT_STATIC from "./logout";
import MENU_STATIC from "./menu";
import PROFILE_STATIC from "./profile";
import RG_INFO_STATIC from "./rgInfo";
import LOCATION_FORM_STATIC from "./locationForm";
import DATE_PICK_FORM_STATIC from "./datePickForm";
import ORDER_DETAILS from "./orderDetail";

const CopyStatic = {
  CART_STATIC,
  CHECKOUT_STATIC,
  DATE_PICK_FORM_STATIC,
  DELIVERY_FORM_STATIC,
  ELEMENTS_STATIC,
  FORGOT_PASSWORD_STATIC,
  GIFT_CARD_STATIC,
  HEADER_STATIC,
  ITEM_DETAILS_STATIC,
  LIVE_SEARCH_STATIC,
  LOCATION_FORM_STATIC,
  LOCATION_LIST_STATIC,
  LOCATIONS_STATIC,
  LOGIN_SIGNUP_STATIC,
  LOGIN_STATIC,
  LOGOUT_STATIC,
  MENU_STATIC,
  ORDER_DETAILS,
  PASSWORD_STATIC,
  PAYMENT_FORM_STATIC,
  PROFILE_STATIC,
  RG_INFO_STATIC,
  SIGN_UP_STATIC,
  UPDATE_EMAIL_STATIC,
  UPDATE_PHONE_STATIC,
  VALIDATE_LOGIN_STATIC
};

export const Copy = Object.entries(CopyStatic).reduce((accu, [key, value]) => {
  if (overrideData[key]) {
    accu[key] = {
      ...value,
      ...Object.entries(overrideData[key]).reduce((accu2, [key2, value2]) => {
        if (!value2) {
          return accu2;
        }
        return {
          ...accu2,
          [key2]: value2,
        };
      }, {}),
    };
  }
  return accu;
}, CopyStatic);

export default Copy;
