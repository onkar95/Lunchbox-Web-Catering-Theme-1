import {object, string} from "yup";
import {mapErrors, validateData} from "./helpers";

const cellSchema = ({labelTypes, viewTypes, buttonTypes}) =>
  object().shape({
    button: string().ensure().matches(buttonTypes, {excludeEmptyString: true}),
    buttons: object()
      .shape({
        primary: string()
          .ensure()
          .matches(buttonTypes, {excludeEmptyString: true}),
        secondary: string()
          .ensure()
          .matches(buttonTypes, {excludeEmptyString: true}),
        selected: string()
          .ensure()
          .matches(buttonTypes, {excludeEmptyString: true}),
        unselected: string()
          .ensure()
          .matches(buttonTypes, {excludeEmptyString: true}),
        unselectedSolid: string()
          .ensure()
          .matches(buttonTypes, {excludeEmptyString: true}),
      })
      .nullable(),
    labelTextStyles: object().shape({
      primary: string()
        .ensure()
        .matches(labelTypes, {excludeEmptyString: true}),
      quaternary: string()
        .ensure()
        .matches(labelTypes, {excludeEmptyString: true}),
      quinary: string()
        .ensure()
        .matches(labelTypes, {excludeEmptyString: true}),
      secondary: string()
        .ensure()
        .matches(labelTypes, {excludeEmptyString: true}),
      tertiary: string()
        .ensure()
        .matches(labelTypes, {excludeEmptyString: true}),
    }),
    views: object().shape({
      background: string()
        .ensure()
        .matches(viewTypes, {excludeEmptyString: true}),
      secondary: string()
        .ensure()
        .matches(viewTypes, {excludeEmptyString: true}),
    }),
  });

const cellValidator = (helpers) => async (cellData) => {
  const results = await Promise.all(
    validateData(cellSchema, cellData, helpers),
  );
  return mapErrors(results);
};

export default cellValidator;
