import React from "react";
import {Route} from "react-router-dom";
import {motion} from "framer-motion";
import {ConditionalWrapper} from "components/elements";

const RouteWithProps = ({
  key,
  path,
  exact,
  render,
  animation,
  component: Component,
  ...props
}) => {
  const routerprops = {
    exact,
    key,
    path,
  };

  routerprops.render =
    render ||
    (routerprops.render = (routeProps) => (
      <ConditionalWrapper
        condition={animation}
        wrapper={(children) => (
          <motion.div {...animation}>{children}</motion.div>
        )}
      >
        <Component key={routeProps.location.key} {...routeProps} {...props} />
      </ConditionalWrapper>
    ));

  return <Route {...routerprops} />;
};

export default RouteWithProps;
