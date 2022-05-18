import {SOCIAL_PLATFORMS} from "utils/constants";

const {APPLE, GOOGLE, FACEBOOK} = SOCIAL_PLATFORMS;

export const getNestedValue = (patron, key) => {
  if (patron?.[key]) {
    if (patron[key].value !== undefined) {
      return patron[key].value;
    }
    if (!Object.keys(patron[key]).length) {
      return patron[key];
    }
  }
  return "";
};

export const mapSocialAuthData = ({type, ...data}) => {
  let authToken = "";
  let authData = {};
  switch (type) {
    case FACEBOOK:
      authToken = data.accessToken;
      authData = {...authData, userId: data.userID};
      break;
    case GOOGLE:
      authToken = data.tokenId;
      break;
    case APPLE:
      authToken = data.id_token;
      if (data.user) {
        authData = {
          userEmail: data.user.email,
          userFullname: data.user.fullName,
        };
      }
      break;
    default:
      authToken = "";
  }

  return {
    authData,
    authToken,
    type,
  };
};

export const AUTHSTEPS = {
  FORGOT_PASSWORD: "forgot-password",
  PINCODE: "pincode",
  RESET_PASSWORD: "reset-password",
  SIGN_IN: "sign-in",
  SIGN_UP: "sign-up",
  SIGN_UP_CONFIRMATION: "signup-confirmation",
  UPDATE_EMAIL: "update-email",
  UPDATE_PASSWORD: "update-password",
  UPDATE_PHONE: "update-phone",
};
