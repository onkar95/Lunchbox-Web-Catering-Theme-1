import React, {useEffect, useState} from "react";
import RcDrawer from "rc-drawer";
import PropTypes from "prop-types";
import {Portal} from "../../elements";
import "rc-drawer/assets/index.css";
import "./rc-drawer-overrides.css";

const Drawer = ({
  children,
  placement,
  isOpen,
  trigger,
  drawerProps: {destroyOnClose, ...drawerProps},
  onChange,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(isOpen || false);
  const toggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const close = () => {
    setIsDrawerOpen(false);
  };
  useEffect(() => {
    setIsDrawerOpen(isOpen);
  }, [isOpen]);
  useEffect(() => {
    if (isDrawerOpen !== isOpen && onChange) {
      onChange(isDrawerOpen);
    }
  }, [isDrawerOpen]);

  let tiggerComponent = null;

  if (trigger) {
    tiggerComponent =
      typeof trigger === "function"
        ? React.Children.only(trigger({onClick: toggle}))
        : React.Children.only(React.cloneElement(trigger, {onClick: toggle}));
  }

  let renderedChildren = children;
  if (destroyOnClose && !isDrawerOpen) {
    renderedChildren = null;
  } else if (typeof children === "function") {
    renderedChildren = React.Children.only(children({close}));
  }

  return (
    <>
      {tiggerComponent}
      <Portal>
        <RcDrawer
          // getContainer="div"
          placement={placement}
          open={isDrawerOpen}
          onClose={close}
          onMaskClick={close}
          handler={false}
          level={null}
          onChange={setIsDrawerOpen}
          {...drawerProps}
        >
          {renderedChildren}
        </RcDrawer>
      </Portal>
    </>
  );
};

Drawer.propTypes = {
  //   className: PropTypes.string,
  isOpen: PropTypes.bool,
  placement: PropTypes.oneOf(["top", "right", "left", "right"]),
  // trigger: PropTypes.element.isRequired,
  //   maskable: PropTypes.bool,
  //   style: React.CSSProperties,
  //   maskStyle: React.CSSProperties,
};
Drawer.defaultProps = {
  //   className: '',
  isOpen: false,
  placement: "right",
  //   maskable: true,
  //   style: {},
  //   maskStyle: {},
};

export {Drawer};
export default Drawer;
