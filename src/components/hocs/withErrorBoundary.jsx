import React from "react";
import {ErrorBoundary} from "components/elements";

export default (Component, Fallback) => (props) => (
  <ErrorBoundary error={Fallback}>
    <Component {...props} />
  </ErrorBoundary>
);
