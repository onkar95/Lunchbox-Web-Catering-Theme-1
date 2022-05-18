const setDeliveryAddress = (dispatch) => (address) => {
  dispatch({
    payload: {
      address,
      lat: address.lat,
      long: address.long,
    },
    type: "CHANGE_ADDRESS",
  });
};

const setOrderDetails = (dispatch) => (details) => {
  dispatch({
    payload: {...details},
    type: "UPDATE_DETAILS",
  });
};

export default (dispatch) => ({
  setDeliveryAddress: setDeliveryAddress(dispatch),
  setOrderDetails: setOrderDetails(dispatch),
});
