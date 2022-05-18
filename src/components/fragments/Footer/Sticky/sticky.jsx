import React from "react";
import csx from "classnames";
import {useTemplateContext} from "components/providers/template";
import {View} from "components/elementsThemed";
import {useCell} from "hooks";

import {ReactComponent as PoweredByLunchbox} from "assets/poweredByLunchbox.svg";
import styles from "./sticky.module.css";

const Sticky = ({type, style, className = ""}) => {
  const {views, labelTextStyles} = useCell(type);
  const {
    parsedTheme: {labels},
  } = useTemplateContext();
  return (
    <View
      type={views.background}
      className={csx(styles.footer, className)}
      style={style}
    >
      <a href="https://lunchbox.io" className={styles["footer-link"]}>
        <PoweredByLunchbox
          title="Powered by Lunchbox"
          fill={labels[labelTextStyles.primary].color}
        />
      </a>
    </View>
  );
};

export default Sticky;
