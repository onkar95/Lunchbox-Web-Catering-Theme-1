// eslint-disable-next-line react/button-has-type
import React from "react";
import classnames from "classnames";
import Styled from "styled-components";
import {selectorGenerator, styleObjectToCSSString} from "../utils";
import {useTemplateContext} from "../../providers/template";

const withTemplate = (Component) => (props) => {
  const {
    parsedTheme: {views},
  } = useTemplateContext();
  return <Component {...props} view={views[props.type] || undefined} />;
};

const View = Styled(
  ({
    Component = "div",
    type,
    children,
    className,
    view,
    innerRef,
    ...props
  }) => {
    const classes = classnames(className);
    return (
      <Component className={classes} ref={innerRef} {...props}>
        {children}
      </Component>
    );
  },
)`
  ${({view}) => {
    if (view) {
      const CSSString = Object.entries(view).reduce((accu, [key, value]) => {
        if (!Object.entries(value).length) return accu;
        const selector = selectorGenerator(key, "&");
        if (selector) {
          accu.push(styleObjectToCSSString(selector, value));
        }
        return accu;
      }, []);
      return CSSString;
    }
  }}
`;

export default React.memo(withTemplate(View));
