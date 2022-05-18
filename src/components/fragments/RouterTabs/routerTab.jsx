import React from "react";
import {Route} from "react-router-dom";

const RouterTab = (props) => {
  const {name, render, children} = props;
  const routeProps = {
    path: `/${name}`,
  };
  if (typeof render === "function") {
    routeProps.render = (routerProps) => render(routerProps);
  } else if (children && React.Children.toArray(children).length === 1) {
    routeProps.component = children;
  }
  return <Route {...routeProps} />;
};

export default RouterTab;
