import React, {useEffect, useRef, useState} from "react";
import {Lbc} from "@lunchboxinc/lunchbox-components";
import {Fragments, HOCs, ElementsThemed} from "components";
import useUserAgent from "use-user-agent";
import {useResource} from "hooks";
import {config, Copy} from "utils";
import {mapOrder, mapCateringDetails} from "../helpers";
import styles from "./index.module.css";
import commonStyles from "../index.module.css";

const {
  Grid: {Row, Col},
} = Lbc;

const {
  View,
  ThemeText,
  ThemeButton,
  Field: {Input},
} = ElementsThemed;
const {FooterButton, Loader, Empty} = Fragments;
const {withTemplate} = HOCs;

const createLink = (id) => `${window.location.origin}/checkout/${id}`;
const emailSubject = encodeURIComponent(
  `Your ${config.restaurant} order is waiting`,
);
const body = (id) => `Complete this order by going to ${createLink(id)}`;

const smsLink = ({name, version}, id) => {
  const text = body(id);
  switch (name) {
    case "iOS": {
      if (parseFloat(version) >= 8) {
        return `sms:&body=${text}`;
      }
      return `sms:;body=${text}`;
    }
    case "Android":
    default:
      return `sms:?body=${text}`;
  }
};

const GenerateLink = ({
  style: {cells, views, buttons, inputs, labels},
  onSuccess,
  order,
}) => {
  const {os} = useUserAgent();
  const [showCopy, setShowCopy] = useState(false);
  const idRef = useRef();
  const ref = useRef();
  const {orderType, placeId, ...orderData} = {
    ...mapOrder(order),
    ...mapCateringDetails(order),
  };

  const {fetching, resource, error} = useResource({
    data:
      orderType === "delivery"
        ? {orderType, placeId, ...orderData}
        : {orderType, ...orderData},
    method: "post",
    path: "/cart",
  });

  const copyToClipboard = (e) => {
    ref.current.select();
    document.execCommand("copy");
    e.target.focus();
    setShowCopy(true);
  };
  const onComplete = () => {
    onSuccess();
    order.clearItems();
    order.resetOrderDetails();
  };

  const onClickDown = (e) => {
    if (e.keyCode) {
      copyToClipboard(e);
    }
  };

  useEffect(() => {
    if (showCopy) {
      clearTimeout(idRef.current);
      idRef.current = setTimeout(() => {
        setShowCopy(false);
      }, 3000);
    }
    return () => clearTimeout(idRef.current);
  }, [showCopy]);

  let content = null;

  if (fetching) {
    content = (
      <div className={commonStyles.loader}>
        <Loader />
      </div>
    );
  } else if (Object.keys(error).length) {
    content = (
      <div className={commonStyles.loader}>
        <Empty img="empty">
          <ThemeText type={labels.error}>
            {
              Copy.CHECKOUT_STATIC
                .GENERATE_LINK_ERROR_WHILE_CREATING_LINK_MESSAGE
            }
          </ThemeText>
        </Empty>
      </div>
    );
  } else {
    const {publicIdentifier} = resource;
    content = (
      <>
        <div className={styles.content}>
          <Input
            inputRef={ref}
            type={inputs.primary}
            label={Copy.CHECKOUT_STATIC.GENERATE_LINK_INPUT_LINK_LABEL}
            placeholder=""
            value={resource ? createLink(publicIdentifier) : ""}
            readOnly
            icon={
              showCopy ? (
                <span>
                  {Copy.CHECKOUT_STATIC.GENERATE_COPIED_LINK_SPAN_TEXT}
                </span>
              ) : (
                <span
                  tabIndex="0"
                  role="button"
                  onClick={copyToClipboard}
                  onKeyDown={onClickDown}
                >
                  {
                    Copy.CHECKOUT_STATIC
                      .GENERATE_LINK_SHARE_LINK_EMAIL_BUTTON_TEXT
                  }
                </span>
              )
            }
          />

          <Row flex>
            <Col xs="1-2">
              <ThemeButton
                type={buttons.link}
                Component="a"
                href={`mailto:?subject=${emailSubject}&body=${body(
                  publicIdentifier,
                )}`}
              >
                {
                  Copy.CHECKOUT_STATIC
                    .GENERATE_LINK_SHARE_LINK_EMAIL_BUTTON_TEXT
                }
              </ThemeButton>
            </Col>
            <Col xs="1-2">
              <ThemeButton
                type={buttons.link}
                Component="a"
                href={smsLink(os, publicIdentifier)}
              >
                {Copy.CHECKOUT_STATIC.GENERATE_LINK_SHARE_LINK_TEXT_BUTTON_TEXT}
              </ThemeButton>
            </Col>
          </Row>
        </div>

        <FooterButton type={cells.bottom} onClick={onComplete}>
          {Copy.CHECKOUT_STATIC.GENERATE_LINK_START_NEW_CART_BUTTON_TEXT}
        </FooterButton>
      </>
    );
  }

  return (
    <View type={views.background} className={commonStyles.container}>
      {content}
    </View>
  );
};

export default withTemplate(GenerateLink, "link");
