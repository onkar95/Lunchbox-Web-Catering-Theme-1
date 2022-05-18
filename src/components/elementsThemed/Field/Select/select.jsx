import React from "react";
import Styled from "styled-components";
import classnames from "classnames";
import PropTypes from "prop-types";
import {styleObjectToString, styleObjectToCSSString} from "../../utils";
import FieldItem from "../fieldItem";
import withTemplateInput from "../withTemplateInput";
import styles from "./select.module.css";

const Select = Styled(
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
            {children}
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

Select.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
};
Select.defaultProps = {
  onChange: null,
  options: [],
};

export {Select};
export default withTemplateInput(Select);
