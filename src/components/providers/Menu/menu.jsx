/* eslint-disable react/destructuring-assignment */
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  Children,
} from "react";
import {axios} from "utils";
import {menuReducer} from "./reducers";

const Context = createContext();

const INIT_MENU = {
  groups: {
    array: [],
    object: {},
  },
  items: {
    array: [],
    object: {},
  },
  menus: {
    array: [],
    object: {},
  },
  options: {
    array: [],
    object: {},
  },
};

const MenuStore = ({children, location, orderType}) => {
  const [fetching, setFetching] = useState(!!location);

  const [menus, dispatch] = useReducer(menuReducer, INIT_MENU);

  const fetchMenu = useCallback(async () => {
    try {
      const {data} = await axios.methods.get(
        "/menus",
        {menuType: "catering", orderType},
        {headers: {locationId: location.id}},
      );
      dispatch({
        payload: data,
        type: "ADD",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setFetching(false);
      }, 250);
    }
  }, [location.id, orderType]);

  useEffect(() => {
    if (location) {
      setFetching(true);
      fetchMenu(location);
    }
  }, [fetchMenu, location]);

  const contextValues = {
    fetching,
    groups: menus.groups.array,
    groupsHash: menus.groups.hash,
    items: menus.items.array,
    itemsHash: menus.items.hash,

    location,
    menus: menus.menus.array,
    menusHash: menus.menus.hash,
    options: menus.options.array,
    optionsHash: menus.options.hash,
  };

  return (
    <Context.Provider value={contextValues}>
      {typeof children === "function"
        ? Children.only(children(contextValues))
        : Children.only(children)}
    </Context.Provider>
  );
};

const useMenuContext = () => {
  const contextValues = useContext(Context);
  if (!contextValues) {
    throw new Error("useMenuContext must be used within MenuContext Provider");
  }
  return contextValues;
};

export {useMenuContext};

export default {
  MenuStore,
};
