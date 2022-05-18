import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";
import {usePatronContext} from "components/providers/patron";

import {Copy} from "utils";
import {getNestedValue, AUTHSTEPS} from "./utils";

const TypeContext = createContext();
TypeContext.displayName = "Controller1Provider";

const stepReducer = (state, {type, payload}) => {
  switch (type) {
    case "NEXT": {
      return [...state, payload];
    }
    case "PREVIOUS": {
      return state.slice(state.length - 1);
    }
    default:
      return state;
  }
};

const Controller1Provider = ({children, onComplete, onNextStep}) => {
  const {login} = usePatronContext();
  const [patron, setPatron] = useState({});
  const [message, setMessage] = useState({});
  const [steps, dispatch] = useReducer(stepReducer, []);

  const onSignupSuccess = (data) => {
    setPatron(data);
    dispatch({
      payload: AUTHSTEPS.UPDATE_PHONE,
      type: "NEXT",
    });
    setMessage(Copy.LOGIN_SIGNUP_STATIC.TYPE1_SIGNUP_VERIFY_PHONE_MESSAGE);
  };

  const onUpdatePhoneSuccess = (data) => {
    if (onComplete) {
      onComplete(data);
    }
    login({...patron, ...data});
  };

  const onForgotPasswordSuccess = (data) => {
    if (data.phone && data.phone.isVerified) {
      if (onComplete) {
        onComplete(data);
      }
      login(data);
    } else {
      setPatron(data);
      dispatch({
        payload: AUTHSTEPS.UPDATE_PHONE,
        type: "NEXT",
      });
      setMessage(
        Copy.LOGIN_SIGNUP_STATIC.TYPE1_FORGOT_PASSWORD_VERIFY_PHONE_MESSAGE,
      );
    }
  };

  useEffect(() => {
    if (steps.length) {
      onNextStep(steps[steps.length - 1]);
    }
  }, [steps]);

  const contextValues = {
    afterLogin: onForgotPasswordSuccess,
    email: getNestedValue(patron, "email"),
    patron,
    message,
    onForgotPasswordSuccess,
    onSignupSuccess,
    onUpdatePhoneSuccess,
    phone: getNestedValue(patron, "phone"),
    token: patron.token,
  };

  return (
    <TypeContext.Provider>
      {typeof children === "function"
        ? React.Children.only(children(contextValues))
        : React.Children.only(children)}
    </TypeContext.Provider>
  );
};

const useType1Context = () => {
  const contextValues = useContext(TypeContext);
  if (!contextValues) {
    throw new Error("useType1Context is being accessed outside a Type1Context");
  }
  return contextValues;
};

export {useType1Context};
export default {
  Context: TypeContext,
  Provider: Controller1Provider,
};
