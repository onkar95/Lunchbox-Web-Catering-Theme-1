import * as Yup from "yup";

const PatronNameSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[a-z ,.'-]+$/i, "Please enter valid first name")
    .max(40)
    .required(),
  lastName: Yup.string()
    .matches(/^[a-z ,.'-]+$/i, "Please enter valid last name")
    .max(40)
    .required(),
});

export default PatronNameSchema;
