import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Elements, ElementsThemed, Fragments, HOCs } from "components";
import { usePatronContext } from "components/providers/patron";
import { useOrderContext } from "components/providers/Order/order";
import { helpers, config, Copy } from "utils";
import Pages from "../pages";
import NavDrawer from "./navDrawer";
import NavIcon from "./NavIcon";
import css from "./header.module.scss";

const { matchesRegex } = helpers;
const { Logo, Condition: If } = Elements;
const { ThemeText, View, ThemeButton } = ElementsThemed;
const { BackButton, Dropdown, Drawer } = Fragments;
const { withTemplate } = HOCs;

const { phone, email, info } = config.lang;
const { url } = config.website;

const regexpsCart = [
  new RegExp("^/$"),
  new RegExp("^/checkout"),
  new RegExp("^/profile"),
];

const showCartIcon = (location, orderContext) => {
  if (location.pathname === "/") {
    return false;
  }
  if (orderContext.isViewOnly) {
    return false;
  }
  return true;
};

const DropdownItem = ({ text, type, onClick, icon, ...props }) => {
  let clickProp = { onClick };
  if (props.Component === "a") {
    clickProp = { href: props.href, target: props.target || null };
  }
  return (
    <ThemeButton
      Component={props.Component}
      className={css.dropdown}
      type={type}
      {...clickProp}
    >
      <span>{text}</span>
      {icon && (
        <span className={css["dropdown-icon"]}>
          {icon && <Logo src={icon} />}
        </span>
      )}
    </ThemeButton>
  );
};

const Header = ({ style, history, location }) => {
  const [isLogoutDrawerOpen, setIsLogoutDrawerOpen] = useState(false);
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  const orderContext = useOrderContext();
  const patronContext = usePatronContext();
  const toggleLogoutDrawer = () => setIsLogoutDrawerOpen(!isLogoutDrawerOpen);
  const toggleLoginDrawer = () => setIsLoginDrawerOpen(!isLoginDrawerOpen);

  const cartCount = orderContext.items.length;
  const cartIcon = orderContext.items.length
    ? config?.images?.icon_cart
    : config?.images?.icon_empty_cart;

  const showCart = showCartIcon(location, orderContext);

  const { views, labels, buttons } = style;

  const historyAction = () =>
    matchesRegex(regexpsCart, location.pathname)
      ? history.goBack()
      : history.push("/");

  let backButtonCopy = Copy.HEADER_STATIC.EDIT_ORDER_TEXT;

  if (matchesRegex(regexpsCart, location.pathname)) {
    backButtonCopy = Copy.HEADER_STATIC.GO_BACK_TO_MENU_TEXT;
  } else if (orderContext.isViewOnly) {
    backButtonCopy = Copy.HEADER_STATIC.START_A_NEW_ORDER_TEXT;
  }

  return (
    <View type={views.background} component="header" className={css.header}>
      <div className={css.section}>
        <div className={css["nav-left"]}>
          <div className={css.logo}>
            <a href={url}>
              <Logo src={config?.images?.art_catering_logo} />
            </a>
          </div>
          <If is={location.pathname !== "/"}>
            <div className={css["location-nav"]}>
              <BackButton
                color="white"
                className={css["back-button"]}
                onClick={historyAction}
              />
              <div className={css["location-info"]}>
                <span>
                  <ThemeText type={labels.tertiary} onClick={historyAction}>
                    {backButtonCopy}
                  </ThemeText>
                </span>
              </div>
            </div>
          </If>
        </div>
      </div>

      <div className={`${css.section} ${css["nav-right"]}`}>
        <div className={css["nav-links-container"]}>
          <Dropdown
            trigger={(
              <NavIcon
                type={labels.primary}
                icon={config?.images?.icon_contact}
              >
                CONTACT
              </NavIcon>
            )}
          >
            <If is={info}>
              <DropdownItem
                text="Info"
                type={buttons.dropdown}
                Component="a"
                target="_blank"
                href={info}
              />
            </If>
            <If is={email}>
              <DropdownItem
                text="Email Us"
                icon={config?.images?.icon_contact_1}
                type={buttons.dropdown}
                Component="a"
                target="_blank"
                href={`mailto:${email}`}
              />
            </If>
            <If is={phone}>
              <DropdownItem
                text="Call Us"
                icon={config?.images?.icon_contact_2}
                type={buttons.dropdown}
                Component="a"
                target="_blank"
                href={`tel:${phone}`}
              />
            </If>
          </Dropdown>
          <If is={!patronContext.isLoggedIn}>
            <NavIcon
              type={labels.primary}
              icon={config?.images?.icon_login}
              onClick={toggleLoginDrawer}
            >
              LOGIN
            </NavIcon>
          </If>
          <If is={patronContext.isLoggedIn}>
            <Dropdown
              trigger={(
                <NavIcon
                  type={labels?.primary}
                  icon={config?.images?.icon_login}
                >
                  ACCOUNT
                </NavIcon>
              )}
            >
              <DropdownItem
                text="Profile"
                type={buttons.dropdown}
                icon={config?.images?.icon_profile}
                onClick={() => history.push("/profile")}
              />
              <DropdownItem
                text="Logout"
                type={buttons.dropdown}
                icon={config?.images?.icon_logout}
                onClick={toggleLogoutDrawer}
              />
            </Dropdown>
          </If>

          <Drawer.ResponsiveDrawer
            isOpen={isLoginDrawerOpen}
            onChange={setIsLoginDrawerOpen}
          >
            <Pages.Login onComplete={() => setIsLoginDrawerOpen(false)} />
          </Drawer.ResponsiveDrawer>

          <Drawer.ResponsiveDrawer
            isOpen={isLogoutDrawerOpen}
            onChange={setIsLogoutDrawerOpen}
          >
            <Pages.Logout
              onConfirm={() => {
                setIsLogoutDrawerOpen(false);
                patronContext.logout();
              }}
              onCancel={() => setIsLogoutDrawerOpen(false)}
            />
          </Drawer.ResponsiveDrawer>

          <If is={!matchesRegex(regexpsCart, location.pathname)}>
            <NavDrawer
              type={labels.primary}
              trigger={(args) =>
                showCart ? (
                  <NavIcon
                    type={labels.primary}
                    icon={cartIcon}
                    onClick={args.onClick}
                  >
                    CART
                    {!!cartCount && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          marginLeft: "0.25rem",
                          verticalAlign: "middle",
                        }}
                      >
                        (
                        {cartCount < 10 ? cartCount : "10+"}
                        )
                      </span>
                    )}
                  </NavIcon>
                ) : null}
              text="CART"
              icon={cartIcon}
              css={css}
            >
              {({ close }) => (
                <Pages.Cart.Home
                  onClose={close}
                  onComplete={() => {
                    close();
                    history.replace("/");
                  }}
                  order={orderContext}
                  isLoggedIn={patronContext.isLoggedIn}
                  isEmployee={patronContext.patron.isEmployee}
                />
              )}
            </NavDrawer>
          </If>
        </div>
      </div>
    </View>
  );
};

export default withRouter(withTemplate(Header, "main"));
