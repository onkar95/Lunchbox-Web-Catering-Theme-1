import React from "react";
import classnames from "classnames";
import styles from "./radioButton.module.css";

const RadioGroup = ({className, type, children}) => {
  const classes = classnames(styles["radio-group"], className);
  return (
    <div className={classes}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {type});
      })}
    </div>
  );
};

export default RadioGroup;
