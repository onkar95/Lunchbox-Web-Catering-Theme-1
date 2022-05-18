import React from "react";
import {Formik, Form} from "formik";
import {Schemas, Copy, helpers} from "utils";
import {FooterButton} from "components/fragments";
import {Field, Text, View, Button} from "components/elementsThemed";
import {withTemplate} from "components/hocs";
import {
  PATRON_AUTH_PINCODE,
  PATRON_SEND_PINCODE,
  HANDLE_ERROR,
} from "utils/api";
import css from "../form.module.scss";

const {Input} = Field;

const VerifyPhoneCode = ({onSuccess, email, token, style}) => {
  const [requesting, setRequesting] = React.useState(false);

  const verifyPhone = async (values, actions) => {
    actions.setFieldError("code", "");
    actions.setStatus("");
    try {
      const {data} = await PATRON_AUTH_PINCODE(
        {email, pinCode: values.code},
        token ? {headers: {authorization: token}} : undefined,
      );
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      const e = HANDLE_ERROR(error);
      actions.setStatus(e.data);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const resend = async () => {
    setRequesting(true);
    try {
      await PATRON_SEND_PINCODE({email}, {headers: {authorization: token}});
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
          className={css.form}
          Component={Form}
        >
          <div className={css["fields-container"]}>
            <Input
              label={helpers.stringReplacer(
                Copy.UPDATE_EMAIL_STATIC.VERIFY_CODE_INPUT_LABEL,
                [{replaceTarget: "{email}", replaceValue: email}],
              )}
              name="code"
              type={style.inputs.standard}
              error={errors.code}
              value={values.code}
              placeholder={
                Copy.UPDATE_EMAIL_STATIC.VERIFY_CODE_INPUT_PLACEHOLDER
              }
              onChange={(e) => setFieldValue("code", e.target.value)}
            />
            <div>
              {status && <Text type={style.labels.error}>{status}</Text>}
            </div>
            <Button
              type={style.buttons.alternate}
              htmlType="button"
              style={{float: "right"}}
              disabled={requesting}
              onClick={resend}
            >
              Resend Pin
            </Button>
          </div>
          <FooterButton
            type={style.cells.bottom}
            htmlType="submit"
            disabled={isSubmitting}
          >
            {Copy.UPDATE_EMAIL_STATIC.VERIFY_CODE_BUTTON_TEXT}
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(VerifyPhoneCode, "pincode");
