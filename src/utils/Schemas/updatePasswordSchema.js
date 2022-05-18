import * as Yup from "yup";

const UpdatePasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password has to be at least 8 characters!")
    .required("Password is required!"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("This Field is required"),
});

export default UpdatePasswordSchema;
