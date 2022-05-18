import {useState, useEffect} from "react";
import _debounce from "lodash/debounce";

/**
 *
 */
function getSize() {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
  };
}

const useWindowResize = ({debounce = 0}) => {
  const [windowSize, setSize] = useState(getSize);

  const getWindowSize = () => {
    setSize(getSize());
  };

  const listener = debounce
    ? _debounce(getWindowSize, debounce)
    : getWindowSize;

  useEffect(() => {
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  return windowSize;
};

export default useWindowResize;
