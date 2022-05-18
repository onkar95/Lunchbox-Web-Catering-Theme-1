import React from "react";
import Styled from "styled-components";
import styles from "./toggle.module.css";

const Toggle = Styled(({value, onChange, className}) => (
  <label className={`${styles.switch} ${className}`}>
    <input
      type="checkbox"
      checked={value}
      onChange={() => {
        onChange(!value);
      }}
    />
    <span className={`${styles.slider} ${styles.round}`} />
  </label>
))`
  .${styles.slider}:before {
    background-color: ${(props) => props.theme.colors.secondaryDark};
  }
`;

export default Toggle;
