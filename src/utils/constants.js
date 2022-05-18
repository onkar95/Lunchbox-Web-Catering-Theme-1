import uuidv4 from "uuid/v4";

const SESSION_ID = uuidv4();
const SIFT_BEACON_KEY =
  process.env.BUILD_ENV === "production" ? "9c10cdbac9" : "a066987159";

const EMAIL = "email";
const PHONE = "phone";
const APPLE = "apple";
const GOOGLE = "google";
const FACEBOOK = "facebook";

// Order types that the website can support
const ORDER_TYPES = {
  DELIVERY: "delivery",
  PICKUP: "pickup",
};

const STATES = [
  {
    abbreviation: "AL",
    name: "Alabama",
  },
  {
    abbreviation: "AK",
    name: "Alaska",
  },
  {
    abbreviation: "AZ",
    name: "Arizona",
  },
  {
    abbreviation: "AR",
    name: "Arkansas",
  },
  {
    abbreviation: "CA",
    name: "California",
  },
  {
    abbreviation: "CO",
    name: "Colorado",
  },
  {
    abbreviation: "CT",
    name: "Connecticut",
  },
  {
    abbreviation: "DE",
    name: "Delaware",
  },
  {
    abbreviation: "DC",
    name: "District Of Columbia",
  },
  {
    abbreviation: "FL",
    name: "Florida",
  },
  {
    abbreviation: "GA",
    name: "Georgia",
  },
  {
    abbreviation: "HI",
    name: "Hawaii",
  },
  {
    abbreviation: "ID",
    name: "Idaho",
  },
  {
    abbreviation: "IL",
    name: "Illinois",
  },
  {
    abbreviation: "IN",
    name: "Indiana",
  },
  {
    abbreviation: "IA",
    name: "Iowa",
  },
  {
    abbreviation: "KS",
    name: "Kansas",
  },
  {
    abbreviation: "KY",
    name: "Kentucky",
  },
  {
    abbreviation: "LA",
    name: "Louisiana",
  },
  {
    abbreviation: "ME",
    name: "Maine",
  },
  {
    abbreviation: "MD",
    name: "Maryland",
  },
  {
    abbreviation: "MA",
    name: "Massachusetts",
  },
  {
    abbreviation: "MI",
    name: "Michigan",
  },
  {
    abbreviation: "MN",
    name: "Minnesota",
  },
  {
    abbreviation: "MS",
    name: "Mississippi",
  },
  {
    abbreviation: "MO",
    name: "Missouri",
  },
  {
    abbreviation: "MT",
    name: "Montana",
  },
  {
    abbreviation: "NE",
    name: "Nebraska",
  },
  {
    abbreviation: "NV",
    name: "Nevada",
  },
  {
    abbreviation: "NH",
    name: "New Hampshire",
  },
  {
    abbreviation: "NJ",
    name: "New Jersey",
  },
  {
    abbreviation: "NM",
    name: "New Mexico",
  },
  {
    abbreviation: "NY",
    name: "New York",
  },
  {
    abbreviation: "NC",
    name: "North Carolina",
  },
  {
    abbreviation: "ND",
    name: "North Dakota",
  },
  {
    abbreviation: "OH",
    name: "Ohio",
  },
  {
    abbreviation: "OK",
    name: "Oklahoma",
  },
  {
    abbreviation: "OR",
    name: "Oregon",
  },
  {
    abbreviation: "PA",
    name: "Pennsylvania",
  },
  {
    abbreviation: "RI",
    name: "Rhode Island",
  },
  {
    abbreviation: "SC",
    name: "South Carolina",
  },
  {
    abbreviation: "SD",
    name: "South Dakota",
  },
  {
    abbreviation: "TN",
    name: "Tennessee",
  },
  {
    abbreviation: "TX",
    name: "Texas",
  },
  {
    abbreviation: "UT",
    name: "Utah",
  },
  {
    abbreviation: "VT",
    name: "Vermont",
  },
  {
    abbreviation: "VA",
    name: "Virginia",
  },
  {
    abbreviation: "WA",
    name: "Washington",
  },
  {
    abbreviation: "WV",
    name: "West Virginia",
  },
  {
    abbreviation: "WI",
    name: "Wisconsin",
  },
  {
    abbreviation: "WY",
    name: "Wyoming",
  },
];

const PLATFORM = (() => {
  let browser;
  let version;
  let mobile;
  let os;
  let osversion;
  let bit;

  return {
    bit,
    browser,
    mobile,
    os,
    osversion,
    version,
  };
})();

const SOCIAL_PLATFORMS = {
  APPLE,
  FACEBOOK,
  GOOGLE,
};

const ACCOUNT_TYPES = {
  EMAIL,
  PHONE,
};

const ERRORS = {
  general:
    "Unable to process your request. We apologize for the inconvenience.",
  generalOrder:
    "Unable to process your order. Please contact the restaurant to confirm your order. We apologize for the inconvenience.",
};

const TIMEZONES = {
  "America/Adak": "Alaska Standard Time (AKST)",
  "America/Anchorage": "Alaska Standard Time (AKST)",
  "America/Chicago": "Central Standard Time (CST)",
  "America/Denver": "Mountain Standard Time (MST)",
  "America/Los_Angeles": "Pacific Standard Time (PST)",
  "America/New_York": "Eastern Standard Time (EST)",
  "America/Phoenix": "Mountain Standard Time (MST)",
  "Pacific/Honolulu": "Standard Time (HST)",
};

const TIMEZONES_DST = {
  "America/Adak": "Alaska Daylight Time (AKDT)",
  "America/Anchorage": "Alaska Daylight Time (AKDT)",
  "America/Chicago": "Eastern Daylight Time (CDT)",
  "America/Denver": "Mountain Daylight Time (MDT)",
  "America/Los_Angeles": "Pacific Daylight Time (PDT)",
  "America/New_York": "Eastern Daylight Time (EDT)",
  "America/Phoenix": "Mountain Daylight Time (MDT)",
  "Pacific/Honolulu": "Hawaii Standard Time (HST)",
};

export {
  ACCOUNT_TYPES,
  ERRORS,
  ORDER_TYPES,
  PLATFORM,
  SESSION_ID,
  SOCIAL_PLATFORMS,
  SIFT_BEACON_KEY,
  STATES,
  TIMEZONES,
  TIMEZONES_DST,
};

export default {
  ACCOUNT_TYPES,
  ERRORS,
  ORDER_TYPES,
  PLATFORM,
  SESSION_ID,
  SIFT_BEACON_KEY,
  SOCIAL_PLATFORMS,
  STATES,
  TIMEZONES,
  TIMEZONES_DST,
};
