import React, {useRef, useContext, createContext} from "react";

const ItemDetailsContext = createContext();

const ItemDetailsStore = ({children}) => {
  const refs = useRef({});

  const setRef = (id, node) => {
    refs[id] = node;
  };

  const contextValues = {
    refs,
    setRef,
  };

  return (
    <ItemDetailsContext.Provider value={contextValues}>
      {typeof children === "function"
        ? React.Children.only(children(contextValues))
        : React.Children.only(children)}
    </ItemDetailsContext.Provider>
  );
};

const useItemDetailContext = () => {
  const contextValues = useContext(ItemDetailsContext);
  if (!contextValues) {
    throw new Error(
      "useOrderContext must be used within OrderContext Provider",
    );
  }
  return contextValues;
};

export {ItemDetailsStore, useItemDetailContext};
export default {
  ItemDetailsStore,
};
