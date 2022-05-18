import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {Layout} from "components/elements";
import {View, ThemeText} from "components/elementsThemed";
import {FooterButton} from "components/fragments";
import {withTemplate} from "components/hocs";
import {config, Copy} from "utils";
import commonStyles from "../../index.module.css";
import css from "./complete.module.css";

const {
  Grid: {Col},
} = Lbc;

const {Flex} = Layout;

const Complete = ({
  style: {views, cells, labels},
  onSuccess,
  ticketInformation,
  scheduleTime,
}) => {
  let info = null;

  if (scheduleTime) {
    info = (
      <>
        <Col xs="1">
          <ThemeText type={labels.tertiary}>
            {Copy.CHECKOUT_STATIC.COMPLETE_SCHEDULE_DATE_HEADER_TEXT}
          </ThemeText>
        </Col>
        <Col xs="1">
          <ThemeText type={labels.tertiary}>{scheduleTime}</ThemeText>
        </Col>
      </>
    );
  }
  return (
    <View
      Component={Flex}
      grow={1}
      type={views.background}
      className={commonStyles.container}
    >
      <Flex justify="start" grow={0} className={css.content}>
        <View type={views.body}>
          <div className={css.title}>
            <ThemeText type={labels.primary}>
              {Copy.CHECKOUT_STATIC.COMPLETE_ORDER_SUBMITTED_MESSAGE}
            </ThemeText>
          </div>
          <br />
          <div className={css.info}>
            <ThemeText type={labels.secondary}>
              Our Team will reach out soon about your{" "}
              {ticketInformation.orderType} request
            </ThemeText>
            <div>{info}</div>
          </div>
        </View>
      </Flex>
      <Flex
        justify="start"
        grow={1}
        className={css["empty-space"]}
        style={{
          backgroundImage: `url(${config?.images?.art_misc_1})`,
          flexBasis: "300px",
        }}
      />
      <div className={css.footer}>
        <FooterButton type={cells.bottom} onClick={onSuccess}>
          {Copy.CHECKOUT_STATIC.COMPLETE_BACK_TO_MENU_BUTTON_TEXT}
        </FooterButton>
      </div>
    </View>
  );
};

export default withTemplate(Complete, "confirmation");
