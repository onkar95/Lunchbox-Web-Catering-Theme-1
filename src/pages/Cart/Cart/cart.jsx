import React, {useEffect, useState} from "react";
import {Elements, HOCs, Fragments, ElementsThemed} from "components";
import {useOrderContext} from "components/providers/Order/order";
import {useResource} from "hooks";
import {config, Copy} from "utils";
import {OrderItem as orderItemComponent} from "@lunchboxinc/lunchbox-components-v2/dist/templateComponents";
import {mapOrderValidation} from "../helpers";
import styles from "./cart.module.scss";
import OrderSummary from "../OrderSummary";
import withCartItem from "./withCartItem";
import commonStyles from "../index.module.css";

const OrderItem = withCartItem(orderItemComponent);
const {Condition} = Elements;
const {ThemeText, ThemeButton, View} = ElementsThemed;
const {
  FooterButton,
  Image: {Image},
  Loader,
} = Fragments;
const {withTemplate} = HOCs;

const isValid = ({
  mods,
  group,
  item,
  invalidModifiers = [],
  invalidGroups = [],
  invalidItems = [],
}) => {
  return !(
    invalidModifiers.some((x) => mods.includes(x)) ||
    invalidGroups.includes(group) ||
    invalidItems.includes(item)
  );
};

const Cart = ({
  style: {buttons, cells, labels, views},
  isLoggedIn,
  history,
  order,
  editable,
  clearable = true,
}) => {
  const [message, setMessage] = useState("");
  const [invalidDiscount, setInvalidDiscount] = useState(false);
  const orderContext = useOrderContext();
  const {fetching, resource, error} = useResource(
    {
      data: mapOrderValidation(order),
      headers: {
        locationId: order.location.id,
      },
      method: "post",
      path: "/order/validate",
    },
    true,
  );

  const {items} = order;

  const [toDiscount, clearDiscount, toDetails, toLogin, toDelete] = [
    "/discount",
    "/discount-clear",
    "/order-details",
    "/login",
    "/delete",
  ].map((i) => () => history.push(i));

  const onClick = () => (isLoggedIn ? toDetails() : toLogin());

  useEffect(() => {
    if (fetching) {
      return;
    }
    if (resource.amount) {
      orderContext.setOrderDetails({
        subtotal: resource.amount,
      });
    }
  }, [fetching]);

  useEffect(() => {
    if (fetching) {
      return;
    }
    if (resource.discount && resource.discount.status !== "valid") {
      setInvalidDiscount(true);
    }
    if (resource.reason) {
      if (
        [
          "pickup-closed",
          "delivery-closed",
          "pickup-unavailable",
          "delivery-unavailable",
          "invalid-scheduledAt",
          "items",
          "delivery-radius",
          "unavailable",
          "order-minimum",
        ].includes(resource.reason)
      ) {
        setMessage(resource.message);
      } else if (resource.isValid !== undefined && !resource.isValid) {
        setMessage(resource.message);
      }
    } else if (error.data) {
      setMessage(Copy.CART_STATIC.CART_ERROR_MESSAGE);
    } else {
      setMessage("");
    }
  }, [fetching]);

  if (fetching) {
    return (
      <View type={views.background} className={commonStyles.container}>
        <div className={commonStyles.loader}>
          <Loader />
        </div>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View
        type={views.background}
        className={`${commonStyles.container} ${styles["cart-empty"]}`}
      >
        <div>
          <ThemeText type={labels.emptyCart}>Your cart is empty</ThemeText>
        </div>
        <Image src={config?.images?.art_empty_cart} alt="Empty Cart" />
      </View>
    );
  }

  return (
    <View type={views.background} className={commonStyles.container}>
      <div className={styles.content}>
        {config?.images?.art_cart_logo && (
          <Image
            className={styles["cart-catering-logo"]}
            src={config?.images?.art_cart_logo}
            alt="Art Cart Logo"
          />
        )}
        <ThemeText
          type={labels.secondary}
          className={styles["cart-header-text"]}
        >
          {Copy.CART_STATIC.CART_HEADER_TEXT}
        </ThemeText>
        <div>
          <Condition is={clearable}>
            <ThemeButton
              type={buttons.clear}
              style={{float: "right"}}
              onClick={toDelete}
            >
              Clear Cart
            </ThemeButton>
          </Condition>
          <ul className={styles.list}>
            {items.map((i, index) => (
              <OrderItem
                key={`${i.item}${index}`}
                type={cells.primary}
                item={i.item}
                group={i.group}
                mods={i.mods}
                price={i.price}
                name={i.name}
                notes={i.notes}
                editable={editable}
                isGroup={i.isGroup}
                edit={() =>
                  history.push({
                    pathname: `/item/${i.item}/${index}`,
                    state: {isGroup: i.isGroup || false},
                  })
                }
                remove={() => history.push(`/delete/${index}`)}
                isValid={isValid({
                  group: i.group,
                  invalidGroups: resource.invalidGroups,
                  invalidItems: resource.invalidItems,
                  invalidModifiers: resource.invalidModifiers,
                  item: i.item,
                  mods: i.mods,
                })}
              />
            ))}
          </ul>
        </div>
        {config?.images?.art_catering_cart_bottom && (
          <Image
            className={styles["cart-catering-logo-bottom"]}
            src={config?.images?.art_catering_cart_bottom}
            alt="Bottom Cart Art"
          />
        )}
      </div>

      <Condition is={!fetching && !message}>
        <div className={styles.footer}>
          <OrderSummary
            order={order}
            clearDiscount={clearDiscount}
            toDiscount={toDiscount}
            onError={setMessage}
            invalidDiscount={invalidDiscount}
          />
        </div>
      </Condition>
      <Condition is={message}>
        <div style={{padding: "10px", textAlign: "center"}}>
          <ThemeText type={labels.error}>{message}</ThemeText>
        </div>
      </Condition>

      <FooterButton type={cells.bottom} onClick={onClick} disabled={message}>
        {isLoggedIn
          ? Copy.CART_STATIC.LOGGED_IN_USER_MESSAGE
          : Copy.CART_STATIC.NOT_LOGGED_IN_USER_MESSAGE}
      </FooterButton>
    </View>
  );
};
export default withTemplate(Cart, "cart");
