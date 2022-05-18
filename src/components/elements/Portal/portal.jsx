/* eslint-disable react/no-find-dom-node */
import {useMemo, useEffect} from "react";
import ReactDOM from "react-dom";

const DEFAULT_NODE = document.getElementById("portals");

// Portal -- Using React Class Component
const Portal = ({container, children, className}) => {
  const el = useMemo(() => {
    const element = document.createElement("div");
    element.className = className;
    return element;
  }, [className]);

  useEffect(() => {
    container.appendChild(el);
    return () => {
      container.removeChild(el);
    };
  }, [container, el]);

  useEffect(() => {
    el.className = className || "";
  }, [className, el.className]);
  return ReactDOM.createPortal(children, el);
};

Portal.defaultProps = {
  container: DEFAULT_NODE,
};

export {Portal};
export default Portal;
