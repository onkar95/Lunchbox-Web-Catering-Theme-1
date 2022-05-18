/* eslint-disable no-unused-vars, */
import React from "react";
import {useTemplateContext} from "../../providers/template";

const Cell = ({render, children, type, props}) => {
  const {
    theme: {
      elements: {cells},
    },
  } = useTemplateContext();
  const cellType = {...cells[type]};

  if (cellType.views === null) {
    cellType.views = {};
  }

  if (typeof render === "function") {
    return render({...cellType});
  }

  return typeof children === "function"
    ? React.Children.only(children({...cellType}))
    : React.Children.only(React.cloneElement(children, {...cellType}));
};

export default Cell;
