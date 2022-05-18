import React, {useRef, useEffect} from "react";
import {Formik, Form} from "formik";
import {Link} from "react-router-dom";
import {Copy} from "../../../utils";
import {FooterButton} from "../../fragments";
import {Field, ThemeText as Text, View, Button} from "../../elementsThemed";
import {withTemplate} from "../../hocs";
import css from "../form.module.scss";

const {Input} = Field;

const Password = ({
  onSuccess,
  style: {views, cells, labels, inputs, buttons},
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const login = async (values, actions) => {
    actions.setStatus("");
    try {
      await onSuccess(values.password);
    } catch (e) {
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
      }}
      onSubmit={login}
      render={({errors, values, status, setFieldValue, isSubmitting}) => (
        <View type={views.background} className={css.form} Component={Form}>
          <div className={css["fields-container"]}>
            <Input
              label={Copy.PASSWORD_STATIC.INPUT_LABEL}
              name="password"
              htmlType="password"
              inputRef={inputRef}
              type={inputs.standard}
              error={errors.password}
              value={values.password}
              placeholder={Copy.PASSWORD_STATIC.INPUT_PLACEHOLDER}
              onChange={(e) => setFieldValue("password", e.target.value)}
            />
            <div>
              <Button
                type={buttons.link}
                Component={Link}
                to="/forgot-password"
                htmlType="button"
                data-text="forgot-password-button"
              >
                {Copy.PASSWORD_STATIC.FORGOT_PASSWORD_BUTTON_TEXT}
              </Button>
            </div>
            <div>{status && <Text type={labels.error}>{status}</Text>}</div>
          </div>
          <FooterButton
            type={cells.bottom}
            htmlType="submit"
            disabled={isSubmitting}
          >
            {Copy.PASSWORD_STATIC.LOGIN_BUTTON_TEXT}
          </FooterButton>
        </View>
      )}
    />
  );
};

export default withTemplate(Password, "signin");
