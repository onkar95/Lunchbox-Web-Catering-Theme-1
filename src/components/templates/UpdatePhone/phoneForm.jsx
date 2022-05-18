import React from "react";
import {Formik, Form} from "formik";
import {axios, Schemas, Copy} from "../../../utils";
import {FooterButton} from "../../fragments";
import {Field, ThemeText, View} from "../../elementsThemed";
import {withTemplate} from "../../hocs";
import styles from "../form.module.css";

const {Input} = Field;

const PhoneForm = ({onSuccess, token, style, ...props}) => {
  const sendCode = async (values, actions) => {
    actions.setFieldError("phone", "");
    actions.setStatus("");
    try {
      await axios.methods.post("/pincode/send", values, {
        headers: {authorization: token},
      });
      onSuccess && onSuccess(values.phone);
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
        phone: "",
      }}
      validationSchema={Schemas.PhoneSchema}
      onSubmit={sendCode}
      render={({errors, values, status, setFieldValue, isSubmitting}) => (
        <View
          type={style.views.background}
          className={styles.form}
          Component={Form}
        >
          <div className={styles["fields-container"]}>
            <Input
              label={Copy.UPDATE_PHONE_STATIC.INPUT_LABEL}
              name="phone"
              type={style.inputs.standard}
              error={errors.phone}
              value={values.phone}
              placeholder={Copy.UPDATE_PHONE_STATIC.INPUT_PLACEHOLDER}
              onChange={(e) => setFieldValue("phone", e.target.value)}
              inputMode="tel"
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
            {Copy.UPDATE_PHONE_STATIC.SEND_PIN_BUTTON_TEXT}
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(PhoneForm, "phone");
