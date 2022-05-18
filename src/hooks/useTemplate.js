import {useTemplateContext} from "components/providers/template";

const useTemplate = (source, type) => {
  const {
    theme: {
      elements: {cells, segmentViews},
    },
    parsedTheme: {views},
  } = useTemplateContext();

  let toReturn;
  switch (source) {
    case "cell": {
      const cellType = {...cells[type]};
      if (cellType.views === null) {
        cellType.views = {};
      }
      toReturn = cellType;
      break;
    }
    case "segmentView": {
      const segment = segmentViews[type];
      const view = views[segment.view];
      toReturn = {segment, view};
      break;
    }
    default: {
      throw new Error("Please specify a source");
    }
  }

  return toReturn;
};

const useCell = (type) => useTemplate("cell", type);
const useSegment = (type) => useTemplate("segmentView", type);

export {useTemplate, useCell, useSegment};
export default {
  useCell,
  useSegment,
  useTemplate,
};
