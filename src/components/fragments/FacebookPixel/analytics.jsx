/* eslint-disable no-unused-vars, */
import React from "react";
import {withRouter} from "react-router-dom";

const Analytics = ({id, onlyPathname, basename, location}) => {
  const lastPathname = React.useRef(location.pathname);

  const sendPageView = () => {
    // Do nothing if GA was not initialized due to a missing tracking ID.
    if (!window.fbq) {
      return;
    }

    // Do nothing if trackPathnameOnly is enabled and the pathname didn't change.
    if (onlyPathname && location.pathname === lastPathname.current) {
      return;
    }

    lastPathname.current = location.pathname;

    // Sets the page value on the tracker. If a basename is provided, then it is prepended to the pathname.
    const page = basename
      ? `${basename}${location.pathname}`
      : location.pathname;
    window.fbq("track", "PageView");
  };

  React.useEffect(() => {
    if (!id) {
      console.error("[Facebook Pixel] Tracking ID is required.");
      return;
    }

    // Initialize facebook pixel
    window.fbq("init", id);
  }, []);

  React.useEffect(() => {
    if (!window.fbq) {
      return;
    }
    sendPageView();
  }, [location.pathname]);

  return <div />;
};

export default withRouter(Analytics);
