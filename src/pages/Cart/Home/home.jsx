import React, {useState} from "react";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import Posed, {PoseGroup} from "react-pose";
import {Fragments, Templates, HOCs, ElementsThemed} from "components";
import {Routes, config} from "utils";
import styles from "../index.module.css";
import Confirm from "../Confirm";
import Discount from "../Discount";
import Checkout from "../Checkout";
import Complete from "../Complete";
import ScheduleDate from "../ScheduleDate";
import ClearDiscount from "../ClearDiscount";
import OrderDetails from "../OrderDetails";
import GenerateLink from "../GenerateLink";
import Cart from "../Cart";
import {headerText, orderModsAsObject} from "../helpers";
import BackButton2 from "../../../components/fragments/BackButton/backButton2";

const {View, ThemeText, Cell} = ElementsThemed;
const {
  Card: {CardBody},
  BackButton,
  Routes: {RouteWithProps},
} = Fragments;
const {ItemDetails, LoginSignup, PaymentForm} = Templates;
const {withTemplate} = HOCs;

const Home = ({
  style,
  isEmployee,
  isLoggedIn,
  order: orderContext,
  onComplete,
  onClose,
}) => {
  const [header, setHeader] = useState("");
  const [ticketInformation, setTicketInformation] = useState({});

  const {views, labels, cells} = style;

  const {name} = orderContext.location;
  const {deliveryInfo} = orderContext.order;
  const isDelivery = orderContext.order.orderType === "delivery";

  const [labelText, labelValue] = headerText(
    isDelivery,
    true,
    deliveryInfo,
    name,
  );

  const onClickBack = (memory) => () => {
    return ["/", "/complete/"].includes(memory.location.pathname)
      ? onClose()
      : memory.history.goBack();
  };

  return (
    <MemoryRouter initialEntries={["/"]} initialIndex={0}>
      <div className={styles.container}>
        <Route
          render={({location, history}) => (
            <>
              <View
                type={views.header}
                Component={CardBody}
                className={styles.nav}
              >
                <BackButton2
                  imgSrc={config?.images?.button_back_cart_header}
                  onClick={onClickBack({history, location})}
                />
                {["/complete/", "/checkout"].includes(location.pathname) ? (
                  <ThemeText type={labels.primary}>{header}</ThemeText>
                ) : (
                  <Cell
                    type={cells.header}
                    render={({views: cellViews, labelTextStyles}) => (
                      <View type={cellViews.background}>
                        <div className={styles.label}>
                          <ThemeText type={labelTextStyles.primary}>
                            {labelText}
                          </ThemeText>
                        </div>
                        <div className={styles.value}>
                          <ThemeText type={labelTextStyles.secondary}>
                            {labelValue}
                          </ThemeText>
                        </div>
                      </View>
                    )}
                  />
                )}
              </View>
              <PoseGroup>
                <RouteContainer key={location.key}>
                  <Switch location={location}>
                    <Route
                      path={Routes.FETCH_ITEM_DETAIL}
                      render={({
                        match: {
                          params: {index},
                        },
                        location: {
                          state: {isGroup},
                        },
                      }) => {
                        const orderItem = orderContext.items[index];
                        const mods = orderModsAsObject(orderItem.mods);
                        const itemDetailProps = {
                          ...orderItem,
                          buttonText: "Accept Edits",
                          close: () => history.goBack(),
                          id: isGroup ? orderItem.group : orderItem.item,
                          isGroup,
                          mods,
                          onConfirm: (data) =>
                            orderContext.editItemAtIndex(data, index),
                        };
                        return (
                          <ItemDetails isGroup={isGroup} {...itemDetailProps} />
                        );
                      }}
                    />
                    <RouteWithProps
                      path={Routes.CHECK_OUT}
                      component={Checkout}
                      onSuccess={(order) => {
                        setTicketInformation(order);
                        history.replace("/complete/");
                      }}
                      setHeader={setHeader}
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
                      setHeader={setHeader}
                    />
                    <RouteWithProps
                      path={Routes.CLEAR_DISCOUNT}
                      component={ClearDiscount}
                      onConfirm={() => {
                        orderContext.setOrderDetails({
                          code: null,
                          discount: null,
                          promotionCodeId: null,
                          promotionId: null,
                        });
                        history.goBack();
                      }}
                      onCancel={() => history.replace("/")}
                    />
                    <RouteWithProps
                      path={Routes.FETCH_CARDS}
                      component={PaymentForm}
                      order={orderContext}
                      onSuccess={() => history.goBack()}
                      setHeader={setHeader}
                    />
                    <RouteWithProps
                      path={Routes.PURCHASE_COMPLETE}
                      component={Complete}
                      ticketInformation={ticketInformation}
                      onSuccess={onComplete}
                      setHeader={setHeader}
                    />
                    <RouteWithProps
                      path={Routes.FETCH_ORDER_DETAILS}
                      component={OrderDetails}
                      order={orderContext}
                      setHeader={setHeader}
                      onSuccess={() =>
                        isEmployee
                          ? history.replace("/link")
                          : history.replace("/checkout")
                      }
                    />
                    <RouteWithProps
                      path={Routes.FETCH_SCHEDULE_DATE}
                      component={ScheduleDate}
                      order={orderContext}
                      setHeader={setHeader}
                      onSuccess={() => history.goBack()}
                    />
                    <RouteWithProps
                      path={Routes.LOG_IN}
                      component={LoginSignup}
                      onComplete={() => {
                        history.replace("/order-details");
                      }}
                    />
                    <Route
                      path={Routes.REMOVE_CART_ITEM}
                      render={({
                        match: {
                          params: {index},
                        },
                      }) => {
                        const onConfirm = () => {
                          if (index !== undefined) {
                            orderContext.removeFromOrder(parseInt(index, 10));
                          } else {
                            orderContext.clearItems();
                          }
                          history.replace("/");
                        };
                        const name =
                          index !== undefined
                            ? orderContext.items[index].name
                            : "All Items";
                        return (
                          <Confirm
                            onConfirm={onConfirm}
                            onCancel={() => history.replace("/")}
                            name={name}
                          />
                        );
                      }}
                    />
                    <RouteWithProps
                      path={Routes.LINK}
                      component={GenerateLink}
                      order={orderContext}
                      onSuccess={onComplete}
                    />
                    <RouteWithProps
                      exact
                      path={Routes.ROOT}
                      component={Cart}
                      style={style}
                      order={orderContext}
                      isEmployee={isEmployee}
                      isLoggedIn={isLoggedIn}
                    />
                  </Switch>
                </RouteContainer>
              </PoseGroup>
            </>
          )}
        />
      </div>
    </MemoryRouter>
  );
};

const RouteContainer = Posed(
  React.forwardRef(({children, ...props}, ref) => (
    <div ref={ref} className={styles.content} {...props}>
      {children}
    </div>
  )),
)({
  enter: {
    transition: {
      ease: [0.35, 0, 0.25, 1],
    },
    x: "0%",
  },
  exit: {
    transition: {
      ease: [0.35, 0, 0.25, 1],
    },
    x: "100%",
  },
});

export default withTemplate(Home, "cart");
