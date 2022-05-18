import React from "react";
import {ElementsThemed, Fragments, HOCs} from "components";
import {Layout} from "components/elements";
import {LoginSignup} from "components/templates/LoginSignup";
import {LoginHeader} from "components/templates/LoginHeader";
import {config, Copy} from "utils";
import css from "./login.module.css";

const {ThemeText, View} = ElementsThemed;
const {withTemplate} = HOCs;

const {
  Card: {CardBody},
  BackButton,
} = Fragments;

const {Flex} = Layout;

const displayLoginHeader = config?.login_signup?.header === "Type1";

const Login = ({style, onComplete}) => (
  <div className={css.container}>
    <View type={style.views.header} Component={CardBody} className={css.nav}>
      <BackButton onClick={() => onComplete()} />
      <ThemeText type={style.labels.title}>
        {Copy.LOGIN_STATIC.LOGIN_SIGN_UP_BUTTON_TEXT}
      </ThemeText>
    </View>

    {displayLoginHeader && (
      <Flex align="center">
        <LoginHeader type={style.cells.header} />
      </Flex>
    )}
    <LoginSignup onComplete={onComplete} />
  </div>
);

export default withTemplate(Login, "signin");
