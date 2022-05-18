import {object, string} from "yup";
import {mapErrors, validateData} from "./helpers";

const inputSchema = ({labelTypes}) =>
  object().shape({
    error: string().ensure().matches(labelTypes, {excludeEmptyString: true}),
    field: string().ensure().matches(labelTypes, {excludeEmptyString: true}),
    placeholder: string()
      .ensure()
      .matches(labelTypes, {excludeEmptyString: true}),
    title: string().ensure().matches(labelTypes, {excludeEmptyString: true}),
  });

const inputValidator = (helpers) => async (inputData) => {
  const results = await Promise.all(
    validateData(inputSchema, inputData, helpers),
  );
  return mapErrors(results);
};

export default inputValidator;
