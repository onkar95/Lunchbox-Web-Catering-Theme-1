import React from "react";
import StandardWeb from "./StandardWeb";

const HeaderSelector = (props) => {
  let Component = StandardWeb;

  // add a switch here if we add more headers later
  return <Component {...props} />;
};

export default HeaderSelector;
