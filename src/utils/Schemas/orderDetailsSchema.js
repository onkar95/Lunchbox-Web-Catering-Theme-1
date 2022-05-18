import * as Yup from "yup";
import {phoneRegExp} from "./regexp";
import config from "../config";

const {
  required_patron_company,
  required_contact_name,
  required_contact_phone,
  required_number_of_guests,
  // required_needs_serving_utensils,
  // required_needs_eating_utensils,
  required_notes,
} = config.order_details;

let OrderDetailsSchema = Yup.object().shape({
  needsEatingUtensils: Yup.boolean(),
  needsServingUtensils: Yup.boolean(),
});

const additionalFields = {};

additionalFields.patronCompany = required_patron_company
  ? Yup.string().required("Company Name is Required")
  : Yup.string().default("N/A");

additionalFields.contactName = required_contact_name
  ? Yup.string().required("Contact Name is Required")
  : Yup.string();

additionalFields.contactPhone = required_contact_phone
  ? Yup.string()
      .matches(phoneRegExp, "Phone Number is not valid")
      .required("Contact Phone Number is Required")
  : Yup.string().matches(phoneRegExp, "Phone Number is not valid");

additionalFields.numberOfGuests = required_number_of_guests
  ? Yup.number()
      .min(1, "At least 1 Guest required")
      .required("Number of Guests is Required")
  : Yup.number().min(1, "At least 1 Guest required");

additionalFields.notes = required_notes
  ? Yup.string().required("Notes are Required")
  : Yup.string();

OrderDetailsSchema = OrderDetailsSchema.shape(additionalFields);

export default OrderDetailsSchema;
