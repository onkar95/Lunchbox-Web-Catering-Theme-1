import React, {useEffect} from "react";
import {ElementsThemed, Elements, Fragments, HOCs} from "components";
import {Copy, config} from "utils";
import {useResource} from "hooks";
import {mapOrder, getFinalAmount} from "../helpers";
import PriceField from "./PriceField";
import css from "./orderSummary.module.scss";

const {
  service_copy: serviceCopy,
  service_delivery_information: serviceDeliveryInformation,
  service_pickup_information: servicePickupInformation,
  tax_tooltip: taxTooltip,
} = config.lang;

const {withTemplate} = HOCs;
const {ThemeText, ThemeButton} = ElementsThemed;
const {Condition, Tooltip} = Elements;
const {
  Loader,
  Image: {Image},
} = Fragments;

const OrderSummary = ({
  style,
  order,
  toDiscount,
  onError,
  clearDiscount,
  invalidDiscount,
}) => {
  const {request, resource, fetching, error} = useResource({
    data: {
      ...mapOrder(order),
      ...(invalidDiscount ? {discount: undefined} : {}),
    },
    method: "post",
    path: "/catering/check-price/",
  });

  useEffect(() => {
    request({
      ...mapOrder(order),
      ...(invalidDiscount ? {discount: undefined} : {}),
    });
  }, [order.order.subtotal]);

  const {labels, buttons} = style;

  const {
    delivery = 0,
    appliedDiscounts = 0,
    taxAmount = 0,
    appliedCredit = 0,
    totalAmount = 0,
    preDiscountPrice = 0,
  } = resource;
  const isDelivery = order.order.orderType === "delivery";
  const serviceFeeInformation = isDelivery
    ? serviceDeliveryInformation
    : servicePickupInformation;

  const finalTotal = getFinalAmount({ totalAmount, delivery });

  // Relay the error back to the parent
  useEffect(() => {
    if (error.data) {
      onError(error.data);
    } else {
      onError("");
    }
  }, [error, onError]);

  if (fetching) {
    return (
      <div className={css["price-container"]}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={css["price-container"]}>
      {order.order.discount ? (
        <div className={css.promo}>
          <ThemeText type={labels.priceSubtotals}>
            {Copy.CART_STATIC.PROMOS_DISCOUNTS_HEADER_TEXT}
          </ThemeText>
          <span>
            <ThemeText type={labels.discount}>
              {invalidDiscount
                ? Copy.CART_STATIC.INVALID_PROMO_CODE
                : `-$${appliedDiscounts.toFixed(2)}`}
            </ThemeText>
            <Image
              className={css["promo-clear"]}
              onClick={clearDiscount}
              src={config?.images?.button_price_clear}
              alt="close"
            />
          </span>
        </div>
      ) : (
        <div className={css.promo}>
          <ThemeText type={labels.priceSubtotals}>
            {Copy.CART_STATIC.PROMOS_DISCOUNTS_HEADER_TEXT}
          </ThemeText>
          <span>
            <ThemeButton type={buttons.promo} onClick={toDiscount}>
              {Copy.CART_STATIC.ADD_PROMO_CODE_BUTTON_TEXT}
            </ThemeButton>
          </span>
        </div>
      )}

      <Condition condition={!!delivery}>
        <PriceField
          type={labels.priceSubtotals}
          name={serviceCopy}
          info={
            serviceFeeInformation && (
              <Tooltip message={serviceFeeInformation}>
                <ThemeText type={labels.disclaimer} className={css.information}>
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
          taxTooltip === 1 && (
            <Tooltip
              message="Tax may vary by fulfillment location"
              direction="left"
            >
              <ThemeText type={labels.disclaimer} className={css.information}>
                ?
              </ThemeText>
            </Tooltip>
          )
        }
      />

      <Condition condition={appliedCredit > 0}>
        <PriceField
          type={labels.priceSubtotals}
          name="Loyalty Credit"
          value={appliedCredit}
        />
      </Condition>
      <PriceField
        type={labels.priceTotals}
        name="Total"
        value={finalTotal}
      />
    </div>
  );
};

export default withTemplate(OrderSummary, "checkout");
