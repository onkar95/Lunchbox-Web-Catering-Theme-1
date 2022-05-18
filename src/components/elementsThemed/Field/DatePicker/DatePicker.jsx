import React from "react";
import Styled from "styled-components";
import classnames from "classnames";
import PropTypes from "prop-types";
import {styleObjectToString, styleObjectToCSSString} from "../../utils";
import FieldItem from "../fieldItem";
import withTemplateInput from "../withTemplateInput";
import styles from "./DatePicker.module.scss";

const DatePicker = Styled(
  ({
    input,
    label,
    className,
    children,
    icon,
    style,
    onChange,
    containerClassName,
    disabled,
    placeholder,
    availableOptions,
    ...props
  }) => {
    const containerClasses = classnames(styles["select-container"], className);
    const selectClasses = classnames(styles.select, className);

    return (
      <FieldItem type={input.title} label={label}>
        <div className={containerClasses}>
          <select
            className={selectClasses}
            value={props.value}
            style={style}
            onChange={onChange}
            disabled={disabled}
          >
            <option value="" disabled selected>
              {placeholder}
            </option>
            {availableOptions.map((option) => (
              <option
                className={styles.option}
                key={option.key}
                value={option.value}
              >
                {option.content}
              </option>
            ))}
          </select>
        </div>
      </FieldItem>
    );
  },
)`
  ${({input: {field, placeholder}}) => {
    const selectStyles = [];
    if (field) {
      selectStyles.push(styleObjectToString(field));
    }
    if (placeholder) {
      selectStyles.push(
        styleObjectToCSSString("::-webkit-input-placeholder", placeholder),
      );
      selectStyles.push(
        styleObjectToCSSString("::-moz-placeholder", placeholder),
      );
      selectStyles.push(
        styleObjectToCSSString(":-ms-input-placeholder", placeholder),
      );
      selectStyles.push(styleObjectToCSSString("::placeholder", placeholder));
    }
    return selectStyles.join(" ");
  }}
`;

DatePicker.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
};
DatePicker.defaultProps = {
  onChange: null,
  options: [],
};

export {DatePicker};
export default withTemplateInput(DatePicker);
