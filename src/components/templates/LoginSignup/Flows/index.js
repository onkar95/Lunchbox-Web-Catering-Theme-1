import React from "react";
import {config} from "utils";
import Type1 from "./Type1";
import Type2 from "./Type2";

export default (props) => {
  let Component = null;
  switch (config?.login_signup?.version) {
    case "Type1":
      Component = Type1;
      break;
    case "Type2":
      Component = Type2;
      break;
    default:
      Component = Type1;
  }
  return <Component {...props} />;
};
