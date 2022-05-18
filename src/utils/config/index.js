/* eslint-disable import/no-unresolved */
import commonConfig from "CommonConfig";
import images from "ImagesConfig";
import environmentConfig from "EnvironmentConfig";

const defaultConfig = {
  api: {
    url: "",
    version: "",
  },
  apps: {
    facebook_pixel: "",
    google_analytics: "",
    google_maps: "",
    google_tag_manager: "",
    square: "",
  },
  cart_logo: false,
  components: {
    cart_item: "Type",
    empty: "Type",
    footer: "Type",
    home_template: "Type",
    tab: "Type",
  },
  default_tab: "delivery",
  delivery: {
    minimum: 0,
    tip: true,
    tip_default: 0,
  },
  diet_order: [],
  directory: "",
  hardcodes: {
    groupOrder: [],
    optionsTabs: [],
  },
  home_template: "Type",
  id: "",
  lang: {
    email: "",
    home_title: "Catering",
    info: "",
    location_pg: "",
    location_text: "",
    phone: "",
    service_copy: "Service Fees",
    service_delivery_information: "",
    service_pickup_information: "",
    tax_tooltip: true,
  },
  local_storage_key: "access",
  login_flow: "",
  order_details: {
    has_company: true,
    has_utensils: true,
    required_contact_name: true,
    required_contact_phone: true,
    required_needs_eating_utensils: true,
    required_needs_serving_utensils: true,
    required_notes: true,
    required_number_of_guests: true,
    required_patron_company: true,
  },
  payment_processor: "",
  pickup: {
    minimum: 0,
    tip: true,
    tip_default: 0,
  },
  restaurant: "",
  theme: {
    checkout: {
      cart_item: "Type",
      confirmation: "Type",
      footer: "",
    },
    color: "",
    fonts: {
      source: "",
      href: "",
    },
    header: {
      theme: "",
    },
    item_details: {
      footer: "",
      group: "Type",
      header: "Type",
      modifier_items: "Type",
      tabs: "Type",
    },
    location: {
      card: "",
      layout: "",
      map_geo: {
        lat: 0,
        long: 0,
      },
    },
    menu: {
      catering_info_time: 1,
      group_container: "Type",
      group_item_breakpoints: {
        lg: "1-4",
        md: "1-3",
        sm: "1-2",
        xs: "1",
      },
      info: "",
      item_card: "Type",
      layout: "Type",
      nav: "Type",
    },
  },
  website: {
    description: "",
    favicons: [
      {
        rel: "",
        sizes: "",
        src: "",
        type: "",
      },
    ],
    name: "",
    url: "",
  },
};

const config = {
  ...defaultConfig,
  ...commonConfig,
  images,
  ...environmentConfig,
};

export default config;
