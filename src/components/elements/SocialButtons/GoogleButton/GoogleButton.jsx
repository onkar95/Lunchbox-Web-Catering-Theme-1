import React, {useCallback, useState} from "react";
import csx from "classnames";
import {GoogleLogin} from "react-google-login";
import {ReactComponent as Icon} from "./google_signin_button.svg";
import css from "../common.module.scss";

const isFatalAuthError = (error) => {
  let returnValue = false;
  switch (error) {
    case "immediate_failed":
    case "idpiframe_initialization_failed":
    default:
      returnValue = true;
  }
  return returnValue;
};

/**
 * Setting it to redirect to be consistent with Google sign in
 *
 * @param root0
 * @param root0.socialLogin
 * @param root0.clientId
 * @property {object} props
 * @property {Function} props.clientId Client Id provided found in the google project
 * @property {Function} props.socialLogin takes the response from Google and uses the token
 */
const GoogleButton = ({socialLogin, clientId}) => {
  const [isFatalError, setFatalError] = useState(null);
  const handleResponse = useCallback(
    (data) => {
      socialLogin(data, "google");
    },
    [socialLogin],
  );

  const handleError = (err) => {
    if (isFatalAuthError(err.error)) {
      setFatalError(true);
    }
  };

  if (isFatalError) {
    return null;
  }

  return (
    <GoogleLogin
      clientId={clientId}
      redirectUri={encodeURIComponent(window.location.origin)}
      uxMode="popup"
      onSuccess={handleResponse}
      onFailure={handleError}
      render={({onClick}) => (
        <button
          type="button"
          className={csx(css.btn, css.google)}
          onClick={onClick}
          data-test="google-login"
        >
          <div className={csx(css["btn-content"], "google-signin")}>
            <Icon />
          </div>
        </button>
      )}
    />
  );
};

export default GoogleButton;
