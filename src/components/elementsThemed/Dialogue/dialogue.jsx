import React from "react";
import {useTemplateContext} from "../../providers/template";

const Dialogue = ({render, children, type}) => {
  const {
    theme: {
      elements: {dialogues},
    },
  } = useTemplateContext();
  const selectedDialogue = {...dialogues[type]};

  if (selectedDialogue.views === null) {
    selectedDialogue.views = {};
  }

  if (typeof render === "function") {
    return render({...selectedDialogue});
  }

  return typeof children === "function"
    ? React.Children.only(children({...selectedDialogue}))
    : React.Children.only(React.cloneElement(children, {...selectedDialogue}));
};

export default Dialogue;
