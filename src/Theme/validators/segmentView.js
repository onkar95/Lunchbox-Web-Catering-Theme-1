import {object, string} from "yup";
import {mapErrors, validateData} from "./helpers";

const segmentViewSchema = ({colorTypes, labelTypes, viewTypes}) =>
  object().shape({
    stateBackgroundColors: object().shape({
      disabled: string()
        .ensure()
        .matches(colorTypes, {excludeEmptyString: true}),
      selected: string()
        .ensure()
        .matches(colorTypes, {excludeEmptyString: true}),
      unselected: string()
        .ensure()
        .matches(colorTypes, {excludeEmptyString: true}),
    }),
    stateTextStyles: object().shape({
      disabled: string()
        .ensure()
        .matches(labelTypes, {excludeEmptyString: true}),
      selected: string()
        .ensure()
        .matches(labelTypes, {excludeEmptyString: true}),
      unselected: string()
        .ensure()
        .matches(labelTypes, {excludeEmptyString: true}),
    }),
    view: string().ensure().matches(viewTypes, {excludeEmptyString: true}),
  });

const segmentViewValidator = (helpers) => async (segmentViewData) => {
  const results = await Promise.all(
    validateData(segmentViewSchema, segmentViewData, helpers),
  );
  return mapErrors(results);
};

export default segmentViewValidator;
