import React from "react";
import ClampLines from "react-clamp-lines";
import {View, ThemeText, Cell, ThemeButton} from "../..";
import styles from "./field.module.css";

const Field = ({type, label, value, buttonProps}) => (
  <Cell
    type={type}
    render={({views: cellViews, labelTextStyles, button}) => (
      <View type={cellViews.background} className={styles.field}>
        <div className={styles.label}>
          <ThemeText type={labelTextStyles.primary}>{label}</ThemeText>
        </div>
        <div className={styles.value}>
          <ThemeText type={labelTextStyles.secondary}>
            <ClampLines
              id={value}
              buttons={false}
              text={value}
              lines={1.5}
              ellipsis="..."
            />
          </ThemeText>
          {button && <ThemeButton type={button} {...buttonProps} />}
        </div>
      </View>
    )}
  />
);

export default Field;
