import * as Yup from "yup";

const EmailCodeSchema = Yup.object().shape({
  code: Yup.string().min(4, "Code invalid").required("Code is required"),
});

export default EmailCodeSchema;
