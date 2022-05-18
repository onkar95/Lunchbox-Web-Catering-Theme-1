const onTabChange = (dispatch) => (nextTab) => {
  dispatch({
    payload: {
      address: "",
      addressComps: "",
      diningOption: nextTab,
      error: "",
      isShowAll: true,
      lat: "",
      locations: [],
      long: "",
      placeId: "",
      scheduledAt: "",
      street2: "",
    },
    type: "ORDER_TYPE_CHANGE",
  });
};

const onChangeStreet2 = (dispatch) => (value) => {
  dispatch({
    payload: {
      street2: value,
    },
    type: "PLACE_CHANGE",
  });
};

const onLocationsLoaded = (dispatch) => (value) => {
  dispatch({
    payload: value,
    type: "LOCATION_LOADED",
  });
};

const onActiveLocationSelected = (dispatch) => (value) => {
  dispatch({
    payload: value,
    type: "ACTIVE_LOCATION_UPDATE",
  });
};

const onLocationSelect = (dispatch) => ({id: placeId, text: address}) => {
  dispatch({
    payload: {
      address,
      placeId,
    },
    type: "PLACE_CHANGE",
  });
};

const onGeoUpdate = (dispatch) => ({lat, long, addressComps}) => {
  dispatch({
    payload: {
      addressComps,
      lat,
      long,
    },
    type: "GEO_UPDATE",
  });
};

const onIsShowAllUpdate = (dispatch) => (value) => {
  dispatch({
    payload: value,
    type: "ISSHOWALL_UPDATE",
  });
};

const onSelectTime = (dispatch) => (timestamp) => {
  dispatch({
    payload: {
      scheduledAt: timestamp,
    },
    type: "TIME_CHANGE",
  });
};

const onFetchChange = (dispatch) => (status) => {
  dispatch({
    payload: status,
    type: "FETCHING_CHANGE",
  });
};

const onError = (dispatch) => (err) => {
  dispatch({
    payload: err,
    type: "ERROR",
  });
};

export default (dispatch) => ({
  onActiveLocationSelected: onActiveLocationSelected(dispatch),
  onChangeStreet2: onChangeStreet2(dispatch),
  onError: onError(dispatch),
  onFetchChange: onFetchChange(dispatch),
  onGeoUpdate: onGeoUpdate(dispatch),
  onIsShowAllUpdate: onIsShowAllUpdate(dispatch),
  onLocationSelect: onLocationSelect(dispatch),
  onLocationsLoaded: onLocationsLoaded(dispatch),
  onSelectTime: onSelectTime(dispatch),
  onTabChange: onTabChange(dispatch),
});
