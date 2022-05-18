import React from "react";
import csx from "classnames";
import css from "./tooltip.module.css";

const Tooltip = ({children, message, direction}) => {
  return (
    <span className={csx(css[direction], "")} data-tooltip={message}>
      {children}
    </span>
  );
};

export default Tooltip;
