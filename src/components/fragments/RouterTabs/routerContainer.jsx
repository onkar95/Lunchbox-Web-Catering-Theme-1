import React from "react";
import Posed from "react-pose";
import styles from "./routerContainer.module.css";

const RouterContainer = Posed(
  React.forwardRef(({children, ...props}, ref) => (
    <div ref={ref} className={styles.content} {...props}>
      {children}
    </div>
  )),
)({
  enter: {
    transition: {
      ease: [0.35, 0, 0.25, 1],
    },
    x: "0%",
  },
  exit: {
    transition: {
      ease: [0.35, 0, 0.25, 1],
    },
    x: "100%",
  },
});

export default RouterContainer;
