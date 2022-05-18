import React from "react";
import {withScope, captureException} from "@sentry/browser";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true});
    // You can also log the error to an error reporting service
    withScope((scope) => {
      scope.setExtras(info);
      captureException(error);
    });
  }

  render() {
    const {error, children} = this.props;
    const {hasError} = this.state;
    if (hasError) {
      // You can render any custom fallback UI
      return typeof error === "function" ? error() : error;
    }
    return children;
  }
}

export default ErrorBoundary;
