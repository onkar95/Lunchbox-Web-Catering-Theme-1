export default (state, {type, payload}) => {
  switch (type) {
    case "ORDER_TYPE_CHANGE":
    case "PLACE_CHANGE":
    case "TIME_CHANGE": {
      return {...state, ...payload, error: ""};
    }
    case "FETCHING_CHANGE": {
      return {...state, fetching: payload};
    }
    case "ERROR": {
      return {...state, error: payload};
    }
    case "CLEAR_LOCATION_STATE": {
      return {...state, ...payload};
    }
    case "LOCATIONS_UPDATE": {
      return {...state};
    }
    case "ISSHOWALL_UPDATE": {
      return {...state, isShowAll: payload};
    }
    case "GEO_UPDATE": {
      return {...state, ...payload};
    }
    case "LOCATION_LOADED": {
      return {...state, locations: payload};
    }
    case "ACTIVE_LOCATION_UPDATE": {
      return {...state, activeLocation: payload};
    }
    default:
      return state;
  }
};
