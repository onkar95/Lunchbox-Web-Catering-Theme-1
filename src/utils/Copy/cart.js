// Cart Component
export const CART_ERROR_MESSAGE =
  "Unable to proceed with your order. Please contact the restaurant to place your order. We apologize for the inconvenience.";
export const EMPTY_MESSAGE = "Your cart is empty.";
export const NOT_LOGGED_IN_USER_MESSAGE = "Login to Checkout";
export const LOGGED_IN_USER_MESSAGE = "Checkout";
export const LOGGED_IN_EMPLOYEE_MESSAGE = "Create Link";
export const PRICE_SUBTOTAL_TEXT = "Subtotal";
export const ORDER_DISCOUNT_TEXT = "Discount";
export const PAY_WITH_CASH_OPTION_TEXT = "Pay with Cash";
export const LOYALTY_CREDIT_TEXT = "Loyalty Credit";
export const TIP_HEADER_TEXT = "Tip";
export const TOTAL_PRICE_TEXT = "Total";

// Complete Component
// eslint-disable-next-line
export const REWARD_MESSAGE =
  "\nYou're ${amountToReward}\naway from your\n${calculatedReward} reward!";

// Cart Item 4 Component
export const ITEM_UNAVAILABLE_TEXT = "Item Unavailable";
export const ITEM_REMOVE_BUTTON_TEXT = "Remove";
export const EDIT_BUTTON_TEXT = "Modify";
export const REMOVE_BUTTON_TEXT = "Remove";
export const ADD_BUTTON_TEXT = "Add To Cart";

// Cart -> Checkout Component
export const CART_HEADER_TEXT = "Your Catering Order";
export const CHECKOUT_HEADER_TEXT = "Order Summary";
export const CHECKOUT_PLACE_ORDER_BUTTON_TEXT = "Place Order";

// Cart -> Interceptor between Checkout and Complete
export const SEE_ORDER_CONFIRMATION = "See Order Confirmation";

// Helpers Component
export const NO_PAYMENT_INFORMATION_MESSAGE =
  "Please make sure to fill out your payment information.";
export const NO_PAYMENT_INFORMATION_BUTTON_TEXT = "Payment Required";
// eslint-disable-next-line
export const MINIMUM_ORDER_AMOUNT_MESSAGE =
  "The price for your order, before tip, must be at least ${deliveryMin} to place a delivery order.";
export const MINIMUM_ORDER_AMOUNT_BUTTON_TEXT = "Delivery Minimum";
export const SELECT_LOCATION_MESSAGE = "Please select a location.";
export const SELECT_LOCATION_BUTTON_TEXT = "No Location Selected";

// Actions Component
export const SYSTEM_ERROR_MESSAGE =
  "Unable to process your order. Please contact the restaurant to confirm your order. We apologize for the inconvenience.";

// Home Component
export const DELIVERY_FROM_TEXT = "Delivery From";
export const PICKUP_FROM_TEXT = "Pickup From";
export const DELIVERY_ORDER_NOTES_LABEL = "Delivery Instructions";
export const DELIVERY_ORDER_NOTES_PLACEHOLDER =
  "e.g ring the bell after drop-off, leave next to the porch, call upon arrival, etc";
export const PICKUP_ORDER_NOTES_LABEL = "Pickup Instructions";
export const PICKUP_ORDER_NOTES_PLACEHOLDER = "";
export const HOME_ERROR_MESSAGE = "Sorry about this but an error occured.";
export const ACCEPT_EDITS_BUTTON_TEXT = "Accept Edits";
export const ADD_TO_CART_BUTTON_TEXT = "Add To Cart";

// Order Summary Component
export const PROMOS_DISCOUNTS_HEADER_TEXT = "Promos & Discounts";
export const ADD_PROMO_CODE_BUTTON_TEXT = "Add a promo code";
export const INVALID_PROMO_CODE = "Invalid Promo";

// Packing Instructions Component
export const NO_PACKING_INSTRUCTION_MESSAGE =
  "No Packing instructions available. Please continue.";
export const NEXT_BUTTON_TEXT = "Next";

// Schedule Date Type1 Component
export const DISPLAYED_TIME_ZONE = "Times displayed in";
export const SCHEDULE_DINING_DATE_HEADER = "Schedule {diningOption} Date";
export const SET_DINING_TIME = "Set to {diningOption} ASAP";
export const CONFIRM_DINING_TIME = "Confirm {diningOption} time";

// Schedule Date Type2 Component
export const SCHEDULED_DATE_DAY_LABEL = "Available Days";
export const SCHEDULED_DATE_TIME_LABEL = "Available Times";
export const SCHEDULED_DATE_DAY_PLACEHOLDER = "Please select a day";
export const SCHEDULED_DATE_TIME_PLACEHOLDER =
  "Select a day to see available times";
export const SCHEDULED_DATE_ASAP_ORDER = "Order Now";
export const SCHEDULED_DATE_CONFIRM_TIME = "Confirm {orderType} time";
export const SCHEDULED_DATE_INVALID_TIME =
  "Please select a time for your order";

// Upsells Component
export const POPULAR_ADDITIONS_HEADER = "Popular Additions";
export const POPULAR_ADDITIONS_TEXT = "Popular Additions";
export const CONTINUE_CHECKOUT_BUTTON_TEXT = "Continue To Checkout";

export default {
  ACCEPT_EDITS_BUTTON_TEXT,
  ADD_BUTTON_TEXT,
  ADD_PROMO_CODE_BUTTON_TEXT,
  ADD_TO_CART_BUTTON_TEXT,
  CART_ERROR_MESSAGE,
  CART_HEADER_TEXT,
  CHECKOUT_HEADER_TEXT,
  CHECKOUT_PLACE_ORDER_BUTTON_TEXT,
  CONFIRM_DINING_TIME,
  CONTINUE_CHECKOUT_BUTTON_TEXT,
  DELIVERY_FROM_TEXT,
  DISPLAYED_TIME_ZONE,
  EDIT_BUTTON_TEXT,
  EMPTY_MESSAGE,
  HOME_ERROR_MESSAGE,
  INVALID_PROMO_CODE,
  ITEM_REMOVE_BUTTON_TEXT,
  ITEM_UNAVAILABLE_TEXT,
  LOGGED_IN_EMPLOYEE_MESSAGE,
  LOGGED_IN_USER_MESSAGE,
  LOYALTY_CREDIT_TEXT,
  MINIMUM_ORDER_AMOUNT_BUTTON_TEXT,
  MINIMUM_ORDER_AMOUNT_MESSAGE,
  NEXT_BUTTON_TEXT,
  NO_PACKING_INSTRUCTION_MESSAGE,
  NO_PAYMENT_INFORMATION_BUTTON_TEXT,
  NO_PAYMENT_INFORMATION_MESSAGE,
  NOT_LOGGED_IN_USER_MESSAGE,
  ORDER_DISCOUNT_TEXT,
  PAY_WITH_CASH_OPTION_TEXT,
  PICKUP_FROM_TEXT,
  POPULAR_ADDITIONS_HEADER,
  POPULAR_ADDITIONS_TEXT,
  PRICE_SUBTOTAL_TEXT,
  PROMOS_DISCOUNTS_HEADER_TEXT,
  REMOVE_BUTTON_TEXT,
  SCHEDULE_DINING_DATE_HEADER,
  SCHEDULED_DATE_ASAP_ORDER,
  SCHEDULED_DATE_CONFIRM_TIME,
  SCHEDULED_DATE_DAY_LABEL,
  SCHEDULED_DATE_DAY_PLACEHOLDER,
  SCHEDULED_DATE_INVALID_TIME,
  SCHEDULED_DATE_TIME_LABEL,
  SCHEDULED_DATE_TIME_PLACEHOLDER,
  SEE_ORDER_CONFIRMATION,
  SELECT_LOCATION_BUTTON_TEXT,
  SELECT_LOCATION_MESSAGE,
  SET_DINING_TIME,
  SYSTEM_ERROR_MESSAGE,
  TIP_HEADER_TEXT,
  TOTAL_PRICE_TEXT,
};
