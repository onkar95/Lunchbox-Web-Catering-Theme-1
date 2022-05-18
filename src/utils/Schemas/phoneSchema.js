import * as Yup from "yup";
import {phoneRegExp} from "./regexp";

const PhoneSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Phone is Required"),
});

export default PhoneSchema;
