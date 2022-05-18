import * as Yup from "yup";

const DiscountSchema = Yup.object().shape({
  code: Yup.string().required("Promo code is required"),
});

export default DiscountSchema;
