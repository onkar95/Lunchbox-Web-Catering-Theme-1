import React, {useState, useRef} from "react";
import {Link} from "react-router-dom";
import {Formik, Form} from "formik";
import {Copy, Schemas, config} from "utils"; // images was prev imported, but no image config in catering.
import {
  GoogleButton,
  AppleButton,
  FacebookButton,
  InlineLoader,
  Condition as If,
} from "components/elements";
import {FooterButton, Loader, Image as ImageComp} from "components/fragments";
import {useGlobalConfig} from "components/providers/GlobalConfig";
import {
  Field,
  ThemeText as Text,
  View,
  Button,
} from "components/elementsThemed";
import {withTemplate} from "components/hocs";
import styles from "../form.module.scss";

import {handleAuthError} from "./utils";

const {Image} = ImageComp;

const {Input} = Field;

const {LoginSchema, EmailSchema} = Schemas;

const isAppleEnabled = config.auth.apple.enabled && config.auth.apple.client_id;
const isGoogleEnabled =
  config.auth.google.enabled && config.auth.google.client_id;
const isFacebookEnabled =
  config.auth.facebook.enabled && config.auth.facebook.app_id;

const lunchboxLoginFooterIcon = config?.images?.lunchbox_login_footer;

const ValidateLogin = ({
  onValidate,
  onSuccess,
  style: {inputs, labels, cells, views, buttons},
  lastLocation,
  fetchingSocial,
  trackerPath,
}) => {
  const {isAppleSignUp, isFacebookSignUp} = useGlobalConfig();
  const [step, setStep] = useState(0);
  const inputRef = useRef();

  const socialLogin = async (data, type) => {
    if (data.error) console.error(handleAuthError(data, type));
    try {
      await onSuccess({...data, type}, true);
    } catch (e) {
      console.log(e);
    }
  };

  const validatePatron = async (values, actions) => {
    try {
      await onValidate(values.email);
      setStep(1);
      inputRef.current.focus();
    } catch (e) {
      console.log(e);
      actions.setStatus(e.data);
    }
  };

  const signIn = async (values, actions) => {
    try {
      await onSuccess(values.password);
    } catch (e) {
      console.log(e);
      actions.setStatus(e.data);
    }
  };

  const onSubmit = async (values, actions) => {
    values.email = values.email.trim();
    const method = step === 1 ? signIn : validatePatron;
    try {
      await method(values, actions);
    } catch (e) {
      console.log(e);
      actions.setStatus(e.data);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const trackerClassName = `${trackerPath}-login-step-${step <= 0 ? 1 : 2}`;

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={step ? LoginSchema : EmailSchema}
      onSubmit={onSubmit}
    >
      {({errors, values, status, setFieldValue, isSubmitting}) => (
        <View type={views.background} className={styles.form} Component={Form}>
          <div className={styles["fields-container"]}>
            <If is={fetchingSocial}>
              <Loader />
            </If>
            <If is={!fetchingSocial}>
              <>
                <Input
                  label={Copy.VALIDATE_LOGIN_STATIC.INPUT_LABEL}
                  name="email"
                  type={inputs.standard}
                  error={errors.email}
                  value={values.email}
                  placeholder={Copy.VALIDATE_LOGIN_STATIC.INPUT_PLACEHOLDER}
                  onChange={(e) => {
                    setFieldValue("email", e.target.value);
                    setStep(0);
                  }}
                  inputMode="email"
                />
                {step !== 1 && (
                  <div className={styles["social-btns"]}>
                    <>
                      {isGoogleEnabled && (
                        <GoogleButton
                          socialLogin={socialLogin}
                          clientId={config.auth.google.client_id}
                        />
                      )}
                      {isAppleEnabled && (
                        <AppleButton
                          lastLocation={lastLocation}
                          socialLogin={socialLogin}
                          clientId={config.auth.apple.client_id}
                        />
                      )}
                      {isFacebookEnabled && (
                        <FacebookButton
                          lastLocation={lastLocation}
                          socialLogin={socialLogin}
                          appId={config.auth.facebook.app_id}
                        />
                      )}
                    </>
                  </div>
                )}
                {step === 1 && (
                  <>
                    <Input
                      label={Copy.PASSWORD_STATIC.INPUT_LABEL}
                      name="password"
                      inputRef={inputRef}
                      htmlType="password"
                      type={inputs.standard}
                      error={errors.password}
                      value={values.password}
                      placeholder={Copy.PASSWORD_STATIC.INPUT_PLACEHOLDER}
                      onChange={(e) =>
                        setFieldValue("password", e.target.value)
                      }
                    />
                    <div>
                      <Button type={buttons.link} htmlType="button">
                        <Link to="/forgot-password">
                          {Copy.PASSWORD_STATIC.FORGOT_PASSWORD_BUTTON_TEXT}
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </>
            </If>
            <div>{status && <Text type={labels.error}>{status}</Text>}</div>
          </div>

          <Image
            className={styles["footer-logo"]}
            src={lunchboxLoginFooterIcon}
            alt="lunchbox logo"
          />
          <div className={styles.terms}>
            <Text type={labels.terms}>
              By logging in, you agree to Lunchbox&apos;s
              <br />
              <Button
                type={buttons.link}
                Component="a"
                href="https://www.lunchbox.io/terms-privacy"
                target="_blank"
              >
                Terms of Service & Privacy Policy
              </Button>
            </Text>
          </div>

          <FooterButton
            type={cells.bottom}
            htmlType="submit"
            className={trackerClassName}
            disabled={
              isSubmitting ||
              fetchingSocial ||
              isAppleSignUp ||
              isFacebookSignUp
            }
          >
            {isSubmitting ||
            fetchingSocial ||
            isAppleSignUp ||
            isFacebookSignUp ? (
              <InlineLoader size={24} />
            ) : (
              Copy.VALIDATE_LOGIN_STATIC.BUTTON_TEXT
            )}
          </FooterButton>
        </View>
      )}
    </Formik>
  );
};

export default withTemplate(ValidateLogin, "signin");
