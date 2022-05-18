// eslint-disable-next-line react/button-has-type
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Styled from "styled-components";
import {styleObjectToString, styleObjectToCSSString} from "../../utils";
import ThemeText from "../../ThemeText";
import FieldItem from "../fieldItem";
import withTemplateInput from "../withTemplateInput";
import css from "./input.module.scss";

const inputContainerClasses = classnames(css["input-container"]);

const Input = Styled(
  ({
    input,
    label,
    name,
    className,
    icon,
    style,
    onChange,
    value,
    inputRef,
    disabled,
    error,
    htmlType,
    fieldClass,
    ...props
  }) => {
    const inputClasses = classnames(css.input, className);
    return (
      <FieldItem type={input.title} label={label} className={fieldClass}>
        <div className={inputContainerClasses}>
          <input
            {...props}
            name={name || ""}
            type={htmlType}
            className={inputClasses}
            value={value}
            style={style}
            onChange={onChange}
            placeholder={props.placeholder}
            ref={inputRef}
            disabled={disabled}
          />
          {icon && <div className={css["input-suffix"]}>{icon}</div>}
        </div>
        {error && <ThemeText type={input.error}>{error}</ThemeText>}
      </FieldItem>
    );
  },
)`
  ${({input: {field, placeholder}}) => {
    const inputStyles = [];
    if (field) {
      inputStyles.push(styleObjectToString(field));
    }
    if (placeholder) {
      inputStyles.push(
        styleObjectToCSSString("::-webkit-input-placeholder", placeholder),
      );
      inputStyles.push(
        styleObjectToCSSString("::-moz-placeholder", placeholder),
      );
      inputStyles.push(
        styleObjectToCSSString(":-ms-input-placeholder", placeholder),
      );
      inputStyles.push(styleObjectToCSSString("::placeholder", placeholder));
    }
    return inputStyles.join(" ");
  }}
`;

Input.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
};

export default withTemplateInput(Input);
