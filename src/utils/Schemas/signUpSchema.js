import * as Yup from "yup";
import {phoneRegExp} from "./regexp";

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
  firstName: Yup.string().required("First Name is Required"),
  lastName: Yup.string().required("Last Name is Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is Required"),
  phone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Phone is Required"),
});

export default SignUpSchema;
