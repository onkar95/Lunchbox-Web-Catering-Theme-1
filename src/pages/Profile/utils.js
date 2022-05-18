export const cardFormat = (brand, last4, expM, expY) => {
  let mappedBrand = brand;
  let mappedLast4 = last4;
  switch (brand) {
    case "AMERICAN_EXPRESS":
      mappedLast4 = `••••-${last4}, exp ${expM}/${expY}`;
      break;
    case "VISA":
    case "DISCOVER":
    case "MASTERCARD":
    default:
      mappedLast4 = `••••-${last4}, exp ${expM}/${expY}`;
  }

  switch (brand) {
    case "AMERICAN_EXPRESS":
      mappedBrand = "American Express";
      break;
    case "VISA":
    case "DISCOVER":
    case "MASTERCARD":
    default:
      mappedBrand = brand;
  }

  return {
    mappedBrand,
    mappedLast4,
  };
};

export const CARD_ROOT = "/cards";
export const DELETE_CARD = `${CARD_ROOT}/delete/:cardId`;
export const UPDATE_CARD = `${CARD_ROOT}/update/:cardId`;
export const ADD_CARD = `${CARD_ROOT}/add`;

export const GET_DELETE_CARD_ROUTE = (id) => DELETE_CARD.replace(":cardId", id);
export const GET_UPDATE_CARD_ROUTE = (id) => UPDATE_CARD.replace(":cardId", id);

export const CARD_ROUTES = {
  ADD_CARD,
  CARD_ROOT,
  DELETE_CARD,
  UPDATE_CARD,
};
