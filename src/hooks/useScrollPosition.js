import {useRef, useLayoutEffect, useEffect} from "react";

const isBrowser = typeof window !== "undefined";
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * @param root0
 * @param root0.element
 * @param root0.useWindow
 */
function getScrollPosition({element, useWindow}) {
  if (!isBrowser) return {x: 0, y: 0};
  const target = element && element.current ? element.current : document.body;

  const position = target.getBoundingClientRect();
  return useWindow
    ? {x: window.scrollX, y: window.scrollY}
    : {x: position.left, y: position.top};
}

const useScrollPosition = (
  effect,
  deps,
  element,
  useWindow,
  parent = null,
  wait,
) => {
  const position = useRef(getScrollPosition({useWindow}));
  let throttleTimeout = null;

  const callBack = () => {
    const currPos = getScrollPosition({element, useWindow});
    effect({currPos, prevPos: position.current});
    position.current = currPos;
    throttleTimeout = null;
  };
  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) {
      return;
    }

    const handleScroll = () => {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = setTimeout(callBack, wait);
        }
      } else {
        callBack();
      }
    };
    const target = parent ? document.querySelector(parent) : window;
    target.addEventListener("scroll", handleScroll);
    return () => target.removeEventListener("scroll", handleScroll);
  }, deps);
};

export default useScrollPosition;
