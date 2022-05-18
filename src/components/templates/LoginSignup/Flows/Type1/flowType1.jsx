import React from "react";
import {MemoryRouter, Route, Switch, withRouter} from "react-router-dom";
import {AnimatePresence} from "framer-motion";
import {Routes as Router} from "components/fragments";
import {withTemplate} from "components/hocs";
import {useSegment} from "hooks";
import {Copy} from "utils";
import Controller from "../../Controllers";
import NavSelector from "../../NavItems";
import {Nav} from "../../nav";
import {Login} from "../../../Login";
import {ForgotPassword} from "../../../ForgotPassword";
import {UpdatePhone} from "../../../UpdatePhone";
import {Signup} from "../../../Signup";
import css from "../login.module.css";
import {mapInitialTab} from "../utils";
import {AUTHSTEPS} from "../../Controllers/utils";

const {RouteWithProps} = Router;

const baseProps = {className: css.route};
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
  initialTab,
  routeToLocationPage,
  ...props
}) => {
  const animationConfig = transition ? inTransitionProps : baseProps;
  const {
    segment: {stateTextStyles, stateBackgroundColors, view},
  } = useSegment(style.segmentViews.standard);
  const {history: browserHistory} = props;

  return (
    <MemoryRouter initialEntries={[mapInitialTab(initialTab)]}>
      <Route
        render={({location, history}) => (
          <>
            <Nav>
              <NavSelector
                route="/"
                viewType={view}
                textTypes={stateTextStyles}
                backgroundTypes={stateBackgroundColors}
              >
                {Copy.LOGIN_STATIC.LOGIN_BUTTON_TEXT}
              </NavSelector>
              <NavSelector
                route="/sign-up"
                viewType={view}
                textTypes={stateTextStyles}
                backgroundTypes={stateBackgroundColors}
              >
                {Copy.SIGN_UP_STATIC.SIGN_UP_BUTTON_TEXT}
              </NavSelector>
            </Nav>
            <Controller
              onComplete={props.onComplete}
              onNextStep={(step) => {
                let route = "/";
                switch (step) {
                  case AUTHSTEPS.SIGN_UP:
                    route = "/sign-up";
                    break;
                  case AUTHSTEPS.UPDATE_PHONE:
                    route = "/update-phone";
                    break;
                  case AUTHSTEPS.UPDATE_PASSWORD:
                    route = "/forgot-password";
                    break;
                  default:
                    route = "/";
                }
                history.replace(route);
              }}
            >
              {({
                onSignupSuccess,
                onUpdatePhoneSuccess,
                onForgotPasswordSuccess,
                afterLogin,
                token,
                message,
                patron,
                phone,
              }) => (
                <div className={css.content}>
                  <AnimatePresence initial={false}>
                    <Switch location={location} key={location.pathname}>
                      <RouteWithProps
                        path="/sign-up"
                        component={Signup}
                        onSuccess={onSignupSuccess}
                        patron={patron}
                        animation={animationConfig}
                      />
                      <RouteWithProps
                        path="/update-phone"
                        component={UpdatePhone}
                        token={token}
                        phone={phone}
                        message={message}
                        onSuccess={(data) => {
                          if (routeToLocationPage) {
                            browserHistory.replace("/");
                          }
                          onUpdatePhoneSuccess(data);
                        }}
                        animation={animationConfig}
                      />
                      <RouteWithProps
                        path="/forgot-password"
                        component={ForgotPassword}
                        onSuccess={onForgotPasswordSuccess}
                        animation={animationConfig}
                      />
                      <RouteWithProps
                        path="/"
                        component={Login}
                        onUpdatePassword={(email, message) => {
                          history.replace({
                            pathname: "/forgot-password",
                            state: {autoSend: true, email, message},
                          });
                        }}
                        onSuccess={(data) => {
                          if (routeToLocationPage) {
                            browserHistory.replace("/");
                          }
                          afterLogin(data);
                        }}
                        animation={animationConfig}
                      />
                    </Switch>
                  </AnimatePresence>
                </div>
              )}
            </Controller>
          </>
        )}
      />
    </MemoryRouter>
  );
};

Flow.defaultProps = {
  initialTab: "login",
};
Flow.displayName = "LoginFlowType1";

export default withTemplate(withRouter(Flow), "signin");
