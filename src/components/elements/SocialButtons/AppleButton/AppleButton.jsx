import React, {useEffect} from "react";
import csx from "classnames";
import {ReactComponent as Icon} from "./AppleIcon.svg";
import css from "../common.module.scss";

const appleIDSignInOnFailure = (error) => {
  // handle error.
  console.error(error);
};

/**
 * Setting it to redirect to be consistent with Apple sign in
 *
 * @param root0
 * @param root0.socialLogin
 * @param root0.clientId
 * @memberof Elements.Elements/AppleButton
 * @property {object} props
 * @property {string} props.lastLocation where the login/signup is being called from
 * @property {string} props.clientId A[ple Client id
 * @property {Function} props.socialLogin takes the response from Apple and uses the token
 */
const AppleButton = ({socialLogin, clientId}) => {
  useEffect(() => {
    const {AppleID} = window;

    if (!AppleID) return;

    AppleID.auth.init({
      clientId,
      redirectURI: window.location.origin,
      scope: "name email",
      usePopup: true,
    });
    // data coming from apple
    const appleIDSignInOnSuccessHandler = (data) => {
      const results = {
        code: data.detail.authorization.code,
        id_token: data.detail.authorization.id_token,
      };

      if (data?.user?.email) {
        results.user = {
          email: data?.user?.email,
          fullName: `${data?.user?.name?.firstName} ${data?.user?.name?.lastName}`,
        };
      }

      socialLogin(results, "apple");
    };

    document.addEventListener(
      "AppleIDSignInOnSuccess",
      appleIDSignInOnSuccessHandler,
    );
    document.addEventListener("AppleIDSignInOnFailure", appleIDSignInOnFailure);

    return () => {
      document.removeEventListener(
        "AppleIDSignInOnSuccess",
        appleIDSignInOnSuccessHandler,
      );
      document.removeEventListener(
        "AppleIDSignInOnFailure",
        appleIDSignInOnFailure,
      );
    };
  }, []);
  // new web page to be opened in a new window must be initiated with an user action
  const appleSignIn = async (event) => {
    event.preventDefault();
    try {
      await window?.AppleID.auth.signIn();
    } catch (error) {
      appleIDSignInOnFailure(error);
    }
  };

  return (
    <div style={{position: "relative"}}>
      <button type="button" className={csx(css.btn, css.apple)}>
        <div className={css["btn-content"]}>
          <Icon />
          Sign in with Apple
        </div>
      </button>
      <button
        data-test="appleid-signin"
        id="appleid-signin"
        className={csx(css.pseudoApple, "apple-signin")}
        type="button"
        onClick={appleSignIn}
      />
    </div>
  );
};

export default AppleButton;
