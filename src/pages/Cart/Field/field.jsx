import React from "react";
import {ElementsThemed} from "components";
import styles from "./field.module.css";

const {View, ThemeText, Cell, ThemeButton} = ElementsThemed;
const Field = ({type, label, value, buttonProps}) => (
  <Cell
    type={type}
    render={({views: cellViews, labelTextStyles, button}) => (
      <View type={cellViews.background} className={styles.field}>
        <div className={styles.label}>
          <ThemeText type={labelTextStyles.primary}>{label}</ThemeText>
        </div>
        <div className={styles.value}>
          <ThemeText type={labelTextStyles.secondary}>{value}</ThemeText>
          {button && <ThemeButton type={button} {...buttonProps} />}
        </div>
      </View>
    )}
  />
);

export default Field;
