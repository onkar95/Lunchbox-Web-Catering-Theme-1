import {constants} from "utils";

const {GOOGLE} = constants.SOCIAL_PLATFORMS;

const handleGoogleAuthError = (error) => {
  let msg = "";
  switch (error) {
    case "popup_closed_by_user":
      msg = "Google sign-in was canceled by Guest";
      break;
    case "access_denied":
      msg =
        "Uh-oh it appears the permissions required to sign in are denied by your Google account.";
      break;
    case "immediate_failed":
    case "idpiframe_initialization_failed":
    default:
      msg =
        "We were unable to fulfill the request at this time. We're sorry about the inconvenience.";
  }
  return msg;
};

export const handleAuthError = (error, provider) => {
  let msg = "An Unknown error occured";
  switch (provider) {
    case GOOGLE:
      msg = handleGoogleAuthError(error);
      break;
    default:
  }
  return msg;
};
