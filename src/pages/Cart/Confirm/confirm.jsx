import React from "react";

import Lbc from "@lunchboxinc/lunchbox-components";
import {ElementsThemed, HOCs} from "components";
import {helpers, Copy} from "utils";
import styles from "./confirm.module.scss";

const {
  Grid: {Row, Col},
} = Lbc;

const {ThemeText, ThemeButton, View} = ElementsThemed;
const {withTemplate} = HOCs;

const Confirm = ({name, onConfirm, onCancel, style}) => (
  <>
    <View className={styles.background} type={style.views.background}>
      <div className={styles.confirm}>
        <div className={styles.dialogue}>
          <ThemeText type={style.labels.title}>
            {helpers.stringReplacer(
              Copy.CHECKOUT_STATIC.CONFIRM_REMOVE_ITEM_APPROVAL_MESSAGE,
              [{replaceTarget: "{itemName}", replaceValue: name}],
            )}
          </ThemeText>
        </div>
        <Col
          xs={{offset: "1-12", span: "5-6"}}
          sm={{offset: "1-8", span: "3-4"}}
        >
          <Row gutter={60}>
            <Col xs="1-2">
              <ThemeButton
                className={styles["remove-confirmation"]}
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
                {Copy.CHECKOUT_STATIC.CONFIRM_GO_TO_CART_BUTTON_TEXT}
              </ThemeButton>
            </Col>
          </Row>
        </Col>
      </div>
    </View>
  </>
);

export default withTemplate(Confirm, "confirm");
