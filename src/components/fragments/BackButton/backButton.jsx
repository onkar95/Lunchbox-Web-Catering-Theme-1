import React from "react";
import classnames from "classnames";
import {Image} from "../Image";
import styles from "./backButton.module.css";

const BackButton = ({onClick, color = 0, className}) => {
  const classes = classnames(styles.back, className);
  return (
    <div>
      <Image.Image
        mediaName={`button_back${color ? `_${color}` : ""}`}
        mediaType="svg"
        role="button"
        className={classes}
        onClick={onClick}
      />
    </div>
  );
};

export {BackButton};
export default BackButton;
