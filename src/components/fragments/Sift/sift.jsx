/* eslint-disable no-underscore-dangle */
import {useEffect, useRef} from "react";
import {withRouter} from "react-router-dom";
import {useScript} from "hooks";

const Sift = ({siftBeaconKey, sessionId, userId, location}) => {
  const lastPathname = useRef(null);

  const {loaded = false, error = false} = useScript(
    "https://cdn.sift.com/s.js",
  );

  const sendPageView = () => {
    if (!window._sift) {
      return;
    }
    if (location.pathname === lastPathname.current) {
      return;
    }
    lastPathname.current = location.pathname;
    window._sift.push(["_trackPageview"]);
  };
  const sendUserId = () => {
    if (!window._sift) {
      return;
    }
    window._sift.push(["_setUserId", userId || ""]);
  };

  useEffect(() => {
    if (!loaded || error) {
      return;
    }
    if (!window._sift) {
      return;
    }

    window._sift.push(["_setAccount", siftBeaconKey]);
    window._sift.push(["_setSessionId", sessionId]);
    if (userId) {
      sendUserId();
    }
    sendPageView();
  }, [loaded, error]);

  useEffect(() => {
    sendUserId();
  }, [userId]);

  useEffect(() => {
    sendPageView();
  }, [location.pathname]);

  return null;
};

export default withRouter(Sift);
