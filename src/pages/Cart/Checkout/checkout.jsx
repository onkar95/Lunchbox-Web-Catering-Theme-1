import React, {useEffect, useState, useReducer} from "react";
import TagManager from 'react-gtm-module'
import {format} from "date-fns";

import {Elements, ElementsThemed, Fragments, HOCs} from "components";
import {useOrderContext} from "components/providers/Order/order";
import {helpers, axios, constants, config, Routes, Copy} from "utils";
import PriceField from "../OrderSummary/PriceField";
import Field from "../Field";
import {
  getAvailableTipByOrderType,
  mapOrder,
  mapCateringDetails,
  getFinalAmount
} from "../helpers";

import css from "./checkout.module.scss";
import commonStyles from "../index.module.css";

const {roundFloat} = helpers;
const {
  ERRORS: {generalOrder},
} = constants;
const {Condition, Tooltip} = Elements;
const {
  ThemeText,
  View,
  RadioButton: {RadioButton},
  Field: {InputNumber},
} = ElementsThemed;
const {FooterButton, Loader} = Fragments;
const {withTemplate} = HOCs;
const {
  handleError,
  methods: {post},
} = axios;
const {
  tip: pickup_tip,
  tip_default: default_pickup_tip,
  minimum: pickup_min,
} = config.pickup;
const {
  tip: delivery_tip,
  tip_default: default_delivery_tip,
  minimum: delivery_min,
} = config.delivery;
const {service_copy, service_delivery_information, service_pickup_information} =
  config.lang;

const errorReducer = (state, {type, payload}) => {
  switch (type) {
    case "VALIDATION_ERROR":
      return {...state, type: 1, ...payload};
    case "SERVER_ERROR":
      return {...state, type: 2, ...payload};
    case "CLEAR_ERROR":
      return {
        ...state,
        buttonText: "",
        message: "",
        type: null,
      };
    default:
      return state;
  }
};

const transformRequestError = (error) => {
  const e = handleError(error);
  if (e.type === "response") {
    if (e.status === 401) {
      e.message = "You must be logged in to place an order.";
    } else if (e.status === 400) {
      e.message = e.data;
    } else if (e.status === 500) {
      e.message = e.data;
    }
  }
  return e;
};

const initTip = (orderType, preDiscountPrice) => {
  const tipPercent =
    orderType === "delivery"
      ? Number(default_delivery_tip)
      : Number(default_pickup_tip);
  return (tipPercent * preDiscountPrice).toFixed(2);
};

const Checkout = ({style, onSuccess, setHeader, ...props}) => {
  const {views, labels, cells, buttons, inputs} = style;
  const orderContext = useOrderContext();
  const [error, dispatchError] = useReducer(errorReducer, {
    buttonText: "",
    message: "",
    type: null,
  });

  const [fetching, setFetching] = useState(true);
  const [resource, setResource] = useState({});

  const [ordering, setOrdering] = useState(false);
  const [tip, setTip] = useState(
    initTip(
      orderContext.order.orderType,
      Object.keys(resource).length && resource.preDiscountPrice
        ? resource.preDiscountPrice
        : 0,
    ),
  );
  let tipAmount = tip;
  let showTip = true;

  const {
    delivery = 0,
    appliedDiscounts = 0,
    taxAmount = 0,
    appliedCredit = 0,
    totalAmount = 0,
    customerCard = null,
    preDiscountPrice = 0,
  } = resource;
  const ccText =
    customerCard && customerCard.last4
      ? `${customerCard.brand} ending in ${customerCard.last4}`
      : "No Card";
  const {
    order: {scheduledAt},
  } = orderContext;
  const isDelivery = orderContext.order.orderType === "delivery";
  const serviceFeeInformation = isDelivery
    ? service_delivery_information
    : service_pickup_information;

  const scheduledAtTimeZone = new Date(scheduledAt * 1000).toLocaleString(
    "en-US",
    {timeZone: orderContext.location.timeZone},
  );

  const labelValue = format(scheduledAtTimeZone, "ddd M/D/YYYY h:mm a");
  const finalAmount = getFinalAmount({ totalAmount, delivery, tipAmount });

  const purchasingInfoArgs = {
    dataLayer: {
      name: orderContext?.order?.contactName,
      phoneNumber: orderContext?.order?.contactPhone,
      appliedDiscounts,
      subTotal: orderContext?.order?.subtotal,
      totalAmount: finalAmount,
      orderDetails: orderContext?.items
    },
    dataLayerName: 'PurchasingInfo'
  }

  if (
    (orderContext.order.orderType === "pickup" && !pickup_tip) ||
    (orderContext.order.orderType === "delivery" && !delivery_tip)
  ) {
    showTip = false;
    tipAmount = 0;
  }

  const tipsAvailableOptions = getAvailableTipByOrderType(
    orderContext?.order?.diningOption,
  );

  const onValidationError = (e) => {
    dispatchError({
      payload: e,
      type: "VALIDATION_ERROR",
    });
  };
  const onServerError = (e) => {
    dispatchError({
      payload: e,
      type: "SERVER_ERROR",
    });
  };

  const validate = (res) => {
    const baseAmount = res.amount - res.delivery;
    if (!res.customerCard || !res.customerCard.last4) {
      dispatchError({
        payload: {
          buttonText: "Payment Required",
          message: "Please make sure to fill out your payment information.",
        },
        type: "VALIDATION_ERROR",
      });
    } else if (
      (orderContext.order.orderType === "delivery" &&
        delivery_min &&
        baseAmount < delivery_min) ||
      (orderContext.order.orderType === "pickup" &&
        pickup_min &&
        baseAmount < pickup_min)
    ) {
      const min =
        orderContext.order.orderType === "delivery" ? delivery_min : pickup_min;
      dispatchError({
        payload: {
          buttonText: "Delivery Minimum",
          message: `The price for your order, before tip and service charges, must be at least $${min} to place a ${orderContext.order.orderType} order.`,
        },
        type: "VALIDATION_ERROR",
      });
    } else if (!orderContext.location.id) {
      dispatchError({
        payload: {
          buttonText: "No Location Selected",
          message: "Please select a location.",
        },
        type: "VALIDATION_ERROR",
      });
    }
  };
  

  const placeOrder = async () => {
    setOrdering(true)
    try {
      const {data} = await post("/catering/", {
        ...mapOrder(orderContext),
        ...mapCateringDetails(orderContext),
        tip: tipAmount,
      });
      orderContext.clearItems();
      orderContext.resetOrderDetails();
      onSuccess(data);

      if(config.apps.google_tag_manager) {
        TagManager.dataLayer(purchasingInfoArgs)
      }
    } catch (err) {
      console.error(err);
      const e = transformRequestError(err);
      if (e.message) {
        onValidationError({
          buttonText: Copy.CART_STATIC.CHECKOUT_PLACE_ORDER_BUTTON_TEXT,
          message: e.message,
        });
      } else {
        onServerError({
          buttonText: null,
          message: generalOrder,
        });
      }
      setOrdering(false);
    }
  };

  const checkPrice = async () => {
    try {
      const res = await post(Routes.CHECK_PRICE_CATERING, {
        ...mapOrder(orderContext),
      });
      if (res.data.isValid !== undefined && !res.data.isValid) {
        onValidationError({
          buttonText: Copy.CART_STATIC.CHECKOUT_PLACE_ORDER_BUTTON_TEXT,
          message: res.data.message,
        });
      } else {
        validate(res.data);
        setResource(res.data);
      }
    } catch (err) {
      const e = transformRequestError(err);
      if (e.message) {
        onValidationError({
          buttonText: Copy.CART_STATIC.CHECKOUT_PLACE_ORDER_BUTTON_TEXT,
          message: e.message,
        });
      } else {
        onServerError({
          buttonText: null,
          message: generalOrder,
        });
      }
    } finally {
      setFetching(false);
    }
  };

  const onClickTip = (i) => {
    const nextTip =
      Object.keys(resource).length && resource.preDiscountPrice
        ? resource.preDiscountPrice * i
        : 0;
    setTip(nextTip.toFixed(2));
  };

  useEffect(() => {
    setHeader && setHeader(Copy.CART_STATIC.CHECKOUT_HEADER_TEXT);
  }, []);

  useEffect(() => {
    checkPrice();
  }, []);
  useEffect(() => {
    setTip(
      initTip(
        orderContext.order.orderType,
        Object.keys(resource).length && resource.preDiscountPrice
          ? resource.preDiscountPrice
          : 0,
      ),
    );
  }, [resource.preDiscountPrice]);

  if (fetching) {
    return (
      <View type={views.background} className={commonStyles.container}>
        <div className={css.loader}>
          <Loader />
        </div>
      </View>
    );
  }

  return (
    <View type={views.background} className={commonStyles.container}>
      <View
        type={views.background}
        className={`${commonStyles.content} ${css.content}`}
      >
        <Field
          type={cells.primary}
          label="Card"
          value={ccText}
          buttonProps={{
            children: "Edit",
            onClick: () => props.history.push(Routes.FETCH_CARDS),
          }}
        />

        <Field
          type={cells.primary}
          label="Order Type"
          value={orderContext.order.orderType}
        />

        <Field
          type={cells.primary}
          label="Order Time"
          value={labelValue}
          buttonProps={{
            children: "Edit",
            onClick: () => props.history.push(Routes.FETCH_SCHEDULE_DATE),
          }}
        />

        <Condition condition={error.message}>
          <div>
            <ThemeText type={labels.error}>{error.message}</ThemeText>
          </div>
        </Condition>
      </View>

      <div className={css.footer}>
        <div className={css["price-container"]}>
          <Condition condition={appliedDiscounts > 0}>
            <PriceField
              type={labels.priceSubtotals}
              name="Discount"
              value={appliedDiscounts}
              neg
            />
          </Condition>
          <Condition condition={isDelivery}>
            <PriceField
              type={labels.priceSubtotals}
              name={service_copy}
              info={
                serviceFeeInformation && (
                  <Tooltip message={serviceFeeInformation}>
                    <ThemeText
                      type={labels.disclaimer}
                      className={css.information}
                      direction="left"
                    >
                      ?
                    </ThemeText>
                  </Tooltip>
                )
              }
              value={`${delivery}`}
            />
          </Condition>

          <Condition condition={!isDelivery}>
            <PriceField
              type={labels.priceSubtotals}
              name={service_copy}
              info={
                serviceFeeInformation && (
                  <Tooltip message={serviceFeeInformation}>
                    <ThemeText
                      type={labels.disclaimer}
                      className={css.information}
                      direction="left"
                    >
                      ?
                    </ThemeText>
                  </Tooltip>
                )
              }
              value={`${delivery}`}
            />
          </Condition>

          <PriceField
            type={labels.priceSubtotals}
            name="Subtotal"
            value={preDiscountPrice}
          />

          <PriceField
            type={labels.priceSubtotals}
            name="Tax"
            value={taxAmount}
            info={
              <Tooltip
                message="Tax may vary by fulfillment location"
                direction="left"
              >
                <ThemeText type={labels.disclaimer} className={css.information}>
                  ?
                </ThemeText>
              </Tooltip>
            }
          />

          <Condition condition={appliedCredit > 0}>
            <PriceField
              type={labels.priceSubtotals}
              name="Loyalty Credit"
              value={appliedCredit}
            />
          </Condition>

          <Condition is={showTip}>
            <div className={css.tip}>
              <span>
                <ThemeText type={labels.priceSubtotals}>Tip</ThemeText>
                &nbsp;&nbsp;
                <span className={css["tip-group"]}>
                  {tipsAvailableOptions.map((i) => (
                    <RadioButton
                      key={i}
                      type={buttons.tip}
                      value={roundFloat(tipAmount / preDiscountPrice) === i}
                      onChange={() => onClickTip(i)}
                      className={css["tip-btn"]}
                    >
                      {`${i * 100}%`}
                    </RadioButton>
                  ))}
                </span>
              </span>
              <InputNumber
                min={0}
                step="0.01"
                icon="$"
                type={inputs.standard}
                fieldClass={css["tip-input"]}
                value={tipAmount}
                onChange={(val) => {
                  const cleanNumber = parseFloat(val);
                  if (Number.isNaN(cleanNumber) || cleanNumber < 0) {
                    setTip("");
                  } else {
                    setTip(cleanNumber);
                  }
                }}
                onBlur={(val) => {
                  const cleanNumber = parseFloat(val);
                  if (Number.isNaN(cleanNumber) || cleanNumber < 0) {
                    setTip(parseFloat(0).toFixed(2));
                  } else {
                    setTip(cleanNumber.toFixed(2));
                  }
                }}
              />
            </div>
          </Condition>

          <PriceField
            type={labels.priceTotals}
            name="Total"
            value={finalAmount}
          />
        </div>

        <FooterButton
          className="checkout-confirmation"
          type={cells.bottom}
          disabled={ordering || error.type}
          onClick={placeOrder}
        >
          {error.type === 1
            ? error.buttonText
            : Copy.CART_STATIC.CHECKOUT_PLACE_ORDER_BUTTON_TEXT}
        </FooterButton>
      </div>
    </View>
  );
};

export default withTemplate(Checkout, "checkout");
