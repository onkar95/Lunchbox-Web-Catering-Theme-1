import templateHooks from "./useTemplate";
import useActive from "./useActive";
import useDeepEffect from "./useDeepEffect";
import useDidUpdateEffect from "./useDidUpdateEffect";
import useExternalResource from "./useExternalResource";
import useLocalStorage from "./useLocalStorage";
import useMutationObserver from "./useMutationObserver";
import useOnClickOutside from "./useOnClickOutside";
import usePixelTracker from "./usePixelTracker";
import usePrevious from "./usePrevious";
import useResource from "./useResource";
import useScript from "./useScript";
import useScrollPosition from "./useScrollPosition";
import useWindowSize from "./useWindowSize";

export * from "./useTemplate";
export {
  useActive,
  useDeepEffect,
  useDidUpdateEffect,
  useExternalResource,
  useLocalStorage,
  useMutationObserver,
  useOnClickOutside,
  usePixelTracker,
  usePrevious,
  useResource,
  useScript,
  useScrollPosition,
  useWindowSize,
};
export default {
  useActive,
  useDeepEffect,
  useDidUpdateEffect,
  useExternalResource,
  useLocalStorage,
  useMutationObserver,
  useOnClickOutside,
  usePixelTracker,
  usePrevious,
  useResource,
  useScript,
  useScrollPosition,
  useWindowSize,
  ...templateHooks,
};
