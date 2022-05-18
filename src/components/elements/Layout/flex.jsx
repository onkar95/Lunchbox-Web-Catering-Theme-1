import React from "react";
import classnames from "classnames";
import styles from "./flex.module.css";

const directionClass = (direction, reverse) => {
  switch (direction) {
    case "row":
      return reverse ? styles["row-rev"] : styles.row;
    case "col":
      return reverse ? styles["col-rev"] : styles.col;
    default:
  }
};
const alignClass = (align) => {
  switch (align) {
    case "start":
      return styles.start;
    case "end":
      return styles.end;
    case "center":
      return styles.center;
    case "baseline":
      return styles.baseline;
    default:
  }
};
const justifyClass = (justify) => {
  switch (justify) {
    case "center":
      return styles["j-center"];
    case "start":
      return styles["j-start"];
    case "end":
      return styles["j-end"];
    case "left":
      return styles["j-left"];
    case "right":
      return styles["j-right"];
    case "between":
      return styles["j-between"];
    default:
  }
};

const Flex = ({
  component: Component = "div",
  direction,
  reverse,
  justify,
  align,
  grow,
  scroll,
  className,
  style = {},
  ...props
}) => {
  const classes = classnames(
    styles.base,
    directionClass(direction, reverse),
    alignClass(align),
    justifyClass(justify),
    className,
  );
  const inlineStyles = {
    ...(grow !== undefined ? {flexGrow: grow} : {}),
    ...style,
  };

  return <Component className={classes} {...props} style={inlineStyles} />;
};

Flex.defaultProps = {
  direction: "col",
  reverse: false,
};

export default Flex;
