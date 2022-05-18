/* eslint-disable react/destructuring-assignment */

import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {Redirect} from "react-router-dom";
import {ElementsThemed, Fragments, HOCs} from "components";
import {usePatronContext} from "components/providers/patron";
import {helpers, Copy} from "utils";
import {Logout} from "..";
import styles from "./profile.module.scss";

import AccountInformation from "./accountInformation";
import CardRoutes from "./cards";

const {ThemeText, ThemeButton, Cell, View} = ElementsThemed;
const {
  Card: {Card, CardBody},
  Errors,
  Drawer,
} = Fragments;
const {withTemplate} = HOCs;

const {
  Grid: {Row, Col},
} = Lbc;

const Error = ({children}) => (
  <Errors message={<p>{Copy.PROFILE_STATIC.PROFILE_ERROR_MESSAGE}</p>}>
    {children}
  </Errors>
);

const Profile = ({style}) => {
  const {isLoggedIn, logout, patron} = usePatronContext();
  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  const {labels} = style;

  return (
    <Row style={{marginTop: "30px"}}>
      <Col
        xs={{offset: "1-24", span: "22-24"}}
        sm={{offset: "1-12", span: "5-6"}}
        lg={{offset: "1-8", span: "3-4"}}
      >
        <Cell
          type={style.cells.header}
          render={({labelTextStyles, button, views}) => (
            <View
              type={views.background}
              className={`${styles.header} ${styles.profileHeader}`}
            >
              <Row gutter={15} spacing={15}>
                <Col xs="1">
                  <ThemeText type={labelTextStyles.primary}>
                    {helpers.stringReplacer(
                      Copy.PROFILE_STATIC.USER_WELCOME_TEXT,
                      [
                        {
                          replaceTarget: "{firstName}",
                          replaceValue: patron.firstName,
                        },
                      ],
                    )}
                  </ThemeText>
                </Col>
                <Col xs="1">
                  <Drawer.ResponsiveDrawer
                    trigger={<ThemeButton type={button}>Logout</ThemeButton>}
                  >
                    {({close}) => (
                      <Logout onConfirm={logout} onCancel={close} />
                    )}
                  </Drawer.ResponsiveDrawer>
                </Col>
              </Row>
            </View>
          )}
        />
        <Row gutter={15} spacing={15}>
          <Col xs="1" md="1-2" style={{marginBottom: "15px"}}>
            <Card className={styles.section}>
              <CardBody className={styles["section-title"]}>
                <ThemeText type={labels.section}>
                  {Copy.PROFILE_STATIC.ACCOUNT_INFO}
                </ThemeText>
              </CardBody>
              <Error>
                <CardBody className={styles["section-content"]}>
                  <AccountInformation style={style} />
                </CardBody>
              </Error>
            </Card>
          </Col>
          <Col xs="1" md="1-2" style={{marginBottom: "15px"}}>
            <Card className={styles.section} style={{height: "100%"}}>
              <CardBody className={styles["section-title"]}>
                <ThemeText type={labels.section}>
                  {Copy.PROFILE_STATIC.CARD_ON_FILE_TEXT}
                </ThemeText>
              </CardBody>
              <Error>
                <CardBody className={styles["section-content"]}>
                  <CardRoutes style={style} />
                </CardBody>
              </Error>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default withTemplate(Profile, "profile");
