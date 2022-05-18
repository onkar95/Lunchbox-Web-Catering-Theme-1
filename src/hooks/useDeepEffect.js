import {useEffect, useRef} from "react";
import isEqual from "fast-deep-equal";
import {usePrevious} from "hooks";

const useDeepEffect = (callback, inputs) => {
  const previousInputs = usePrevious(inputs);
  const inputsAreEqual = isEqual(inputs, previousInputs);
  const cleanupRef = useRef();
  useEffect(() => {
    if (!inputsAreEqual) {
      cleanupRef.current = callback();
    }
    return cleanupRef.current;
  }, [callback, inputsAreEqual]);
};

export default useDeepEffect;
