import React from "react";
import classnames from "classnames";
import styles from "./fieldItem.module.scss";
import ThemeText from "../ThemeText";

const FieldItem = ({type, label, className, children, inline}) => {
  const classes = classnames(styles.field, inline && styles.inline, className);
  return (
    <div className={classes}>
      {label && (
        <label>
          <ThemeText type={type}>{label}</ThemeText>
        </label>
      )}
      {children}
    </div>
  );
};

FieldItem.defaultProps = {
  inline: false,
};
export default FieldItem;
