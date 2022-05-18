import {object, string} from "yup";
import {mapErrors, validateData} from "./helpers";

const dialogueSchema = ({labelTypes, viewTypes, buttonTypes}) =>
  object().shape({
    buttons: object().shape({
      approve: string().matches(buttonTypes),
      deny: string().matches(buttonTypes),
    }),
    labelTextStyles: object().shape({
      primary: string().matches(labelTypes),
      secondary: string().matches(labelTypes),
      tertiary: string()
        .ensure()
        .matches(labelTypes, {excludeEmptyString: true}),
    }),
    view: string().matches(viewTypes),
  });

const dialogueValidator = (helpers) => async (dialogueData) => {
  const results = await Promise.all(
    validateData(dialogueSchema, dialogueData, helpers),
  );
  return mapErrors(results);
};

export default dialogueValidator;
