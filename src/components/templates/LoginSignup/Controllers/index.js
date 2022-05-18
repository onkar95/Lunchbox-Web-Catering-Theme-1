import React from "react";
import {config} from "utils";
import Type1 from "./type1";
import Type2 from "./type2";

export default (props) => {
  let Type = null;
  switch (config?.login_signup?.version) {
    case "Type1":
      Type = Type1;
      break;
    case "Type2":
      Type = Type2;
      break;
    default:
      Type = Type1;
  }
  return <Type.Provider {...props} />;
};
