import * as Yup from "yup";

const EmailSchema = Yup.object().shape({
  email: Yup.string().email("Email is not valid").required("Email is required"),
});

export default EmailSchema;
