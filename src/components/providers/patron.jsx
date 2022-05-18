import React, {useEffect, useState, createContext, useContext} from "react";
import {axios, config} from "utils";

const {
  methods: {get},
} = axios;

const PatronContext = createContext();
const storageKey = config.local_storage_key;

const initializeToken = () => {
  const token = window.localStorage.getItem(storageKey);
  return token;
};

const PatronStore = ({children}) => {
  const [accessToken, setAccessToken] = useState(initializeToken);
  const [patron, setPatron] = useState({});
  const [fetching, setFetching] = useState(true);

  const updatePatron = ({firstName, lastName, email, phone}) => {
    const newState = {...patron};
    if (firstName) {
      newState.firstName = firstName;
    }
    if (lastName) {
      newState.lastName = lastName;
    }
    if (email) {
      newState.email = email;
    }
    if (phone) {
      newState.phone = phone;
    }
    setPatron(newState);
  };
  const updateCard = (card) => {
    setPatron({...patron, squareCustomers: {card}});
  };

  const login = ({token, ...patronData}) => {
    if (token) {
      setAccessToken(token);
    }
    if (!patronData) {
      localStorage.removeItem(storageKey);
    } else {
      setPatron(patronData);
    }
  };

  const logout = async () => {
    setPatron({});
    setAccessToken("");
    localStorage.removeItem(storageKey);
  };

  useEffect(() => {
    const fetchPatron = async () => {
      try {
        const res = await get("/patron");
        if (res.status === 200) {
          login(res.data);
        }
      } catch (e) {
        localStorage.removeItem(storageKey);
      } finally {
        setFetching(false);
      }
    };

    fetchPatron();
  }, []);
  useEffect(() => {
    if (accessToken) {
      window.localStorage.setItem(storageKey, accessToken);
    }
  }, [accessToken]);

  const contextValues = {
    accessToken,
    fetching,
    isLoggedIn: !!patron.id,
    login,
    logout,
    patron,
    updateCard,
    updatePatron,
  };

  let renderedChildren = null;
  if (fetching) {
    renderedChildren = null;
  } else if (typeof children === "function") {
    renderedChildren = React.Children.only(children(contextValues));
  } else {
    renderedChildren = React.Children.only(children);
  }

  return (
    <PatronContext.Provider value={contextValues}>
      {renderedChildren}
    </PatronContext.Provider>
  );
};

const usePatronContext = () => {
  const contextValues = useContext(PatronContext);
  if (!contextValues) {
    throw new Error(
      "usePatronContext must be used within PatronContext Provider",
    );
  }
  return contextValues;
};

export {usePatronContext};

export default {
  PatronContext,
  PatronStore,
};
