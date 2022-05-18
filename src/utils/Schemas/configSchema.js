import * as Yup from "yup";
import { typeRegExp, hexColorRegExp, themeRegExp, tabRegExp } from "./regexp";

// types of values for defaultNull()
const Type = {
  ARRAY: "array",
  BOOLEAN: "boolean",
  NUMBER: "number",
  STRING: "string",
  THEME: "stringTheme",
  TYPE: "stringType",
  URL: "stringUrl",
};
Object.freeze(Type);

// custom method to allow for null value in required field
Yup.addMethod(Yup.mixed, "defaultNull", function (typeOfValue) {
  return this.transform(function (value) {
    if (value && typeOfValue !== Type.ARRAY) return value; // [] is truthy so must check inside array

    switch (typeOfValue) {
      case Type.STRING:
        return "default";
      case Type.ARRAY:
        return value[0] ? value : ["default"];
      case Type.OBJECT:
        return Object.keys(value).length === 0 ? { default: "default" } : value;
      case Type.BOOLEAN:
        return false;
      case Type.NUMBER:
        return 0;
      case Type.URL:
        return "http://default.com";
      case Type.TYPE:
        return "Type";
      case Type.THEME:
        return "theme";
      default:
        return value;
    }
  });
});

// custom nullable schemas
const nullableComponentType = Yup.string()
  .matches(typeRegExp, { excludeEmptyString: true })
  .defaultNull(Type.TYPE)
  .required();
const nullableString = Yup.string().defaultNull(Type.STRING).required();
const nullableComponentTheme = Yup.string()
  .matches(themeRegExp, { excludeEmptyString: true })
  .defaultNull(Type.THEME)
  .required();
const nullableBoolean = Yup.boolean().defaultNull(Type.BOOLEAN).required();

// nested object schemas
const OrderSchema = Yup.object().shape({
  minimum: Yup.number().required(),
  tip: Yup.boolean().required(),
  tip_available_options: Yup.array().of(Yup.number()).required(),
  tip_default: Yup.number()
    .min(0, "Tip default must be positive")
    .lessThan(1, "Tip must be less than 1")
    .required(),
});

const FaviconSchema = Yup.object().shape({
  rel: Yup.string().required(),
  sizes: nullableString,
  src: Yup.string().url().required(),
  type: Yup.string().nullable(),
});

const OptionTabSchema = Yup.object().shape({
  optionNames: Yup.array().of(Yup.string()).defaultNull(Type.ARRAY).required(),
  tabName: Yup.string().required(),
  type: Yup.number().required(),
});

// theme schema and its nested objects
const MenuSchema = Yup.object().shape({
  group_container: nullableComponentType,
  group_item_breakpoints: Yup.object()
    .shape({
      lg: Yup.string().required(),
      md: Yup.string().required(),
      sm: Yup.string().required(),
      xs: Yup.string().required(),
    })
    .required(),
  info: nullableComponentType,
  item_card: nullableComponentType,
  layout: nullableComponentType,
  nav: nullableComponentType,
});

const LocationSchema = Yup.object().shape({
  card: nullableComponentType,
  layout: nullableComponentType,
  map_geo: Yup.object()
    .shape({
      lat: Yup.number()
        .defaultNull(Type.NUMBER)
        .min(-90, "Map Geo lat must be at least -90")
        .max(90, "Map Geo lat must be at most 90")
        .required(),
      long: Yup.number()
        .defaultNull(Type.NUMBER)
        .min(-180, "Map Geo lat must be at least -180")
        .max(180, "Map Geo lat must be at most 180")
        .required(),
    })
    .required(),
});

const ThemeSchema = Yup.object().shape({
  checkout: Yup.object()
    .shape({
      cart_item: nullableComponentType,
      confirmation: nullableComponentType,
    })
    .required(),
  color: Yup.string()
    .matches(hexColorRegExp, "Theme color does not match hexColorRegExp")
    .required(),
  fonts: Yup.object().shape({
    href: nullableString,
    source: nullableString,
  }),
  // legacy, will be removed from config
  header: Yup.object()
    .shape({
      theme: nullableString,
    })
    .required(),
  item_details: Yup.object()
    .shape({
      cart_item: nullableComponentType,
      group: nullableComponentType,
      header: nullableComponentType,
      modifier_items: nullableComponentType,
      tabs: nullableComponentType,
    })
    .required(),
  location: LocationSchema.required(),
  menu: MenuSchema.required(),
});

// TODO: separate appsSchema based on environment
const AppsSchema = Yup.object()
  .shape({
    facebook_pixel: Yup.string().nullable(),
    // apps has optional keys
    google_analytics: Yup.string().nullable(),
    google_maps: Yup.string().nullable(),
    google_tag_manager: Yup.string().nullable(),
    square: Yup.string().nullable(),
  })
  .required();

// main schema
const ConfigSchema = Yup.object().shape({
  apps: AppsSchema,
  auth: Yup.object().shape({
    apple: Yup.object()
      .shape({
        client_id: nullableString,
        enabled: Yup.boolean().required(),
      })
      .required(),
    facebook: Yup.object()
      .shape({
        app_id: nullableString,
        enabled: Yup.boolean().required(),
      })
      .required(),
    google: Yup.object()
      .shape({
        client_id: nullableString,
        enabled: Yup.boolean().required(),
      })
      .required(),
  }),
  login_signup: Yup.object()
    .shape({
      header: nullableString,
      nav_item: Yup.string().matches(typeRegExp).required(),
      version: nullableComponentType,
    })
    .required(),
  components: Yup.object()
    .shape({
      cart_item: nullableComponentType,
      empty: nullableComponentType,
      footer: nullableString,
      home_template: nullableComponentType,
      tab: nullableComponentType,
    })
    .required(),
  default_tab: Yup.string().matches(tabRegExp).required(),
  delivery: OrderSchema.required(),
  diet_order: Yup.array().of(Yup.string()).defaultNull(Type.ARRAY).required(),
  directory: Yup.string().required(),
  hardcodes: Yup.object()
    .shape({
      groupOrder: Yup.array()
        .of(Yup.string())
        .defaultNull(Type.ARRAY)
        .required(),
      optionsTabs: Yup.array()
        .of(OptionTabSchema.nullable())
        .defaultNull(Type.ARRAY)
        .required(),
    })
    .required(),
  id: Yup.string().required(),
  lang: Yup.object()
    .shape({
      email: nullableString,
      home_title: nullableString,
      info: nullableString,
      location_pg: nullableString,
      phone: nullableString,
      service_copy: nullableString,
      service_delivery_information: nullableString,
      service_pickup_information: nullableString,
    })
    .required(),
  local_storage_key: Yup.string().required(),
  order_details: Yup.object()
    .shape({
      has_company: nullableBoolean,
      has_utensils: nullableBoolean,
      required_contact_name: nullableBoolean,
      required_contact_phone: nullableBoolean,
      required_needs_eating_utensils: nullableBoolean,
      required_needs_serving_utensils: nullableBoolean,
      required_notes: nullableBoolean,
      required_number_of_guests: nullableBoolean,
      required_patron_company: nullableBoolean,
    })
    .required(),
  payment_processor: Yup.string().required(),
  pickup: OrderSchema.required(),
  restaurant: Yup.string().required(),
  theme: ThemeSchema.required(),
  website: Yup.object()
    .shape({
      description: nullableString,
      favicons: Yup.array().of(FaviconSchema).required(),
      name: nullableString,
      url: Yup.string().url().required(),
    })
    .required(),
});

export { ConfigSchema };

export default ConfigSchema;
