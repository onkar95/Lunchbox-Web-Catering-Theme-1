import React from "react";
import {Formik, Form} from "formik";
import {axios, Schemas, Copy} from "../../../utils";
import {FooterButton} from "../../fragments";
import {Field, ThemeText, View} from "../../elementsThemed";
import {withTemplate} from "../../hocs";
import styles from "../form.module.css";
import {usePatronContext} from "../../providers/patron";

const {Input} = Field;

const UpdatePasswordForm = ({onSuccess, patron, style}) => {
  const {accessToken} = usePatronContext();
  const verifyEmail = async ({password}, actions) => {
    actions.setFieldError("password", "");
    actions.setFieldError("passwordConfirm", "");
    actions.setStatus("");
    try {
      await axios.methods.put(
        "/patron",
        {password},
        {headers: {authorization: accessToken || patron.token}},
      );
      onSuccess && onSuccess({...patron});
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
        password: "",
        passwordConfirm: "",
      }}
      validationSchema={Schemas.UpdatePasswordSchema}
      onSubmit={verifyEmail}
      render={({errors, values, status, setFieldValue, isSubmitting}) => (
        <View
          type={style.views.background}
          className={styles.form}
          Component={Form}
        >
          <div className={styles["fields-container"]}>
            <Input
              label={Copy.FORGOT_PASSWORD_STATIC.INPUT_LABEL}
              name={Copy.FORGOT_PASSWORD_STATIC.PASSWORD_INPUT_NAME}
              htmlType="password"
              type={style.inputs.standard}
              error={errors.password}
              value={values.password}
              placeholder={Copy.FORGOT_PASSWORD_STATIC.INPUT_PLACEHOLDER}
              onChange={(e) => setFieldValue("password", e.target.value)}
            />
            <br />
            <Input
              label={Copy.FORGOT_PASSWORD_STATIC.CONFIRM_INPUT_LABEL}
              name={Copy.FORGOT_PASSWORD_STATIC.CONFIRM_PASSWORD_INPUT_NAME}
              htmlType="password"
              type={style.inputs.standard}
              error={errors.passwordConfirm}
              value={values.passwordConfirm}
              placeholder="Enter Password Here"
              onChange={(e) => setFieldValue("passwordConfirm", e.target.value)}
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
            Update Password
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(UpdatePasswordForm, "password");
