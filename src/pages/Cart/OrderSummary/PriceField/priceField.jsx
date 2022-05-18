import React from "react";
import {Condition as If} from "components/elements";
import {ThemeText} from "components/elementsThemed";
import styles from "./priceField.module.css";

const parseStringFloat = (number, showSign = true) =>
  `${number < 0 ? "-" : ""}${showSign ? "$" : ""}${parseFloat(
    Math.abs(number),
  ).toFixed(2)}`;

const PriceField = ({name, value, neg, type, info}) => (
  <div className={styles["price-field"]}>
    <span>
      <ThemeText type={type}>{name}</ThemeText>
      <If is={info}>
        <If.True>
          &nbsp;
          {info}
        </If.True>
      </If>
    </span>
    <ThemeText type={type}>
      {neg ? `-${parseStringFloat(value)}` : parseStringFloat(value)}
    </ThemeText>
  </div>
);

export default PriceField;
