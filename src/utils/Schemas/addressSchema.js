import * as Yup from "yup";

const AddressSchema = Yup.object().shape({
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  street1: Yup.string().required("Street Address is required"),
  street2: Yup.string(),
  zip: Yup.string()
    .length(5, "Invalid zip entered")
    .required("Zip code is required"),
});

export default AddressSchema;
