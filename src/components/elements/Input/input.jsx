/* eslint-disable no-unused-vars, */
import React from "react";
import classnames from "classnames";
import Styled from "styled-components";

const Input = Styled(
  ({className, name, value, styles, onChange, onFocus, onBlur, ...props}) => {
    const classes = classnames(className);

    return (
      <input
        className={classes}
        style={{
          borderRadius: "3px",
          borderStyle: "solid",
          borderWidth: "2px",
          boxSizing: "border-box",
          height: "100%",
          padding: "0px 15px",
          width: "90%",
        }}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
    );
  },
)`
   borderColor: ${(props) => props.theme.colors.baseBlack};
  font-family: ${(props) => props.theme.fonts.title2.name};
  font-size: ${(props) => `${props.theme.fonts.title2.size}px`};
`;

export default Input;
