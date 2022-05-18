import React, {useContext, useState, createContext, Children} from "react";
import {useLocalStorage} from "hooks";
import {parseHash, parseURL} from "./utils";

const Context = createContext();
const Provider = ({children}) => {
  const [lastAppleLocation, setLastAppleLocation] = useLocalStorage(
    "lastAppleLocation",
  );
  const [lastFacebookLocation, setLastFacebookLocation] = useLocalStorage(
    "lastFacebookLocation",
  );

  const [urlState] = useState(() => {
    const {href} = window.location;
    const urlComponents = parseURL(href);
    return {
      ...urlComponents,
      appleCredentials: parseHash(urlComponents.hash),
      facebookCredentials: parseHash(urlComponents.hash),
    };
  });

  const unsetLastAppleLocation = () => {
    setLastAppleLocation(undefined);
  };
  const unsetLastFacebookLocation = () => {
    setLastFacebookLocation(undefined);
  };

  const isAppleSignUp =
    urlState?.appleCredentials?.query?.state && lastAppleLocation?.date;
  const isFacebookSignUp =
    urlState?.facebookCredentials?.query?.state && lastFacebookLocation?.date;

  const appleCredentials = isAppleSignUp
    ? {
        code: urlState?.appleCredentials?.query?.code,
        id_token: urlState?.appleCredentials?.query?.id_token,
      }
    : null;
  const facebookCredentials = isFacebookSignUp
    ? {
        accessToken: urlState?.facebookCredentials?.query?.access_token,
      }
    : null;

  let lastLocation = null;
  if (isAppleSignUp || lastAppleLocation?.source) {
    lastLocation = lastAppleLocation.source;
  } else if (isFacebookSignUp || lastFacebookLocation?.source) {
    lastLocation = lastFacebookLocation.source;
  }

  const contextValues = {
    appleCredentials,
    facebookCredentials,
    isAppleSignUp,
    isFacebookSignUp,
    lastLocation,
    unsetLastAppleLocation,
    unsetLastFacebookLocation,
    urlState,
  };

  return (
    <Context.Provider value={contextValues}>
      {typeof children === "function"
        ? Children.only(children(contextValues))
        : Children.only(children)}
    </Context.Provider>
  );
};

const useGlobalConfig = () => {
  const contextValues = useContext(Context);
  if (!contextValues) {
    throw new Error("Context is being accessed outside a Provider");
  }
  return contextValues;
};

export {useGlobalConfig};
export default {
  GlobalConfigContext: Context,
  Provider,
};
