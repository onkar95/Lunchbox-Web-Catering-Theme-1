import React from "react";
import {ElementsThemed} from "components";
import {useCell} from "hooks";
import styles from "./index.module.css";

const {ThemeText} = ElementsThemed;

const LocationInfo = React.memo(({type}) => {
  const {labelTextStyles} = useCell(type);
  return (
    <div className={styles["location-info-card"]}>
      <ThemeText type={labelTextStyles.primary}>CATERING</ThemeText>
    </div>
  );
});

export default LocationInfo;
