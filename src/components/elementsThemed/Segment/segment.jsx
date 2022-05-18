import React from "react";
import {useTemplateContext} from "../../providers/template";

const Segment = ({type, render}) => {
  const {
    parsedTheme: {views},
    theme: {
      elements: {segmentViews},
    },
  } = useTemplateContext();
  const segment = segmentViews[type];
  const view = views[segment.view];
  return render({segment, view});
};

export default React.memo(Segment);
