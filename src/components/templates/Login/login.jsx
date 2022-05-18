import React from "react";
import {Link} from "react-router-dom";
import {Formik, Form} from "formik";
import {axios, Schemas, Copy} from "utils";
import {Fragments, ElementsThemed, HOCs} from "components";
import styles from "../form.module.css";

const {FooterButton} = Fragments;
const {
  Field: {Input},
  ThemeText,
  ThemeButton,
  View,
} = ElementsThemed;
const {withTemplate} = HOCs;

const Login = ({onSuccess, onUpdatePassword, style, children}) => {
  const login = async (values, actions) => {
    actions.setStatus("");
    try {
      const res = await axios.methods.post("/patron/sign-in", values);
      onSuccess && onSuccess(res.data);
    } catch (error) {
      const e = axios.handleError(error);
      if (e.status === 422) {
        onUpdatePassword && onUpdatePassword(values.email, e.data);
      } else {
        actions.setStatus(e.data);
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      validateOnChange={false}
      initialValues={{email: "", password: ""}}
      validationSchema={Schemas.LoginSchema}
      onSubmit={login}
      render={({errors, values, status, setFieldValue, isSubmitting}) => (
        <View
          type={style.views.background}
          className={styles.form}
          Component={Form}
        >
          <div className={styles["fields-container"]}>
            <Input
              label={Copy.LOGIN_STATIC.EMAIL_INPUT_LABEL}
              name="email"
              type={style.inputs.standard}
              error={errors.email}
              value={values.email}
              placeholder={Copy.LOGIN_STATIC.EMAIL_INPUT_PLACEHOLDER}
              onChange={(e) => setFieldValue("email", e.target.value)}
              inputMode="email"
            />

            <Input
              label={Copy.LOGIN_STATIC.INPUT_LABEL}
              name="password"
              htmlType="password"
              type={style.inputs.standard}
              error={errors.password}
              value={values.password}
              placeholder={Copy.LOGIN_STATIC.INPUT_PLACEHOLDER}
              onChange={(e) => setFieldValue("password", e.target.value)}
            />

            <div>
              {status && (
                <ThemeText type={style.labels.error}>{status}</ThemeText>
              )}
            </div>
            <div>
              <ThemeButton
                type={style.buttons.link}
                Component={Link}
                to="/forgot-password"
                htmlType="button"
              >
                {Copy.LOGIN_STATIC.FORGOT_PASSWORD_BUTTON_TEXT}
              </ThemeButton>
            </div>
            {process.env.CLIENT === "bareburger" && (
              <ThemeText type={style.labels.terms}>
                {Copy.LOGIN_STATIC.ALREADY_HAVE_APP_LOGIN_TEXT}
              </ThemeText>
            )}
            {children && children}
          </div>

          <div className={styles.terms}>
            <ThemeText type={style.labels.terms}>
              By logging in, you agree to Lunchbox&apos;s
              <br />
              <ThemeButton
                type={style.buttons.link}
                Component="a"
                href="https://www.lunchbox.io/terms-privacy"
              >
                Terms of Service & Privacy Policy
              </ThemeButton>
            </ThemeText>
          </div>
          <FooterButton
            type={style.cells.bottom}
            htmlType="submit"
            disabled={isSubmitting}
          >
            Login
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(Login, "signin");
