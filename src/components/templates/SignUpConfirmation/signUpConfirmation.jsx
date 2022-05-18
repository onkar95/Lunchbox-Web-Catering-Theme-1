import React from "react";
import {Layout, Image} from "components/elements";
import Lbc from "@lunchboxinc/lunchbox-components";
import {Copy, config} from "../../../utils";
import {FooterButton} from "../../fragments";
import {ThemeText as Text, View} from "../../elementsThemed";
import {withTemplate} from "../../hocs";

import css from "./signUpConfirmation.module.scss";

const {
  images: {signup_confirmation},
} = config;

const {Flex} = Layout;
const {
  Grid: {Row, Col},
} = Lbc;

/**
 * Depending on the step, returns an appropriate widget
 *
 * @param {object} props
 * @param {object} props.style - From theme file & withTemplate HOC
 * @param {string} props.widgetId - Provided by Beam. It is in config
 * @param {string} props.patronEmail - From BeamImpact
 * @param {number} props.cartTotal - From BeamImpact
 * @param {string} props.step - Checkout Step
 * @param {object} props.beam - State in pages/Cart/routes.jsx
 * @param {Function} props.setBeam - Setter method for state in pages/Cart/routes.jsx
 * @param {Function} props.onSeeMoreImpact - callback for onClick on 'See More Impact' in pages/Cart/routes.jsx
 * @param {Function} props.onSkipBeamSelection - Alternate Func to bring the user to Routes.PURCHASE_COMPLETE - from home.jsx
 * @param props.onConfirm
 */
const SignUpConfirmation = ({onConfirm, style}) => {
  return (
    <View
      type={style.views.background}
      Component={Flex}
      className={css.content}
    >
      <Flex grow={1} className={css["content-text"]}>
        <Row>
          <Col xs={{offset: "1-4", span: "1-2"}}>
            <div className={css["content-text"]}>
              <Text type={style.labels.title}>
                {Copy.LOGIN_SIGNUP_STATIC.CONFIRMATION_HEADER}
              </Text>
            </div>

            <div className={css["content-text"]}>
              <Text type={style.labels.subtitle}>
                {Copy.LOGIN_SIGNUP_STATIC.CONFIRMATION_SUBHEADER}
              </Text>
            </div>

            <div className={css["content-img"]}>
              {signup_confirmation && (
                <Image src={signup_confirmation} alt="sign up confirmation" />
              )}
            </div>
          </Col>
        </Row>
      </Flex>
      <FooterButton
        type={style.cells.bottom}
        htmlType="button"
        onClick={onConfirm}
      >
        {Copy.LOGIN_SIGNUP_STATIC.CONFIRMATION_FOOTER}
      </FooterButton>
    </View>
  );
};

export default withTemplate(SignUpConfirmation, "signUpConfirmation");
