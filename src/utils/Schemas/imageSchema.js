import * as Yup from "yup";

// custom method to allow for null value in required field
Yup.addMethod(Yup.mixed, "defaultNull", function () {
  return this.transform(function (value) {
    return value || "http://default.com";
  });
});

const nullableUrl = Yup.string().url().defaultNull().required();
const requiredUrl = Yup.string().url().required();

const ImageSchema = Yup.object().shape({
  art_background: nullableUrl,
  art_cart_logo: nullableUrl,
  art_catering_cart_bottom: nullableUrl,
  art_catering_background: requiredUrl,
  art_catering_logo: nullableUrl,
  art_catering_logo_drawer: nullableUrl,
  art_catering_order_confirmation: nullableUrl,
  art_empty_cart: requiredUrl,
  art_empty_locations: requiredUrl,
  art_home_misc: nullableUrl,
  art_item_placeholder: requiredUrl,
  art_login_header: nullableUrl,
  art_logo_1: nullableUrl,
  art_menu_catering_header: requiredUrl,
  art_misc_1: nullableUrl,
  button_back: requiredUrl,
  button_back_item_details: requiredUrl,
  button_back_cart_header: requiredUrl,
  button_price_clear: requiredUrl,
  icon_cart: requiredUrl,
  icon_contact: requiredUrl,
  icon_contact_1: nullableUrl,
  icon_contact_2: nullableUrl,
  icon_empty_cart: requiredUrl,
  icon_geo: nullableUrl,
  icon_login: requiredUrl,
  icon_logout: requiredUrl,
  icon_profile: requiredUrl,
  lunchbox_login_footer: requiredUrl,
});

export {ImageSchema};

export default ImageSchema;
