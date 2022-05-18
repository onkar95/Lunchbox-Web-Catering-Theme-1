import {Routes} from "utils";
import {AUTHSTEPS} from "../Controllers/utils";

export const mapInitialTab = (value) => {
  switch (value) {
    case "sign-up":
      return "/sign-up";
    case "login":
    default:
      return "/";
  }
};

export const selectRoute = (step) => {
  switch (step) {
    case AUTHSTEPS.SIGN_IN:
      return Routes.PASSWORD;
    case AUTHSTEPS.SIGN_UP:
      return Routes.SIGN_UP;
    case AUTHSTEPS.UPDATE_PHONE:
      return Routes.UPDATE_PHONE;
    case AUTHSTEPS.UPDATE_PASSWORD:
      return Routes.UPDATE_PASSWORD;
    case AUTHSTEPS.PINCODE:
      return Routes.PINCODE;
    case AUTHSTEPS.FORGOT_PASSWORD:
      return Routes.FORGOT_PASSWORD;
    case AUTHSTEPS.UPDATE_EMAIL:
      return Routes.UPDATE_EMAIL;
    case AUTHSTEPS.SIGN_UP_CONFIRMATION:
      return Routes.SIGN_UP_CONFIRMATION;
    default:
      return Routes.ROOT;
  }
};
