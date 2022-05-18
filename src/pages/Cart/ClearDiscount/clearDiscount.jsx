import React from "react";

import Lbc from "@lunchboxinc/lunchbox-components";
import {ElementsThemed, HOCs} from "components";
import styles from "./index.module.css";

const {
  Grid: {Row, Col},
} = Lbc;

const {ThemeText, ThemeButton, View} = ElementsThemed;
const {withTemplate} = HOCs;

const RemoveDiscount = ({onConfirm, onCancel, style}) => (
  <>
    <View className={styles.background} type={style.views.background} />
    <div className={styles.confirm}>
      <div className={styles.dialogue}>
        <ThemeText type={style.labels.title}>
          Are you sure you want to clear promos
        </ThemeText>
      </div>
      <Col xs={{offset: "1-12", span: "5-6"}} sm={{offset: "1-8", span: "3-4"}}>
        <Row gutter={60}>
          <Col xs="1-2">
            <ThemeButton
              block
              size="md"
              type={style.buttons.confirm}
              onClick={onConfirm}
            >
              Remove
            </ThemeButton>
          </Col>
          <Col xs="1-2">
            <ThemeButton
              block
              size="md"
              type={style.buttons.cancel}
              onClick={onCancel}
            >
              Go Back
            </ThemeButton>
          </Col>
        </Row>
      </Col>
    </div>
  </>
);

export default withTemplate(RemoveDiscount, "confirm");
