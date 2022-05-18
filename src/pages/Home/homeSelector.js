import React from "react";
import { config } from "utils";
import Type3 from "./Type3";

const Selector = (props) => {
  let Component = null;

  switch (config.components.home_template) {
    case "Type3":
      Component = Type3;
      break;
    default:
      Component = Type3;
  }

  return <Component {...props} />;
};

export default Selector;
