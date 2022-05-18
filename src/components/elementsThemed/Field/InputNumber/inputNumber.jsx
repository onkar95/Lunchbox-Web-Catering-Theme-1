// eslint-disable-next-line react/button-has-type
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Styled from "styled-components";
import {styleObjectToString, styleObjectToCSSString} from "../../utils";
import Text from "../../ThemeText";
import FieldItem from "../fieldItem";
import withTemplateInput from "../withTemplateInput";
import css from "./input.module.css";

const parser = (i) => i.replace(/[^\w.-]+/g, "");

const getValue = (e) => {
  const value = e.target.value.trim().replace(/。/g, ".");

  return value;
};

const inputContainerClasses = classnames(css["input-container"], css.numeric);

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
    formatter,
    ...props
  }) => {
    const handleChange = (e) => {
      const val = parser(getValue(e));
      onChange(val);
    };

    const onBlur = (e) => {
      const val = parser(getValue(e));
      props.onBlur && props.onBlur(val);
    };

    const inputClasses = classnames(css.input, className);
    return (
      <FieldItem type={input.title} label={label} className={fieldClass}>
        <div className={inputContainerClasses}>
          <input
            {...props}
            name={name || ""}
            type="number"
            className={inputClasses}
            value={value}
            style={style}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={props.placeholder}
            ref={inputRef}
            disabled={disabled}
          />
          {icon && <div className={css["input-suffix"]}>{icon}</div>}
        </div>
        {error && <Text type={input.error}>{error}</Text>}
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
  formatter: PropTypes.func,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

Input.defaultProps = {
  formatter: (i) => i,
};

export default withTemplateInput(Input);
