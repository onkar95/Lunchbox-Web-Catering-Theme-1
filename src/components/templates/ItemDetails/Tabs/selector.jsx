import React from "react";
import {config} from "utils";
import loadable from "@loadable/component";

const AsyncPage = loadable((props) => import(`./${props.page}`));

const itemDetailsGroupSelector = (props) => {
  return (
    <AsyncPage page={config?.theme?.item_details?.tabs || "Type1"} {...props} />
  );
};

export default itemDetailsGroupSelector;
