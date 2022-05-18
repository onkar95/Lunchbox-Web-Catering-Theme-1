import React from "react";
import {Formik, Form} from "formik";
import {Schemas} from "utils";
import {FooterButton} from "components/fragments";
import {
  ThemeText as Text,
  View,
  Button,
  Field as FieldComps,
} from "components/elementsThemed";
import {withTemplate} from "components/hocs";
import {PATRON_SEND_PINCODE_BY_ACCOUNT} from "utils/api";
import {formatPhoneNumber} from "utils/helpers";
import {useActive} from "hooks";
import css from "../form.module.scss";

const {Input, Field} = FieldComps;

/**
 * @param {object} props
 * @param {string} props.account - account, either email or phone
 * @param {string} props.accountType - enum 'email' or 'phone'
 * @param {string} props.style - style information from theme.json file provided by withTemplate HOC
 * @param {string} props.message - An additional message to display to the user. Provided externally
 * @param {Function} props.onSuccess - Callback for action to happen after validation is successful
 * @param props.onUpdatePhone
 */
const Pincode = ({
  onSuccess,
  account,
  accountType,
  style,
  message,
  onUpdatePhone,
  trackerPath,
}) => {
  const {isActive: fetching, activate, deactivate} = useActive(false);
  const trackerClassName = `${trackerPath}-confirm-code`;
  const verify = async ({code}, actions) => {
    actions.setFieldError("code", "");
    actions.setStatus("");
    try {
      await onSuccess(code);
    } catch (e) {
      console.log(e);
      actions.setStatus(e.data);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const sendPin = async () => {
    activate();
    try {
      await PATRON_SEND_PINCODE_BY_ACCOUNT(account);
    } catch (e) {
      console.error(e);
    } finally {
      deactivate();
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
      onSubmit={verify}
      render={({errors, values, status, setFieldValue, isSubmitting}) => (
        <View
          type={style.views.background}
          className={css.form}
          Component={Form}
        >
          <div className={css["fields-container"]}>
            <Input
              label="Code"
              name="code"
              type={style.inputs.standard}
              error={errors.code}
              value={values.code}
              placeholder={`PIN sent to ${accountType}`}
              onChange={(e) => setFieldValue("code", e.target.value)}
            />
            <Field
              type={style.cells.form}
              label="Your PIN was sent to"
              value={
                accountType === "email"
                  ? account
                  : formatPhoneNumber(account.slice(1, 11))
              }
              buttonProps={{
                children: "Change",
                htmlType: "button",
                onClick: onUpdatePhone,
              }}
            />
            <div>
              {status && <Text type={style.labels.error}>{status}</Text>}
            </div>
            <Button
              type={style.buttons.alternate}
              htmlType="button"
              style={{float: "right"}}
              disabled={fetching}
              onClick={sendPin}
              data-test="button-resendPin"
            >
              Resend Pin
            </Button>
          </div>
          <FooterButton
            type={style.cells.bottom}
            htmlType="submit"
            disabled={isSubmitting}
            className={trackerClassName}
          >
            Confirm Code
          </FooterButton>
        </View>
      )}
    />
  );
};
export default withTemplate(Pincode, "pincode");
