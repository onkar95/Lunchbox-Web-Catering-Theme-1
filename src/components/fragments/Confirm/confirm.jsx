import React from "react";

import Lbc from "@lunchboxinc/lunchbox-components";
import {Elements, ElementsThemed, HOCs} from "components";
import styles from "./confirm.module.css";

const {
  Grid: {Row, Col},
} = Lbc;

const {
  Layout: {Flex},
} = Elements;
const {ThemeText, ThemeButton, View} = ElementsThemed;
const {withTemplate} = HOCs;

const viewProps = {
  Component: Flex,
  align: "center",
  className: styles.background,
  grow: "1",
  justify: "center",
};

const Confirm = ({
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  style,
  isNegativeConfirm,
}) => (
  <View type={style.views.background} {...viewProps}>
    <div className={styles.confirm}>
      <div className={styles.dialogue}>
        <ThemeText type={style.labels.title}>
          <div>{message}</div>
        </ThemeText>
      </div>
      <Col xs={{offset: "1-12", span: "5-6"}} sm={{offset: "1-8", span: "3-4"}}>
        <Row gutter={60}>
          <Col xs="1-2">
            <ThemeButton
              block
              size="md"
              type={
                isNegativeConfirm
                  ? style.buttons.negConfirm
                  : style.buttons.confirm
              }
              onClick={onConfirm}
            >
              {confirmText}
            </ThemeButton>
          </Col>
          <Col xs="1-2">
            <ThemeButton
              block
              size="md"
              type={style.buttons.cancel}
              onClick={onCancel}
            >
              {cancelText}
            </ThemeButton>
          </Col>
        </Row>
      </Col>
    </div>
  </View>
);

export default withTemplate(Confirm, "confirm");
