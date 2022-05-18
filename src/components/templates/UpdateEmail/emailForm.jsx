import React from "react";
import {Formik, Form} from "formik";
import {Schemas, Copy} from "utils";
import {FooterButton} from "components/fragments";
import {Field, ThemeText as Text, View} from "components/elementsThemed";
import {withTemplate} from "components/hocs";
import css from "../form.module.scss";

const {Input} = Field;

const UpdateEmail = ({onSuccess, message, email = "", style}) => {
  const update = async (values, actions) => {
    actions.setStatus("");
    try {
      await onSuccess({email: values.email.trim()});
    } catch (e) {
      actions.setStatus(e.data);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      validateOnChange={false}
      initialStatus={message}
      initialValues={{email}}
      validationSchema={Schemas.EmailSchema}
      onSubmit={update}
      render={({errors, values, status, setFieldValue, isSubmitting}) => (
        <View
          type={style.views.background}
          className={css.form}
          Component={Form}
        >
          <div className={css["fields-container"]}>
            <Input
              label={Copy.UPDATE_EMAIL_STATIC.EMAIL_INPUT_LABEL}
              name="email"
              type={style.inputs.standard}
              error={errors.email}
              value={values.email}
              placeholder={Copy.UPDATE_EMAIL_STATIC.EMAIL_INPUT_PLACEHOLDER}
              onChange={(e) => setFieldValue("email", e.target.value)}
              inputMode="email"
            />
            <div>
              {status && <Text type={style.labels.error}>{status}</Text>}
            </div>
          </div>

          <FooterButton
            type={style.cells.bottom}
            htmlType="submit"
            disabled={isSubmitting}
          >
            {Copy.UPDATE_EMAIL_STATIC.CONFIRM_BUTTON_TEXT}
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(UpdateEmail, "signin");
