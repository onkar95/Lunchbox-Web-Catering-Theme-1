import React from "react";
import {Copy} from "utils";

const Loader = (props) => (
  <h1>{Copy.STATIC_COPY.LOADER_LOADING_MESSAGE(props.loadingMessage)}</h1>
);

export default Loader;
