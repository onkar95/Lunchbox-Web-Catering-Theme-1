import React from "react";
import {Lbc} from "@lunchboxinc/lunchbox-components";
import {View, ThemeText} from "components/elementsThemed";
import {FooterButton} from "components/fragments";
import {withTemplate} from "components/hocs";
import {Copy} from "utils";
import commonStyles from "../../index.module.css";
import css from "./complete.module.scss";

const {
  Grid: {Row, Col},
} = Lbc;

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
    <View type={views.background} className={commonStyles.container}>
      <div className={css.content}>
        <View type={views.body}>
          <View type={views.title} className={css.title}>
            <ThemeText type={labels.primary}>
              {Copy.CHECKOUT_STATIC.COMPLETE_ORDER_SUBMITTED_MESSAGE}
            </ThemeText>
          </View>
          <div className={css.info}>
            <Row spacing={20}>
              <Col xs="1">
                <ThemeText type={labels.secondary}>
                  Our Team will reach out soon about your{" "}
                  {ticketInformation.orderType} request
                </ThemeText>
              </Col>
            </Row>
            <hr className={css.divider} />
            <Row>{info}</Row>
          </div>
        </View>
      </div>
      <div className={css.footer}>
        <FooterButton type={cells.bottom} onClick={onSuccess}>
          {Copy.CHECKOUT_STATIC.COMPLETE_BACK_TO_MENU_BUTTON_TEXT}
        </FooterButton>
      </div>
    </View>
  );
};

export default withTemplate(Complete, "confirmation");
