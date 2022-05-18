import React from "react";
import classnames from "classnames";
import {Image} from "../../elements/Image";
import styles from "./backButton.module.css";

const defaultBackButton =
  "https://assets.lunchbox.io/shared/images/button_back.svg";

const BackButton = ({imgSrc, type, onClick, className, alt}) => {
  const classes = classnames(styles.back, className, "back-button");

  return type && type === "symbol" ? (
    <svg
      role="button"
      tabIndex="-1"
      className={classes}
      onClick={onClick}
      onKeyDown={onClick}
      stroke="#333"
      datatest="back-button"
    >
      <use xlinkHref="#back" />
    </svg>
  ) : (
    <div className={styles["back-container"]} datatest="back-button">
      <Image
        src={imgSrc ?? defaultBackButton}
        role="button"
        className={classes}
        onClick={onClick}
        alt={alt ?? "return to previous page"}
      />
    </div>
  );
};

export {BackButton};
export default BackButton;
