import React from "react";
import {Formik, Form} from "formik";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import {
  Elements,
  ElementsThemed,
  Fragments,
  HOCs,
  Providers,
  Templates,
} from "components";
import {usePatronContext} from "components/providers/patron";
import {axios, Schemas, Copy, Routes} from "utils";
import CardRoutes from "./cards";
import styles from "./profile.module.scss";
import { getValue, parseAndReplaceDigitInString } from "utils/helpers/string";

const {
  Condition,
  Layout: {Flex},
} = Elements;
const {
  Field: {Input, Field},
  ThemeText,
  View,
  Dialogue,
} = ElementsThemed;
const {
  FooterButton,
  Routes: {RouteWithProps},
  BackButton,
} = Fragments;
const {
  ForgotPassword: {UpdatePasswordForm},
  UpdatePhone,
  UpdateEmail,
} = Templates;
const {withTemplate} = HOCs;
const {
  Notifications: {useNotification},
} = Providers;

const renderNotification = (type, message) => (
  <Dialogue type={type}>
    {({labelTextStyles, view}) => (
      <View type={view} style={{padding: "10px"}}>
        <div>
          <ThemeText type={labelTextStyles.secondary}>
            {Copy.PROFILE_STATIC.SUCCESS_HEADER}
          </ThemeText>
        </div>
        <div>
          <ThemeText type={labelTextStyles.primary}>{message}</ThemeText>
        </div>
      </View>
    )}
  </Dialogue>
);

const AccountInformation = ({style}) => {
  const {add} = useNotification();
  const {patron, accessToken, updatePatron} = usePatronContext();

  const notice = (message) => {
    add(renderNotification(style.dialogues.confirm, message));
  };

  return (
    <MemoryRouter initialEntries={["/"]} initialIndex={0}>
      <Route
        render={({location, history}) => (
          <>
            <Condition is={location.pathname !== "/"}>
              <Flex
                style={{padding: "10px 10px 0px 10px"}}
                direction="row"
                align="center"
              >
                <BackButton onClick={history.goBack} />
              </Flex>
            </Condition>
            <Flex direction="col" grow="1">
              <Switch>
                <RouteWithProps exact path="/" component={AccountDetails} />
                <RouteWithProps
                  path={Routes.UPDATE_PASSWORD}
                  component={UpdatePasswordForm}
                  patron={patron}
                  accessToken={accessToken}
                  onSuccess={() => {
                    history.goBack();
                    notice(Copy.PROFILE_STATIC.PASSWORD_UPDATED_MESSAGE);
                  }}
                />
                <RouteWithProps
                  path={Routes.UPDATE_EMAIL}
                  component={UpdateEmail}
                  onSuccess={() => history.goBack()}
                />
                <RouteWithProps
                  path={Routes.UPDATE_PHONE}
                  component={UpdatePhone}
                  token={accessToken}
                  onSuccess={(data) => {
                    updatePatron({phone: data.phone});
                    notice(Copy.PROFILE_STATIC.PHONE_NUMBER_UPDATED_MESSAGE);
                    history.goBack();
                  }}
                />
                <RouteWithProps
                  path={Routes.FETCH_CARDS}
                  component={CardRoutes}
                  token={accessToken}
                  onSuccess={history.goBack}
                  style={style}
                />
              </Switch>
            </Flex>
          </>
        )}
      />
    </MemoryRouter>
  );
};

const AccountDetails = withTemplate(({style, ...props}) => {
  const {add} = useNotification();
  const {patron, updatePatron} = usePatronContext();
  const {firstName, lastName, email, phone} = patron;

  return (
    <Formik
      validateOnChange={false}
      initialValues={{
        email: email.value || email,
        firstName,
        lastName,
      }}
      validationSchema={Schemas.PatronNameSchema}
      onSubmit={async (values, actions) => {
        try {
          await axios.methods.put("/patron", {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
          });
          updatePatron({
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
          });
          add(
            renderNotification(
              style.dialogues.success,
              Copy.PROFILE_STATIC.INFORMATION_UPDATED_MESSAGE,
            ),
          );
        } catch (error) {
          console.log(error);
          actions.setStatus(error.message);
        } finally {
          actions.setSubmitting(false);
        }
      }}
      render={({errors, values, ...formProps}) => (
        <View
          type={style.views.background}
          className={styles.form}
          Component={Form}
        >
          <div className={styles["fields-container"]}>
            <Input
              label={Copy.PROFILE_STATIC.ACCOUNT_FIRST_NAME_INPUT_LABEL}
              name="firstName"
              type={style.inputs.standard}
              error={errors.firstName}
              value={values.firstName}
              placeholder={
                Copy.PROFILE_STATIC.ACCOUNT_FIRST_NAME_INPUT_PLACEHOLDER
              }
              onChange={(e) =>
                formProps.setFieldValue("firstName", parseAndReplaceDigitInString(getValue(e)))
              }
            />

            <Input
              label={Copy.PROFILE_STATIC.ACCOUNT_LAST_NAME_INPUT_LABEL}
              name="lastName"
              type={style.inputs.standard}
              error={errors.lastName}
              value={values.lastName}
              placeholder={
                Copy.PROFILE_STATIC.ACCOUNT_LAST_NAME_INPUT_PLACEHOLDER
              }
              onChange={(e) =>
                formProps.setFieldValue("lastName", parseAndReplaceDigitInString(getValue(e)))
              }
            />

            <Input
              label={Copy.PROFILE_STATIC.ACCOUNT_EMAIL_INPUT_LABEL}
              name="email"
              type={style.inputs.standard}
              error={errors.email}
              value={values.email}
              placeholder={Copy.PROFILE_STATIC.ACCOUNT_EMAIL_INPUT_PLACEHOLDER}
              onChange={(e) => formProps.setFieldValue("email", e.target.value)}
              inputMode="email"
            />

            <Field
              type={style.cells.form}
              label={Copy.PROFILE_STATIC.ACCOUNT_PHONE_INPUT_LABEL}
              value={phone.value || phone}
              buttonProps={{
                children: "Edit",
                htmlType: "button",
                onClick: () => props.history.push(Routes.UPDATE_PHONE),
              }}
            />

            <Field
              type={style.cells.form}
              label={Copy.PROFILE_STATIC.ACCOUNT_PASSWORD_INPUT_LABEL}
              value="********"
              buttonProps={{
                children: "Edit",
                htmlType: "button",
                onClick: () => props.history.push(Routes.UPDATE_PASSWORD),
              }}
            />

            <Condition is={formProps.status}>
              <ThemeText type={style.labels.error}>
                {formProps.status}
              </ThemeText>
            </Condition>
          </div>

          <FooterButton
            type={style.cells.bottom}
            htmlType="submit"
            disabled={formProps.isSubmitting}
          >
            {Copy.PROFILE_STATIC.ACCOUNT_UPDATE_BUTTON_TEXT}
          </FooterButton>
        </View>
      )}
    />
  );
}, "signin");

export default AccountInformation;
