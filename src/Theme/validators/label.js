import {object, string, boolean} from "yup";
import {mapErrors, validateData} from "./helpers";

const labelSchema = ({colorTypes, viewTypes, fontTypes}) =>
  object().shape({
    font: string().matches(fontTypes),
    isUppercase: boolean().required(),
    textColor: string().matches(colorTypes),
    /** Chip title6_baseBrown_roundedAccentLight has view field that is not null */
    view: string().ensure().matches(viewTypes, {excludeEmptyString: true}),
  });

const labelValidator = (helpers) => async (labelData) => {
  const results = await Promise.all(
    validateData(labelSchema, labelData, helpers),
  );
  return mapErrors(results);
};

export default labelValidator;
