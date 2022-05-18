import React, {forwardRef} from "react";
import classnames from "classnames";
import styles from "./button.module.scss";

const Button = forwardRef(({type, ...props}, ref) => {
  const buttonClasses = classnames(
    styles.btn,
    props.disabled ? styles.disabled : undefined,
    props.block ? styles.block : undefined,
    props.round ? styles.round : undefined,
    props.size ? styles[`btn-${props.size}`] : undefined,
    props.className,
  );
  return (
    <button
      className={buttonClasses}
      onClick={props.onClick}
      style={props.style}
      disabled={props.disabled}
      type={type}
      ref={ref}
    >
      {props.children}
    </button>
  );
});

Button.defaultProps = {
  disabled: false,
  size: "",
  type: "button",
};

export default Button;
