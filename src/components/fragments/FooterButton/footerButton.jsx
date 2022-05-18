import React from "react";
import {View, Cell, ThemeButton} from "../../elementsThemed";
import styles from "./footerButton.module.scss";

const FooterButton = ({onClick, children, type, ...props}) => (
  <Cell
    type={type}
    render={({view, button}) => (
      <View type={view} className={styles.footerButton}>
        <ThemeButton
          block
          type={button}
          className={styles.button}
          {...props}
          onClick={onClick}
        >
          {children}
        </ThemeButton>
      </View>
    )}
  />
);

export {FooterButton};
export default FooterButton;
