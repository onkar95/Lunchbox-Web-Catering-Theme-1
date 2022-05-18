/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Component" }] */

import React from "react";
import {config} from "utils";
import Sticky from "./Sticky";

const Selector = ({type, version, ...props}) => {
  let Component = null;

  switch (version || (config.theme.footer && config.theme.footer.layout)) {
    case "Sticky":
      Component = Sticky;
      break;
    default:
      Component = Sticky;
      break;
  }

  return <Sticky type={type} {...props} />;
};

export default Selector;
