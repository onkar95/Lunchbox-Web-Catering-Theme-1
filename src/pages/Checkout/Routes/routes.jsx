import React, {useState} from "react";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import {Elements, Fragments, Templates, HOCs} from "components";
import {helpers, Copy, Routes} from "utils";
import styles from "./index.module.css";
import {
  Confirm,
  Discount,
  Checkout,
  Complete,
  ScheduleDate,
  ClearDiscount,
  OrderDetails,
  Cart,
} from "../../Cart";

const {orderModsAsObject, matchesRegex} = helpers;

const {Condition} = Elements;

const {
  BackButton,
  Routes: {RouteWithProps},
} = Fragments;
const {ItemDetails, LoginSignup, PaymentForm} = Templates;
const {withTemplate} = HOCs;

const onConfirm = (orderContext, index, history) => () => {
  if (index !== undefined) {
    orderContext.removeFromOrder(parseInt(index, 10));
  } else {
    orderContext.clearItems();
  }
  history.replace(Routes.ROOT);
};

const regexps = [
  new RegExp("^/$"),
  new RegExp("^/complete$"),
  new RegExp("^/item/([0-9a-f]{24})/[0-9]*$"),
];

const CheckoutRoutes = ({style, order: orderContext, cart, ...props}) => {
  const [ticketInformation, setTicketInformation] = useState({});
  const [discountId] = useState(null);

  const onClose = () => props.close();
  const onClickBack = (memory) => () =>
    memory.location.pathname !== "/" ? memory.history.goBack() : onClose();
  return (
    <MemoryRouter initialEntries={["/"]} initialIndex={0}>
      <Route
        render={({location, history}) => (
          <>
            <div className={styles.nav}>
              <Condition is={!matchesRegex(regexps, location.pathname)}>
                <BackButton onClick={onClickBack({history, location})} />
              </Condition>
            </div>
            <div className={styles.content}>
              <Switch location={location}>
                <Route
                  path={Routes.FETCH_ITEM_DETAIL}
                  render={({
                    match: {
                      params: {index},
                    },
                  }) => {
                    const orderItem = orderContext.items[index];
                    const mods = orderModsAsObject(orderItem.mods);

                    const itemDetailProps = {
                      ...orderItem,
                      buttonText:
                        Copy.CHECKOUT_STATIC.ITEM_ACCEPT_DETAILS_BUTTON_TEXT,
                      close: () => history.goBack(),
                      id: orderItem.item,
                      isCartItem: true,
                      mods,
                      onConfirm: (data) =>
                        orderContext.editItemAtIndex(data, index),
                      showClose: true,
                      showQuantity: false,
                    };
                    return <ItemDetails {...itemDetailProps} />;
                  }}
                />
                <RouteWithProps
                  path={Routes.CHECK_OUT}
                  component={Checkout}
                  order={orderContext}
                  cart={cart}
                  discountId={discountId}
                  onSuccess={(order) => {
                    setTicketInformation(order);
                    history.replace(Routes.PURCHASE_COMPLETE);
                  }}
                />
                <RouteWithProps
                  path={Routes.FETCH_ORDER_DETAILS}
                  component={OrderDetails}
                  order={orderContext}
                  onSuccess={() => history.replace(Routes.CHECK_OUT)}
                />
                <RouteWithProps
                  path={Routes.FETCH_DISCOUNT}
                  component={Discount}
                  items={orderContext.items}
                  orderType={orderContext.order.diningOption}
                  scheduledAt={orderContext.order.scheduledAt}
                  order={orderContext}
                  onSuccess={(discount) => {
                    orderContext.setOrderDetails(discount);
                    history.goBack();
                  }}
                />
                <RouteWithProps
                  path={Routes.CLEAR_DISCOUNT}
                  component={ClearDiscount}
                  onConfirm={() => {
                    orderContext.setOrderDetails({discount: null});
                    history.goBack();
                  }}
                  onCancel={() => history.replace(Routes.ROOT)}
                />
                <RouteWithProps
                  path={Routes.FETCH_CARDS}
                  component={PaymentForm}
                  locationId={orderContext.location.id}
                  onSuccess={() => history.goBack()}
                />
                <RouteWithProps
                  path={Routes.PURCHASE_COMPLETE}
                  component={Complete}
                  ticketInformation={ticketInformation}
                  onSuccess={onClose}
                />
                <RouteWithProps
                  path={Routes.FETCH_SCHEDULE_DATE}
                  component={ScheduleDate}
                  order={orderContext}
                  onSuccess={() => history.goBack()}
                />
                <RouteWithProps
                  path={Routes.LOG_IN}
                  component={LoginSignup}
                  transition={false}
                  onComplete={() => history.replace(Routes.FETCH_ORDER_DETAILS)}
                />
                <Route
                  path={Routes.REMOVE_CART_ITEM}
                  render={({
                    match: {
                      params: {index},
                    },
                  }) => {
                    const text =
                      index !== undefined
                        ? orderContext.items[index].name
                        : "All Items";
                    return (
                      <Confirm
                        onConfirm={onConfirm(orderContext, index, history)}
                        onCancel={() => history.replace(Routes.ROOT)}
                        name={text}
                      />
                    );
                  }}
                />
                <RouteWithProps
                  exact
                  path={Routes.ROOT}
                  component={Cart}
                  style={style}
                  order={orderContext}
                  discountId={discountId}
                  isLoggedIn={props.isLoggedIn}
                  clearable={false}
                  editable={false}
                />
              </Switch>
            </div>
          </>
        )}
      />
    </MemoryRouter>
  );
};

export default withTemplate(CheckoutRoutes, "cart");
