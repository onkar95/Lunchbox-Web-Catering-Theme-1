import {object, string, number} from "yup";
import {mapErrors, validateData} from "./helpers";

const viewSchema = ({colorTypes}) =>
  object()
    .noUnknown()
    .shape({
      backgroundColor: string()
        .ensure()
        .matches(colorTypes, {excludeEmptyString: true}),
      border: object()
        .nullable()
        .shape({
          colors: object().shape({
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
          width: number().min(0).required(),
        }),
      cornerRadius: number().nullable().min(0),
    });

const viewValidator = (helpers) => async (viewData) => {
  const results = await Promise.all(
    validateData(viewSchema, viewData, helpers),
  );
  return mapErrors(results);
};

export default viewValidator;
