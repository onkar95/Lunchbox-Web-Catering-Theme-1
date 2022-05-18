import React from "react";
import Styled from "styled-components";
import classnames from "classnames";
import PropTypes from "prop-types";
import styles from "./input.module.css";

const Input = Styled(
  ({
    name,
    className,
    icon,
    style,
    onChange,
    containerClassName,
    value,
    inputRef,
    disabled,
    ...props
  }) => {
    const containerClasses = classnames(styles["input-container"], className);
    const inputClasses = classnames(styles.input, className);
    return (
      <div className={containerClasses}>
        <input
          {...props}
          name={name || ""}
          className={inputClasses}
          value={value}
          style={style}
          onChange={onChange}
          placeholder={props.placeholder}
          ref={inputRef}
          disabled={disabled}
        />
        {icon && <div className={styles["input-suffix"]}>{icon}</div>}
      </div>
    );
  },
)`
  && {
    color: ${(props) => props.theme.colors.baseBlack};
    font-family: ${(props) => props.theme.fonts.body1.name};
    font-size: ${(props) => `${props.theme.fonts.body1.size}px`};
    border-bottom-color: ${(props) =>
      props.error
        ? props.theme.colors.baseWarning
        : props.theme.colors.alternateGray};
  }
  &:disabled {
    color: ${(props) => props.theme.colors.alternateGray};
  }
`;

Input.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
};
Input.defaultProps = {
  name: PropTypes.string,
  onChange: PropTypes.func,
};

export {Input};
export default Input;
