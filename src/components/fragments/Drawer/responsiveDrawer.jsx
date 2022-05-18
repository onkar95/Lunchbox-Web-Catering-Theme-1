import React, {useEffect, useState} from "react";
import {helpers} from "utils";
import {useWindowSize} from "hooks";
import Drawer from "./drawer";

const newWidth = (breakPoint) => {
  switch (breakPoint) {
    case "sm":
      return "80vw";
    case "md":
      return "50vw";
    case "lg":
    case "xl":
    case "xxl":
      return "40vw";
    default:
      return "100vw";
  }
};

const ResponsiveDrawer = ({children, trigger, drawerProps, ...props}) => {
  const {width} = useWindowSize({debounce: 200});
  const [drawerWidth, setWidth] = useState();
  const {name: breakPoint} = helpers.determineBreakPoint(width);

  useEffect(() => {
    setWidth(newWidth(breakPoint));
  }, [breakPoint, width]);

  return (
    <Drawer
      {...props}
      drawerProps={{
        width: drawerWidth,
        ...drawerProps,
      }}
      trigger={typeof trigger === "function" ? trigger({breakPoint}) : trigger}
    >
      {children}
    </Drawer>
  );
};

export default ResponsiveDrawer;
