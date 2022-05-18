import * as Yup from "yup";

const CateringSchema = Yup.object().shape({
  orderType: Yup.string().required("Order Type delivery or pickup is required"),
  placeId: Yup.string().optional(
    "Please search and select an address for the catering request",
  ),
  scheduledAt: Yup.string().required(
    "Please select time for your catering request",
  ),
});

export default CateringSchema;
