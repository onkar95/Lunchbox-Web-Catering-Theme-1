import React from "react";
import {ItemDetailsStore} from "./itemDetailsContext";
import ItemDetailsGroup from "./Layout/itemDetailsGroup";
import ItemDetails from "./Layout/itemDetails";

const ItemDetailsSelector = ({group, isGroup, ...props}) => {
  return (
    <ItemDetailsStore>
      {isGroup ? <ItemDetailsGroup {...props} /> : <ItemDetails {...props} />}
    </ItemDetailsStore>
  );
};

export default ItemDetailsSelector;
