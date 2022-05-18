import {useEffect} from "react";

const useMutationObserver = (callback, {selector, ...options}) => {
  useEffect(() => {
    if (!selector) return;
    const targetNode = document.querySelector(selector);

    if (!targetNode) return;

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, options);

    return () => {
      observer.disconnect();
    };
  }, [callback, selector, options]);
};

export default useMutationObserver;
