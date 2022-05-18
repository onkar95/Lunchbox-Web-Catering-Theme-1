import React from "react";
import {Image} from "components/elements";
import {View, ThemeText} from "components/elementsThemed";
import {useCell} from "hooks";

import {config, Copy} from "utils";

import css from "./loginHeader.module.scss";

const loginHeader = config.images?.art_login_header;

/**
 * Return a loyalty header with the attributes set
 *
 * @param {object} props
 * @param {string} props.type - Cell type from theme file
 * @param {string} props.center - whether to center ThemeText or not
 */
const LoginHeader = ({type, center = true}) => {
  const {views, labelTextStyles} = useCell(type);

  return (
    <View type={views.background} className={css.loginHeader}>
      {loginHeader && (
        <Image
          className={css["loginHeader-image"]}
          src={loginHeader}
          alt="Login header"
        />
      )}
      <View type={views.background} className={css["loginHeader-description"]}>
        <ThemeText
          className={center && css["loginHeader-description-ThemeText"]}
          type={labelTextStyles.primary}
        >
          {Copy.LOGIN_SIGNUP_STATIC.HEADER}
        </ThemeText>
        <ThemeText
          className={center && css["loginHeader-description-ThemeText"]}
          type={labelTextStyles.secondary}
        >
          {Copy.LOGIN_SIGNUP_STATIC.SUBHEADER}
        </ThemeText>
      </View>
    </View>
  );
};
export default LoginHeader;
