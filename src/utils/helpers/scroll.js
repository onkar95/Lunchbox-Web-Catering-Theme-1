/**
 * @param e
 */
function preventDefault(e) {
  e.preventDefault();
}

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get() {
        supportsPassive = true;
      },
    }),
  );
} catch (e) {
  console.error(e);
}

const wheelOpt = supportsPassive ? {passive: false} : false;
const wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

// call this to Disable
/**
 *
 */
function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
}

// call this to Enable
/**
 *
 */
function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
}

/**
 * horizontal scrolling using onWheel event for provided DOM element
 * @param e - event
 * @param scrollingElement - DOM element, or ref.current
 */
function onWheelElementHandler(e, scrollingElement) {
  const container = scrollingElement;
  const containerScrollPosition = scrollingElement.scrollLeft;
  let delta = e.deltaY;
  if (navigator.userAgent.indexOf("Firefox") !== -1) {
    delta *= 100;
  } else {
    delta *= 2;
  }
  container.scrollTo({
    behavior: "smooth",
    left: containerScrollPosition + delta,
    top: 0,
  });
}

const scrollWithOffset = (el, offset) => {
  const elementPosition = el.offsetTop - offset;
  window.scroll({
    behavior: "smooth",
    left: 0,
    top: elementPosition,
  });
};

export {disableScroll, enableScroll, onWheelElementHandler, scrollWithOffset};
