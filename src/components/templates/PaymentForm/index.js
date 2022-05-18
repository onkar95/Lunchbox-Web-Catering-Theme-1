import React from "react";
import { config } from "utils";
import Square from "./Square";
import Stripe from "./Stripe";

if (!config.payment_processor) {
  throw new Error("No payment Processor");
}

const PaymentProcessorSelector = (props) => {
  let Component = null;
  switch (config.payment_processor) {
    case "square":
      Component = Square;
      break;
    case "stripe":
      Component = Stripe;
      break;
    default:
      Component = Square;
  }
  return <Component {...props} />;
};

export default PaymentProcessorSelector;
