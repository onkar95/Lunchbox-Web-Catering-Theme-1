/* eslint-disable react/destructuring-assignment */
import React, {
  createContext,
  useReducer,
  useState,
  useEffect,
  useContext,
} from "react";
import isEqual from "fast-deep-equal";
import useDeepCompareEffect from "use-deep-compare-effect";
import {orderReducer, itemReducer} from "./reducers";
import {
  initializeLocation,
  initializeOrder,
  initializeItems,
  initializeMemoryLocation,
  initializeMemoryOrder,
  intitializeMemoryItems,
} from "./initializers";
import itemActions from "./actions/items";
import orderActions from "./actions/order";

const OrderContext = createContext();

const OrderStore = ({
  persist = true,
  items: initialItems = [],
  location: initialLocation,
  order: initialOrder = {},
  orderType,
  isCart = false,
  ...props
}) => {
  const [order, dispatchOrder] = useReducer(
    orderReducer,
    persist
      ? initializeOrder({isCart, ...initialOrder})
      : initializeMemoryOrder({
          isCart,
          orderType,
          ...initialOrder,
        }),
  );
  const [items, dispatchItems] = useReducer(
    itemReducer,
    persist ? initializeItems() : intitializeMemoryItems(initialItems),
  );
  const [location, setLocation] = useState(
    persist ? initializeLocation() : initializeMemoryLocation(initialLocation),
  );

  const orderDispatchers = orderActions(dispatchOrder);
  const itemsDispatchers = itemActions(dispatchItems);

  const resetOrderDetails = () => {
    itemsDispatchers.clearItems();
    orderDispatchers.setOrderDetails({
      contactName: "",
      contactPhone: "",
      discount: null,
      notes: "",
      numberOfGuests: 1,
      patronCompany: "",
      scheduledAt: null,
      taxExemptId: "",
    });
  };

  const changeLocation = (nextLocation) => {
    if (!isEqual(nextLocation, location)) {
      setLocation(nextLocation);
      itemsDispatchers.clearItems();
    }
  };

  useEffect(() => {
    if (persist) {
      localStorage.setItem("location", JSON.stringify(location));
    }
  }, [location, persist]);
  useEffect(() => {
    if (persist) {
      localStorage.setItem("items", JSON.stringify(items));
    }
  }, [items, persist]);

  useDeepCompareEffect(() => {
    if (persist) {
      localStorage.setItem(
        "order",
        JSON.stringify({...order, lat: undefined, long: undefined}),
      );
    }
  }, [order]);

  const isViewOnly = !order.scheduledAt;

  const contextValues = {
    isViewOnly,
    items,
    location,
    order,

    ...itemsDispatchers,
    ...orderDispatchers,

    changeLocation,
    resetOrderDetails,
  };

  return (
    <OrderContext.Provider value={contextValues}>
      {props.children(contextValues)}
    </OrderContext.Provider>
  );
};

const useOrderContext = () => {
  const contextValues = useContext(OrderContext);
  if (!contextValues) {
    throw new Error(
      "useOrderContext must be used within OrderContext Provider",
    );
  }
  return contextValues;
};

export {useOrderContext};

export default {
  OrderContext,
  OrderStore,
};
