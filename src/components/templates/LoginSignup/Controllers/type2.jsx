import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";
import {Copy} from "utils";
import {
  PATRON_SOCIAL_SIGN_IN,
  PATRON_SIGN_IN,
  PATRON_VALIDATE,
  HANDLE_ERROR,
  PATRON_AUTH_PINCODE,
  UPDATE_PATRON,
  PATRON_SEND_PINCODE_BY_ACCOUNT,
  GET_FACEBOOK_USER_ID,
} from "utils/api";
import {GlobalConfig} from "components/providers";
import {usePatronContext} from "components/providers/patron";
import {ACCOUNT_TYPES, SOCIAL_PLATFORMS} from "utils/constants";
import {getNestedValue, mapSocialAuthData, AUTHSTEPS} from "./utils";

const TypeContext = createContext();
TypeContext.displayName = "Controller2Provider";

const handleError = (e) => {
  throw HANDLE_ERROR(e);
};

const stepReducer = (state, {type, payload}) => {
  switch (type) {
    case "NEXT": {
      return [...state, payload];
    }
    case "PREVIOUS": {
      return state.slice(state.length - 1);
    }
    case "REPLACE": {
      const newState = [...state];
      newState.pop();
      newState.push(payload);
      return newState;
    }
    case "RESET": {
      return [-1];
    }
    default:
      return state;
  }
};

const checkMissingData = (data) => {
  if (!data.phone || !data.phone.isVerified) {
    return {
      message: Copy.LOGIN_SIGNUP_STATIC.TYPE2_UNVERIFIED_PHONE_MESSAGE,
      step: AUTHSTEPS.UPDATE_PHONE,
    };
  }
  if (!data.email || (Object.keys(data.email).length && !data.email.value)) {
    return {
      message: Copy.LOGIN_SIGNUP_STATIC.TYPE2_NO_EMAIL_MESSAGE,
      step: AUTHSTEPS.UPDATE_EMAIL,
    };
  }
  if (data.isMigrating) {
    return {step: AUTHSTEPS.UPDATE_PASSWORD};
  }
  return null;
};

const mapAuthToken = (data, authToken) => {
  if (data?.userIdApple) {
    return data?.userIdApple;
  }
  return authToken;
};

const defaultLoginPatron = {
  account: "",
  accountType: "",
  isMigrating: null,
};

/**
 * Controller logic for login type 2. Tries to encapsulate as much as it should
 *
 * @param {object} props
 * @param {object} props.children - Render Function or React element
 * @param {Function} props.onLoginComplete - Function to run when login completes
 * @param {Function} props.onSignupComplete - Function to run when signup completes
 * @param {Function} props.onComplete - Function to run when entire process completes
 * @param {Function} props.onNextStep - callback to run when the step changes
 */
const Controller2Provider = ({
  children,
  onLoginComplete,
  onSignupComplete,
  onComplete,
  onNextStep,
}) => {
  const {
    isAppleSignUp,
    appleCredentials,
    unsetLastAppleLocation,
    isFacebookSignUp,
    facebookCredentials,
    unsetLastFacebookLocation,
  } = useContext(GlobalConfig.GlobalConfigContext);
  const {login} = usePatronContext();
  const [loginPatron, setLoginPatron] = useState(defaultLoginPatron);
  const [message, setMessage] = useState("");
  const [patron, setPatron] = useState({});
  const [steps, dispatch] = useReducer(stepReducer, []);
  const [fetchingSocial, setFetchingSocial] = useState(false);

  const reset = () => {
    dispatch({type: "RESET"});
    setMessage("");
    setLoginPatron(defaultLoginPatron);
    setPatron({});
  };

  const onLoginOrSignUpComplete = (data) => {
    if (onSignupComplete) {
      onSignupComplete();
      dispatch({payload: AUTHSTEPS.SIGN_UP_CONFIRMATION, type: "NEXT"});
    } else if (onLoginComplete) {
      onLoginComplete();
      reset();
    } else if (onComplete) {
      onComplete(data);
      reset();
    }
  };

  const valiatePatronData = (data) => {
    const isMissingData = checkMissingData(data);
    if (isMissingData) {
      dispatch({payload: isMissingData.step, type: "REPLACE"});
      setMessage(isMissingData.message);
    } else {
      login(data);
      onLoginOrSignUpComplete(data);
    }
  };

  const valiateSocialPatronData = (data) => {
    const isMissingData = checkMissingData(data);
    if (isMissingData) {
      dispatch({payload: AUTHSTEPS.SIGN_UP, type: "REPLACE"});
      setMessage(isMissingData.message);
    } else {
      login(data);
      onLoginOrSignUpComplete(data);
    }
  };

  const validatePatron = (account) =>
    PATRON_VALIDATE({account})
      .then(({data}) => {
        setLoginPatron(data);
        if (data.isMigrating) {
          dispatch({payload: AUTHSTEPS.PINCODE, type: "NEXT"});
          setMessage(
            Copy.LOGIN_SIGNUP_STATIC.TYPE2_ACCOUNT_VERIFICATION_MESSAGE,
          );
          return PATRON_SEND_PINCODE_BY_ACCOUNT(data.account);
        }
      })
      .catch(async (err) => {
        /**
         * 404 meaning there is no account, we push them to sign up
         * NOTE: We are explicitly sending the payload as an object with the
         * email which is the only information that the user entered in the field
         *
         * @todo update this with the social login buttons to add the information we
         * get back e.g. phone, name
         */
        if (err.message.includes(404)) {
          dispatch({payload: {email: account}, type: "NEXT"});
        } else {
          handleError(err);
        }
      });

  const verifyPincode = async (pincode) => {
    try {
      const {data} = await PATRON_AUTH_PINCODE({
        pinCode: pincode,
        [loginPatron.accountType]: loginPatron.account,
      });
      const isMissingData = checkMissingData(data);
      setPatron(data);
      if (isMissingData) {
        dispatch({payload: AUTHSTEPS.UPDATE_PASSWORD, type: "REPLACE"});
        setMessage(
          Copy.LOGIN_SIGNUP_STATIC.TYPE2_PASSWORD_UPDATE_NOTICE_MESSAGE,
        );
      } else {
        login(data);
        onLoginOrSignUpComplete(data);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdatePhone = () => {
    dispatch({payload: AUTHSTEPS.UPDATE_PHONE, type: "NEXT"});
  };

  const onSocialLogin = (data) => {
    const {type, authToken, authData} = mapSocialAuthData(data);
    setFetchingSocial(true);
    return PATRON_SOCIAL_SIGN_IN({
      authData,
      authToken,
      type,
    })
      .then(({data}) => {
        const mappedData = {
          authToken: mapAuthToken(data, authToken),
          email: getNestedValue(data, ACCOUNT_TYPES.EMAIL),
          firstName: data.firstName,
          lastName: data.lastName,
          phone: getNestedValue(data, ACCOUNT_TYPES.PHONE),
          type,
        };
        if (data.token) {
          setPatron(data);
          valiatePatronData(data);
        } else {
          setPatron(mappedData);
          valiateSocialPatronData(data);
        }
      })
      .catch(handleError)
      .finally(() => {
        setFetchingSocial(false);
      });
  };

  const onLogin = (password) =>
    PATRON_SIGN_IN({
      account: loginPatron.account,
      password,
    })
      .then(({data}) => {
        setPatron(data);
        valiatePatronData(data);
      })
      .catch(handleError);

  const onUpdate = (values) =>
    UPDATE_PATRON(
      values,
      patron.token ? {headers: {authorization: patron.token}} : undefined,
    )
      .then(({data}) => {
        valiatePatronData({...patron, ...data});
      })
      .catch(handleError);

  const onSignupSuccess = (data) => {
    setPatron(data);
    setLoginPatron({
      account: getNestedValue(data, ACCOUNT_TYPES.PHONE),
      accountType: ACCOUNT_TYPES.PHONE,
      isMigrating: false,
    });
    dispatch({payload: AUTHSTEPS.PINCODE, type: "NEXT"});
  };

  const onConfirmSignup = () => {
    if (onComplete) {
      onComplete(patron);
    }
  };

  const onUpdateSuccess = (data) => {
    valiatePatronData({...patron, ...data, isMigrating: false});
  };

  const onForgotPasswordSuccess = (data) => {
    valiatePatronData({token: patron.token, ...data});
  };

  useEffect(() => {
    if (isAppleSignUp) {
      onSocialLogin({
        ...appleCredentials,
        type: SOCIAL_PLATFORMS.APPLE,
      });
      unsetLastAppleLocation();
    } else if (isFacebookSignUp) {
      GET_FACEBOOK_USER_ID(facebookCredentials.accessToken).then(({userID}) => {
        onSocialLogin({
          ...facebookCredentials,
          type: SOCIAL_PLATFORMS.FACEBOOK,
          userID,
        });
      });
      unsetLastFacebookLocation();
    }
  }, [isAppleSignUp, isFacebookSignUp]);

  useEffect(() => {
    if (steps.length) {
      onNextStep(steps[steps.length - 1]);
    }
  }, [steps]);

  const contextValues = {
    account: loginPatron.account,
    accountType: loginPatron.accountType,
    afterLogin: onForgotPasswordSuccess,
    email: getNestedValue(patron, ACCOUNT_TYPES.EMAIL),
    fetchingSocial,
    isMigrating: loginPatron.isMigrating,
    message,
    onConfirmSignup,
    onForgotPasswordSuccess,
    onLogin,
    onSignupSuccess,
    onSocialLogin,
    onUpdate,
    onUpdatePhone,
    onUpdateSuccess,
    patron,
    phone: getNestedValue(patron, ACCOUNT_TYPES.PHONE),
    token: patron.token,
    validatePatron,
    verifyPincode,
  };

  return (
    <TypeContext.Provider>
      {typeof children === "function"
        ? React.Children.only(children(contextValues))
        : React.Children.only(children)}
    </TypeContext.Provider>
  );
};

const useType2Context = () => {
  const contextValues = useContext(TypeContext);
  if (!contextValues) {
    throw new Error("useType2Context is being accessed outside a Type2Context");
  }
  return contextValues;
};

export {useType2Context};

export default {
  Context: TypeContext,
  Provider: Controller2Provider,
};
