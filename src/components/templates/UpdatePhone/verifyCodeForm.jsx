import React from "react";
import {Formik, Form} from "formik";
import {axios, Schemas, Copy, helpers} from "../../../utils";
import {FooterButton} from "../../fragments";
import {Field, ThemeText, View, ThemeButton} from "../../elementsThemed";
import {withTemplate} from "../../hocs";
import styles from "../form.module.css";

const {Input} = Field;

const VerifyPhoneCode = ({onSuccess, phone, token, style}) => {
  const [requesting, setRequesting] = React.useState(false);

  const verifyPhone = async (values, actions) => {
    actions.setFieldError("code", "");
    actions.setStatus("");
    try {
      await axios.methods.post(
        "/pincode/verify",
        {phone, pinCode: values.code},
        {headers: {authorization: token}},
      );
      onSuccess && onSuccess();
    } catch (error) {
      const e = axios.handleError(error);
      actions.setStatus(e.data);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const resend = async () => {
    setRequesting(true);
    try {
      await axios.methods.post(
        "/pincode/send",
        {phone},
        {headers: {authorization: token}},
      );
    } finally {
      setRequesting(false);
    }
  };

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        code: "",
      }}
      validationSchema={Schemas.PhoneCodeSchema}
      onSubmit={verifyPhone}
      render={({errors, values, status, setFieldValue, isSubmitting}) => (
        <View
          type={style.views.background}
          className={styles.form}
          Component={Form}
        >
          <div className={styles["fields-container"]}>
            <Input
              label={helpers.stringReplacer(
                Copy.UPDATE_PHONE_STATIC.VERIFY_CODE_INPUT_LABEL,
                [{replaceTarget: "{phone}", replaceValue: phone}],
              )}
              name="code"
              type={style.inputs.standard}
              error={errors.code}
              value={values.code}
              placeholder={
                Copy.UPDATE_PHONE_STATIC.VERIFY_CODE_INPUT_PLACEHOLDER
              }
              onChange={(e) => setFieldValue("code", e.target.value)}
            />
            <div>
              {status && (
                <ThemeText type={style.labels.error}>{status}</ThemeText>
              )}
            </div>
            <ThemeButton
              type={style.buttons.alternate}
              htmlType="button"
              style={{float: "right"}}
              disabled={requesting}
              onClick={resend}
            >
              Resend Pin
            </ThemeButton>
          </div>
          <FooterButton
            type={style.cells.bottom}
            htmlType="submit"
            disabled={isSubmitting}
          >
            {Copy.UPDATE_PHONE_STATIC.VERIFY_CODE_CONFIRM_CODE_BUTTON_TEXT}
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(VerifyPhoneCode, "pincode");
