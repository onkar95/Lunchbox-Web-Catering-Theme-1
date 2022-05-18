import React from "react";

import Lbc from "@lunchboxinc/lunchbox-components";
import {ElementsThemed, HOCs} from "components";
import {Copy} from "utils";
import styles from "./logout.module.css";

const {
  Grid: {Row, Col},
} = Lbc;

const {ThemeText, ThemeButton, View} = ElementsThemed;
const {withTemplate} = HOCs;

const Logout = ({style, onConfirm, onCancel}) => (
  <>
    <View className={styles.background} type={style.views.background} />
    <div className={styles.container}>
      <div className={styles.dialogue}>
        <ThemeText type={style.labels.title}>
          {Copy.LOGOUT_STATIC.LOGOUT_CONFIRM_MESSAGE}
        </ThemeText>
      </div>
      <Col xs={{offset: "1-12", span: "5-6"}} sm={{offset: "1-8", span: "3-4"}}>
        <Row gutter={60}>
          <Col xs="1-2">
            <ThemeButton block type={style.buttons.confirm} onClick={onConfirm}>
              Logout
            </ThemeButton>
          </Col>
          <Col xs="1-2">
            <ThemeButton block type={style.buttons.cancel} onClick={onCancel}>
              {Copy.LOGOUT_STATIC.CANCEL_BUTTON_TEXT}
            </ThemeButton>
          </Col>
        </Row>
      </Col>
    </div>
  </>
);

export default withTemplate(Logout, "logout");
