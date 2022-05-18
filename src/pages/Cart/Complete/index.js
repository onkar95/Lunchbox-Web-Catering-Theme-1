import React, {useEffect} from "react";
import {config, Copy} from "utils";
import Type1 from "./Type1";
import Type2 from "./Type2";
import Type3 from "./Type3";
import Type4 from "./Type4";

const Types = {
  Type1,
  Type2,
  Type3,
  Type4,
};

const Selector = ({setHeader, ticketInformation, ...props}) => {
  const Component = Types[config.theme.checkout.confirmation] || Type1;
  const scheduleTime = new Date(ticketInformation.scheduledAt)
    .toLocaleString("en-US", {
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      month: "long",
      weekday: "long",
      year: "numeric",
    })
    .split(",")
    .join(" ");

  useEffect(() => {
    setHeader && setHeader(Copy.CART_STATIC.CHECKOUT_HEADER_TEXT);
  }, [setHeader]);

  return (
    <>
      <div className="purchase-confirmation" />
      <Component
        {...props}
        ticketInformation={ticketInformation}
        scheduleTime={scheduleTime}
      />
    </>
  );
};

export default Selector;
