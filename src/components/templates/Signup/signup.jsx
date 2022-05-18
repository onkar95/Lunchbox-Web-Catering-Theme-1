import React from "react";
import {Formik, Form} from "formik";
import {axios, Schemas, Copy} from "../../../utils";
import {FooterButton} from "../../fragments";
import {Field, ThemeText, View, ThemeButton} from "../../elementsThemed";
import {withTemplate} from "../../hocs";
import styles from "../form.module.css";
import { getValue, parseAndReplaceDigitInString } from "utils/helpers/string";

const {Input} = Field;

const Signup = ({onSuccess, style, patron, location: {state}}) => {
  const signUp = async (values, actions) => {
    actions.setStatus("");
    try {
      const res = await axios.methods.post("/patron/sign-up", values);
      onSuccess && onSuccess(res.data);
    } catch (error) {
      const e = axios.handleError(error);
      actions.setStatus(e.data);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        email: state?.email ?? patron.email ?? "",
        firstName: "",
        lastName: "",
        password: "",
        phone: "",
      }}
      validationSchema={Schemas.SignUpSchema}
      onSubmit={signUp}
      render={({errors, values, ...formProps}) => (
        <View
          type={style.views.background}
          className={styles.form}
          Component={Form}
        >
          <div className={styles["fields-container"]}>
            <Input
              label={Copy.SIGN_UP_STATIC.FIRST_NAME_LABEL}
              name="firstName"
              type={style.inputs.standard}
              error={errors.firstName}
              value={values.firstName}
              placeholder={Copy.SIGN_UP_STATIC.FIRST_NAME_PLACEHOLDER}
              onChange={(e) =>
                formProps.setFieldValue("firstName", parseAndReplaceDigitInString(getValue(e)))
              }
            />
            <Input
              label={Copy.SIGN_UP_STATIC.LAST_NAME_LABEL}
              name="lastName"
              type={style.inputs.standard}
              error={errors.lastName}
              value={values.lastName}
              placeholder={Copy.SIGN_UP_STATIC.LAST_NAME_PLACEHOLDER}
              onChange={(e) =>
                formProps.setFieldValue("lastName", parseAndReplaceDigitInString(getValue(e)))
              }
            />
            <Input
              label={Copy.SIGN_UP_STATIC.EMAIL_LABEL}
              name="email"
              type={style.inputs.standard}
              error={errors.email}
              value={values.email}
              placeholder={Copy.SIGN_UP_STATIC.EMAIL_PLACEHOLDER}
              onChange={(e) => formProps.setFieldValue("email", e.target.value)}
              inputMode="email"
            />
            <Input
              label={Copy.SIGN_UP_STATIC.PHONE_LABEL}
              name="phone"
              type={style.inputs.standard}
              error={errors.phone}
              value={values.phone}
              placeholder={Copy.SIGN_UP_STATIC.PHONE_PLACEHOLDER}
              onChange={(e) => formProps.setFieldValue("phone", e.target.value)}
              inputMode="tel"
            />
            <Input
              label={Copy.SIGN_UP_STATIC.PASSWORD_LABEL}
              name="password"
              htmlType="password"
              type={style.inputs.standard}
              error={errors.password}
              value={values.password}
              placeholder={Copy.SIGN_UP_STATIC.PASSWORD_PLACEHOLDER}
              onChange={(e) =>
                formProps.setFieldValue("password", e.target.value)
              }
            />

            {formProps.status && (
              <ThemeText type={style.labels.error}>
                {formProps.status}
              </ThemeText>
            )}
          </div>

          <div className={styles.terms}>
            <ThemeText type={style.labels.terms}>
              By registering, you agree to Lunchbox&apos;s
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
            disabled={formProps.isSubmitting}
          >
            {Copy.SIGN_UP_STATIC.SIGN_UP_BUTTON_TEXT}
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(Signup, "signin");
