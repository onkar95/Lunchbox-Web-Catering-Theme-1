import React from "react";
import {config} from "utils";
import loadable from "@loadable/component";

const AsyncPage = loadable((props) => import(`./${props.page}`), {
  cacheKey: (props) => props.page,
});

const TabSelector = (props) => {
  return <AsyncPage page={config?.components?.tab || "Type1"} {...props} />;
};

export default TabSelector;
