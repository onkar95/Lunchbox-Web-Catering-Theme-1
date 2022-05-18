import React from "react";
import {Formik, Form} from "formik";
import {axios, Schemas, Copy} from "../../../utils";
import {FooterButton} from "../../fragments";
import {Field, ThemeText, View} from "../../elementsThemed";
import {withTemplate} from "../../hocs";
import styles from "../form.module.css";

const {Input} = Field;

const VerifyEmailForm = ({onSuccess, email, style, message}) => {
  const verifyEmail = async ({code}, actions) => {
    actions.setFieldError("code", "");
    actions.setStatus("");
    try {
      const {data} = await axios.methods.post("/pincode/verify", {
        email,
        pinCode: code,
      });
      onSuccess && onSuccess(data);
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
        code: "",
      }}
      validationSchema={Schemas.EmailCodeSchema}
      initialStatus={message}
      onSubmit={verifyEmail}
      render={({errors, values, status, setFieldValue, isSubmitting}) => (
        <View
          type={style.views.background}
          className={styles.form}
          Component={Form}
        >
          <div className={styles["fields-container"]}>
            <Input
              label={Copy.FORGOT_PASSWORD_STATIC.VERIFY_EMAIL_INPUT_LABEL}
              name="code"
              type={style.inputs.standard}
              error={errors.code}
              value={values.code}
              placeholder={
                Copy.FORGOT_PASSWORD_STATIC.VERIFY_EMAIL_INPUT_PLACEHOLDER
              }
              onChange={(e) => setFieldValue("code", e.target.value)}
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
            {Copy.FORGOT_PASSWORD_STATIC.VERIFY_EMAIL_BUTTON_TEXT}
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(VerifyEmailForm, "email");
