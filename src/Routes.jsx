import React from "react";

import { Switch, Redirect } from "react-router-dom";
import { Fragments } from "components";
import Header from "Header";

import { config } from "utils";
import Pages from "pages";
import styles from "./App.module.scss";

const {
  Routes: { RouteWithProps },
  GoogleAnalytics,
  FacebookPixel,
} = Fragments;

const Routes = ({ order, menu }) => (
  <div className={styles["page-wrapper"]}>
    <Header />
    <div className={styles["header-filler"]} />
    <div className={styles["page-content"]}>
      {["production", "local"].includes(process.env.BUILD_ENV) && (
        <FacebookPixel id={config.apps.facebook_pixel} />
      )}
      {["production", "local"].includes(process.env.BUILD_ENV) && (
        <GoogleAnalytics id={config.apps.google_analytics} />
      )}
      <Switch>
        <RouteWithProps exact path="/" component={Pages.Home} {...order} />
        <RouteWithProps
          path="/menu/"
          component={Pages.Menu}
          order={order}
          menu={menu}
        />
        <RouteWithProps component={Pages.Checkout} path="/checkout/:id" />
        <RouteWithProps path="/profile" component={Pages.Profile} />
        {process.env.BUILD_ENV !== "production" && (
          <RouteWithProps path="/theme" component={Pages.Theme} />
        )}
        <RouteWithProps component={Redirect} to="/" />
      </Switch>
    </div>
  </div>
);
export default Routes;
