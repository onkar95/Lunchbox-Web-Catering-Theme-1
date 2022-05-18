import React from "react";
import {MemoryRouter, Route, Switch, withRouter} from "react-router-dom";
import {AnimatePresence} from "framer-motion";
import {Routes as Router} from "components/fragments";
import {withTemplate} from "components/hocs";
import {Routes} from "utils";
import Controller from "../../Controllers";
import {SignUpConfirmation} from "../../../SignUpConfirmation";
import {Password} from "../../../Password";
import {ValidateLogin} from "../../../ValidateLogin";
import {ForgotPassword, UpdatePasswordForm} from "../../../ForgotPassword";
import {Pincode} from "../../../Pincode";
import {UpdateEmail} from "../../../UpdateEmail";
import {UpdatePhone} from "../../../UpdatePhone";
import {Signup} from "../../../Signup";
import css from "../login.module.css";
import {selectRoute} from "../utils";

const {RouteWithProps} = Router;

const baseProps = {
  className: css.route,
};
const inTransitionProps = {
  ...baseProps,
  animate: {
    x: 0,
  },
  exit: {
    x: "-100%",
  },
  initial: {
    x: "100%",
  },
  transition: {
    type: "tween",
  },
};

const Flow = ({
  style,
  transition = true,
  routeToLocationPage,
  history: browserHistory,
  lastLocation,
  trackerPath,
  ...props
}) => {
  const animationConfig = transition ? inTransitionProps : baseProps;
  const onNextStep = (history) => (step) => {
    let route = selectRoute(step);
    /**
     * Explicitly passing the email instead of step number. This
     * is a specific case when we are signing up and we enter an email
     * but the user is not found. We want to keep this email and any other
     * information in the "step" obj to prefill the sign up page
     *
     * NOTE: See src/components/templates/LoginSignup/Controllers/type2.jsx line 89
     */
    if (step.email) {
      route = "/sign-up";
    }
    // tracked from login.jsx to allow us to update header text
    if (props.onUpdateRoute) props.onUpdateRoute(route);
    history.replace({
      pathname: route,
      /**
       * This is where you can pass more information to prefill the next page
       * e.g. email, phone, first and last name
       */
      state: {email: step.email},
    });
  };

  return (
    <MemoryRouter initialEntries={[Routes.ROOT]}>
      <Route
        render={({location, history}) => (
          <Controller
            onComplete={props.onComplete}
            onLoginComplete={props.onLoginComplete}
            onSignupComplete={props.onSignupComplete}
            onNextStep={onNextStep(history)}
          >
            {({
              onSignupSuccess,
              onUpdateSuccess,
              onConfirmSignup,
              onForgotPasswordSuccess,
              onUpdate,
              onSocialLogin,
              onLogin,
              onUpdatePhone,
              validatePatron,
              verifyPincode,
              fetchingSocial,
              token,
              patron,
              email,
              phone,
              account,
              accountType,
              message,
            }) => (
              <div className={css.content}>
                <AnimatePresence initial={false}>
                  <Switch location={location} key={location.pathname}>
                    <RouteWithProps
                      path={Routes.SIGN_UP}
                      component={Signup}
                      patron={patron}
                      email={email}
                      phone={phone}
                      trackerPath={trackerPath}
                      onSuccess={onSignupSuccess}
                      animation={animationConfig}
                    />
                    <RouteWithProps
                      path={Routes.SIGN_UP_CONFIRMATION}
                      component={SignUpConfirmation}
                      onConfirm={() => {
                        onConfirmSignup();
                        if (routeToLocationPage) {
                          browserHistory.replace("/");
                        }
                      }}
                    />
                    <RouteWithProps
                      path={Routes.UPDATE_PHONE}
                      component={UpdatePhone}
                      token={token}
                      phone={phone}
                      message={message}
                      onSuccess={(data) => {
                        if (routeToLocationPage) {
                          browserHistory.replace("/");
                        }
                        onUpdateSuccess(data);
                      }}
                      animation={animationConfig}
                    />
                    <RouteWithProps
                      path={Routes.UPDATE_EMAIL}
                      component={UpdateEmail}
                      token={token}
                      email={patron.email}
                      message={message}
                      onSuccess={onUpdate}
                      animation={animationConfig}
                    />
                    <RouteWithProps
                      path={Routes.UPDATE_PASSWORD}
                      component={UpdatePasswordForm}
                      patron={patron}
                      message={message}
                      onSuccess={onForgotPasswordSuccess}
                      animation={animationConfig}
                    />
                    <RouteWithProps
                      path={Routes.FORGOT_PASSWORD}
                      component={ForgotPassword}
                      email={account}
                      patron={patron}
                      message={message}
                      onSuccess={onForgotPasswordSuccess}
                      animation={animationConfig}
                    />
                    <RouteWithProps
                      path={Routes.PINCODE}
                      component={Pincode}
                      onSuccess={verifyPincode}
                      patron={patron}
                      onUpdatePhone={onUpdatePhone}
                      account={account}
                      accountType={accountType}
                      message={message}
                      trackerPath={trackerPath}
                      animation={animationConfig}
                    />
                    <RouteWithProps
                      path={Routes.PASSWORD}
                      component={Password}
                      account={account}
                      message={message}
                      animation={animationConfig}
                    />
                    <RouteWithProps
                      component={ValidateLogin}
                      onValidate={validatePatron}
                      lastLocation={lastLocation}
                      fetchingSocial={fetchingSocial}
                      trackerPath={trackerPath}
                      onSuccess={async (data, socialLogin = false) => {
                        try {
                          await (socialLogin
                            ? onSocialLogin(data)
                            : onLogin(data));
                          if (routeToLocationPage) {
                            browserHistory.replace("/");
                          }
                        } catch (err) {
                          throw err;
                        }
                      }}
                      onUpdatePassword={(email, message) => {
                        history.replace({
                          pathname: Routes.FORGOT_PASSWORD,
                          state: {autoSend: true, email, message},
                        });
                      }}
                      message={message}
                      animation={animationConfig}
                    />
                  </Switch>
                </AnimatePresence>
              </div>
            )}
          </Controller>
        )}
      />
    </MemoryRouter>
  );
};

Flow.displayName = "LoginFlowType2";

export default withTemplate(withRouter(Flow), "signin");
