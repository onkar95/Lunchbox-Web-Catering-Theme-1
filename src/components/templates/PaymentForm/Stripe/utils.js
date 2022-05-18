/* eslint-disable import/prefer-default-export */
const DEFAULT_TOKENIZE_ERROR =
  "Unable to process the card entered. Please try again or use another card.";
const DEFAULT_ERROR =
  "Unable to process the card entered. We apologize for the inconvience.";
const INVALID_REQUEST = "invalid_request_error";

export const mapTokenizeError = (tokenizeError) => {
  if (tokenizeError) {
    if (tokenizeError.type === INVALID_REQUEST) {
      return DEFAULT_ERROR;
    }
    if (tokenizeError.message) {
      return tokenizeError.message;
    }
  }
  return DEFAULT_TOKENIZE_ERROR;
};
