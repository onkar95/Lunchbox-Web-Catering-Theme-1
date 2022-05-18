import React from "react";
import {ThemeText, Cell, View, ThemeButton} from "components/elementsThemed";
import {useCell} from "hooks";
import styles from "./itemDetails.module.scss";

const StandardWeb = ({type, quantity, inc, dec}) => {
  const {views: cellViews, button, labelTextStyles} = useCell(type);
  return (
    <View type={cellViews.background} className={styles.selectors}>
      <div className={styles.wrapper}>
        <ThemeButton
          type={button}
          className={styles["quantity-btn"]}
          onClick={dec}
        >
          -
        </ThemeButton>
        <View type={cellViews.secondary} className={styles.quantity}>
          <ThemeText type={labelTextStyles.primary}>{quantity}</ThemeText>
        </View>
        <ThemeButton
          type={button}
          className={styles["quantity-btn"]}
          onClick={inc}
        >
          +
        </ThemeButton>
      </div>
    </View>
  );
};

export default StandardWeb;
