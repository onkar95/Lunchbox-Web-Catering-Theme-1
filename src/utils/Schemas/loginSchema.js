import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("E-mail is not valid!")
    .required("E-mail is required!"),
  password: Yup.string()
    .min(8, "Password has to be at least 8 characters!")
    .required("Password is required!"),
});

export default LoginSchema;
