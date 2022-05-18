// eslint-disable-next-line react/button-has-type
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Styled from "styled-components";
import {styleObjectToString, styleObjectToCSSString} from "../../utils";
import ThemeText from "../../ThemeText";
import FieldItem from "../fieldItem";
import withTemplateInput from "../withTemplateInput";
import styles from "./textarea.module.css";

const Textarea = Styled(
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
    resizable,
    ...props
  }) => {
    const classes = classnames(
      styles.textarea,
      !resizable && styles["resize-none"],
      className,
    );
    return (
      <FieldItem type={input.title} label={label}>
        <div className={styles["textarea-container"]}>
          <textarea
            {...props}
            name={name || ""}
            type={htmlType}
            className={classes}
            value={value}
            style={style}
            onChange={onChange}
            placeholder={props.placeholder}
            ref={inputRef}
            disabled={disabled}
          />
          {icon && <div className={styles["textarea-suffix"]}>{icon}</div>}
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
        styleObjectToCSSString(
          "textarea::-webkit-input-placeholder",
          placeholder,
        ),
      );
      inputStyles.push(
        styleObjectToCSSString("textarea::-moz-placeholder", placeholder),
      );
      inputStyles.push(
        styleObjectToCSSString("textarea:-ms-input-placeholder", placeholder),
      );
      inputStyles.push(
        styleObjectToCSSString("textarea::placeholder", placeholder),
      );
    }
    return inputStyles.join(" ");
  }}
`;

Textarea.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  resizable: PropTypes.bool,
};
Textarea.defaultProps = {
  resizable: true,
};

export default React.memo(withTemplateInput(Textarea));
