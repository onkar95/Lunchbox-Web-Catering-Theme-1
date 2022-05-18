import {object, string} from "yup";
import {mapErrors, validateData} from "./helpers";

const buttonSchema = ({labelTypes, colorTypes, viewTypes}) =>
  object().shape({
    stateBackgroundColors: object()
      .nullable()
      .shape({
        disabled: string()
          .ensure()
          .matches(colorTypes, {excludeEmptyString: true}),
        unselected: string()
          .ensure()
          .matches(colorTypes, {excludeEmptyString: true}),
      }),
    stateTextStyles: object()
      .nullable()
      .shape({
        disabled: string()
          .ensure()
          .matches(labelTypes, {excludeEmptyString: true}),
        selected: string()
          .ensure()
          .matches(labelTypes, {excludeEmptyString: true}),
        unselected: string().matches(labelTypes, {excludeEmptyString: true}),
      }),
    view: string().ensure().matches(viewTypes, {excludeEmptyString: true}),
  });

const buttonValidator = (helpers) => async (buttonData) => {
  const results = await Promise.all(
    validateData(buttonSchema, buttonData, helpers),
  );
  return mapErrors(results);
};

export default buttonValidator;
