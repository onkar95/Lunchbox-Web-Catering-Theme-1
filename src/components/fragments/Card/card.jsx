import React from "react";
import Styled from "styled-components";
import classnames from "classnames";
import styles from "./card.module.css";

const Card = Styled(({className, children, style, ...props}) => {
  const classes = classnames(
    styles.card,
    props.shadow ? styles.shadow : undefined,
    props.onClick ? styles.clickable : undefined,
    className,
  );
  return (
    <div
      className={classes}
      ref={props.innerRef}
      style={style}
      onClick={props.onClick}
    >
      {children}
    </div>
  );
})`
  ${(props) =>
    props.hoverable &&
    props.shadow &&
    `
    &:hover {
      box-shadow: 0 1px 7px 2px ${props.theme.colors.accentLight};
    }
  `}
`;

const CardBody = Styled(({className, bordered, ...props}) => {
  const classes = classnames(
    styles["card-body"],
    bordered ? styles.bordered : undefined,
    className,
  );
  return (
    <div className={classes} style={props.style}>
      {props.children}
    </div>
  );
})`
  border-bottom-color: ${(props) => props.theme.colors.alternateGray};
`;

const CardTitle = ({className, children}) => {
  const classes = classnames(styles["card-title"], className);
  return <div className={classes}>{children}</div>;
};

Card.defaultProps = {
  shadow: true,
};

CardBody.defaultProps = {
  bordered: true,
};

export {Card, CardBody, CardTitle};
export default {
  Card,
  CardBody,
  CardTitle,
};
