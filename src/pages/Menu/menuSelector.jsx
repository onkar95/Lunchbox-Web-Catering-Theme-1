import React from "react";
import PropTypes from "prop-types";
import {config} from "utils";
import Type1 from "./Type1";
import Type2 from "./Type2";

const Selector = ({...props}) => {
  let Component = null;

  switch (config.theme.menu.layout) {
    case "Type2":
      Component = Type2;
      break;
    default:
      Component = Type1;
  }

  return <Component {...props} />;
};

export default Selector;
