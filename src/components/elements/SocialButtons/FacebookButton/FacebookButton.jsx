import React, {useRef, useEffect} from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import {useLocalStorage} from "hooks";
import csx from "classnames";
import {ReactComponent as Icon} from "./facebook_signin_button.svg";
import css from "../common.module.scss";

/**
 * Setting it to redirect to be consistent with Facebook sign in
 *
 * @param root0
 * @param root0.socialLogin
 * @param root0.lastLocation
 * @param root0.appId
 * @property {object} props
 * @property {Function} props.lastLocation set the browser location this component was rendered under
 * @property {Function} props.socialLogin takes the response from facebook and uses the token
 */
const FacebookButton = ({socialLogin, lastLocation = "/", appId}) => {
  const date = useRef(+new Date());
  const [, setLastLocation] = useLocalStorage("lastFacebookLocation");

  useEffect(() => {
    setLastLocation({
      date: date.current,
      source: lastLocation,
    });
  }, []);

  return (
    <FacebookLogin
      appId={appId}
      fields="name,email"
      redirectUri={window.location.origin}
      state={`${date.current}`}
      callback={(data) => {
        socialLogin(data, "facebook");
      }}
      responseType="token"
      render={({onClick}) => {
        return (
          <button
            data-test="facebookid-signin"
            type="button"
            className={css.btn}
            onClick={onClick}
          >
            <div
              className={csx(css["btn-content"], "facebook-signin")}
              id="facebookid-signin"
            >
              <Icon />
            </div>
          </button>
        );
      }}
    />
  );
};

export default FacebookButton;
