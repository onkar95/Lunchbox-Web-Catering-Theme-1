import React from "react";
import {config} from "utils";
import loadable from "@loadable/component";
import withCartItem from "./withCartItem";

const AsyncPage = loadable((props) =>
  import(`components/templates/OrderItem/${props.page}`),
);

const CartItemSelector = (props) => {
  return (
    <AsyncPage
      page={config?.theme?.checkout?.cart_item || "Type1"}
      {...props}
    />
  );
};

export default withCartItem(CartItemSelector);
