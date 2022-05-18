import {string} from "yup";
import {mapErrors, validateData} from "./helpers";

const colorSchema = () =>
  string().matches(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i);

const colorValidator = async (colorData) => {
  const results = await Promise.all(validateData(colorSchema, colorData));
  return mapErrors(results);
};

export default colorValidator;
