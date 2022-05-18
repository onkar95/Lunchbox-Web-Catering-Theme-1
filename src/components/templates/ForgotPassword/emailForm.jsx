import React from "react";
import {Formik, Form} from "formik";
import {axios, Schemas, Copy} from "../../../utils";
import {FooterButton} from "../../fragments";
import {Field, ThemeText, View} from "../../elementsThemed";
import {withTemplate} from "../../hocs";
import styles from "../form.module.css";

const {Input} = Field;

const ForgotPassword = ({onSuccess, style}) => {
  const sendCode = async (values, actions) => {
    actions.setFieldError("email", "");
    actions.setStatus("");
    try {
      await axios.methods.post("/patron/forgot-password", values);
      onSuccess && onSuccess(values.email);
      actions.resetForm();
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
        email: "",
      }}
      validationSchema={Schemas.EmailSchema}
      onSubmit={sendCode}
      render={({errors, values, status, setFieldValue, isSubmitting}) => (
        <View
          type={style.views.background}
          className={styles.form}
          Component={Form}
        >
          <div className={styles["fields-container"]}>
            <Input
              label={Copy.FORGOT_PASSWORD_STATIC.EMAIL_INPUT_LABEL}
              name="email"
              type={style.inputs.standard}
              error={errors.email}
              value={values.email}
              placeholder={Copy.FORGOT_PASSWORD_STATIC.EMAIL_INPUT_PLACEHOLDER}
              onChange={(e) => setFieldValue("email", e.target.value)}
              inputMode="email"
            />

            <div>
              {status && (
                <ThemeText type={style.labels.error}>{status}</ThemeText>
              )}
            </div>
          </div>
          <FooterButton
            type={style.cells.bottom}
            htmlType="submit"
            disabled={isSubmitting}
          >
            {Copy.FORGOT_PASSWORD_STATIC.SEND_PIN_BUTTON_TEXT}
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(ForgotPassword, "password");
