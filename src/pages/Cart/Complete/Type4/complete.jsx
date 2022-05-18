import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {Image, Layout} from "components/elements";
import {View, ThemeText as Text} from "components/elementsThemed";
import {FooterButton} from "components/fragments";
import {withTemplate} from "components/hocs";
import {config, Copy} from "utils";
import cx from "classnames";
import css from "./complete.module.scss";
import commonCSS from "../../index.module.css";

const {Row, Col} = Lbc.Grid;
const {Flex} = Layout;

const Complete = ({
  style: {views, cells, labels},
  onSuccess,
  ticketInformation,
  scheduleTime,
}) => {
  const isPickupOrder = ticketInformation.orderType === "pickup";
  const titleText = isPickupOrder
    ? Copy.CHECKOUT_STATIC.COMPLETE_TYPE4_PICKUP_FROM_TEXT
    : Copy.CHECKOUT_STATIC.COMPLETE_TYPE4_DELIVERING_FROM_TEXT;
  const orderTypeText = isPickupOrder
    ? ticketInformation.locationName
    : ticketInformation.deliveryInfo;
  const prepTimeText = isPickupOrder
    ? "Estimated Pickup Time: "
    : "Estimated Delivery Time:";

  const info = (
    <div className={css["complete-content-timeContainer"]}>
      <Col xs="1">
        <Text type={labels.primary}>{prepTimeText}</Text>
      </Col>
      <Col xs="1">
        <Text type={labels.secondary}>{scheduleTime}</Text>
        <View
          type={views.barBackground}
          className={css["complete-content-barCon"]}
        >
          <View
            type={views.bar}
            className={cx("bar", css["complete-content-bar"])}
            data-percent="30"
          />
        </View>
      </Col>
      <Col xs="1">
        <Text type={labels.tertiary}>
          {Copy.CHECKOUT_STATIC.COMPLETE_TYPE4_ORDER_IN_THE_KITCHEN_MESSAGE}
        </Text>
      </Col>
    </div>
  );

  const AddressDetail = (
    <div className={css["complete-content-title"]}>
      <Text type={labels.tertiary}>{titleText}</Text>
      <Row>
        <Text type={labels.quaternary}>{orderTypeText}</Text>
      </Row>
    </div>
  );

  // "purchase-confirmation" is gtm Ecommerce-anchor, please do not remove
  return (
    <View
      type={views.background}
      grow={1}
      Component={Flex}
      className={`${commonCSS.container} ${css.complete}`}
    >
      <div className={cx(css["complete-content"], "purchase-confirmation")}>
        <View
          type={views.secondary}
          Component={Flex}
          grow={0}
          className={css["complete-content-information"]}
          direction="col"
        >
          {info}
          <View
            type={views.tertiary}
            className={css["complete-content-divider"]}
          />
          {AddressDetail}
          {config.images?.art_catering_order_confirmation && (
            <Image
              src={config.images?.art_catering_order_confirmation}
              className={css["complete-content-img"]}
              alt="confirmation Image"
            />
          )}
        </View>
      </div>
      <div className={css["complete-footer"]}>
        <FooterButton type={cells.bottom} onClick={onSuccess}>
          {Copy.CHECKOUT_STATIC.COMPLETE_BACK_TO_MENU_BUTTON_TEXT}
        </FooterButton>
      </div>
    </View>
  );
};

const ThemedComplete = withTemplate(Complete, "confirmation");
ThemedComplete.displayName = "CompleteType4";

export default ThemedComplete;
