import isEqual from "lodash/isEqual";

export const orderReducer = (state, {type, payload}) => {
  switch (type) {
    case "CHANGE_DINING_OPTIONS": {
      return {
        ...state,
        orderType: payload.orderType,
        scheduledAt: null,
      };
    }
    case "UPDATE_DETAILS": {
      const nextState = {...state, ...payload};

      if (payload.recentAddress) {
        const recentAddresses = [
          // the most recent address that was clicked and format to keep it consistent
          payload.address && {
            id: payload.recentAddress.id,
            text: payload.recentAddress.text,
          },
          // we want to keep the previous 4 addresses and remove any duplicate
          // in case the user chooses the same address twice
          ...state.recentAddresses
            .filter((address) => {
              // checking to make sure that the new address is not already in the list
              return !isEqual(address.id, payload.recentAddress.id);
            })
            // keep the previous 4 addresses
            .slice(0, 4),
        ];

        nextState.recentAddresses = recentAddresses;
      }
      return nextState;
    }
    case "CHANGE_ADDRESS": {
      return {
        ...state,
        deliveryInfo: payload.address,
        lat: payload.lat,
        long: payload.long,
      };
    }
    default: {
      return state;
    }
  }
};

export const itemReducer = (state, {type, payload}) => {
  switch (type) {
    case "ADD_ITEM": {
      const {quantity, item} = payload;
      const newItems = new Array(quantity).fill(0).map(() => item);
      return [...state, ...newItems];
    }
    case "ADD_ITEMS": {
      return [...state, ...payload.items];
    }
    case "REMOVE_ITEM": {
      return state.filter((i, index) => index !== payload.index);
    }
    case "UPDATE_ITEM": {
      const {index, item} = payload;
      const newItems = [...state];
      newItems[index] = {...newItems[index], ...item};
      return newItems;
    }
    case "CLEAR_ITEMS": {
      return [];
    }
    default: {
      return state;
    }
  }
};
