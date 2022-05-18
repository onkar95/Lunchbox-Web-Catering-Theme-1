import React from "react";
import {Elements} from "components";
import Empty from "../Empty";

const {ErrorBoundary} = Elements;

const Error = ({img, message, ...props}) => (
  <ErrorBoundary
    {...props}
    error={() => <Empty img="error">{message}</Empty>}
  />
);

export default Error;
