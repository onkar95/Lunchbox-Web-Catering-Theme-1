import {object, string, number} from "yup";
import {mapErrors, validateData} from "./helpers";

const fontSchema = () =>
  object().shape({
    name: string().required(),
    size: number().positive().required(),
  });

const fontValidator = async (fontData) => {
  const results = await Promise.all(validateData(fontSchema, fontData));
  return mapErrors(results);
};

export default fontValidator;
