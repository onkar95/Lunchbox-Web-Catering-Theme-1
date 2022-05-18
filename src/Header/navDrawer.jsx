import React from "react";
import {Elements, ElementsThemed, Fragments} from "../components";

const {Drawer} = Fragments;

const {Logo} = Elements;
const {ThemeText} = ElementsThemed;

const NavDrawer = ({type, icon, text, children, trigger, css}) => {
  let drawerTrigger = null;
  if (trigger) {
    drawerTrigger = trigger;
  } else {
    drawerTrigger = (
      <div className={css["nav-item"]}>
        <Logo src={icon} />
        <ThemeText type={type}>{text}</ThemeText>
      </div>
    );
  }
  return (
    <Drawer.ResponsiveDrawer
      drawerProps={{
        destroyOnClose: true,
      }}
      trigger={drawerTrigger}
    >
      {children}
    </Drawer.ResponsiveDrawer>
  );
};

export default NavDrawer;
