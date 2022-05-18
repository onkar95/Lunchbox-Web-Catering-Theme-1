const addToOrder = (dispatch) => (item, quantity = 1) => {
  dispatch({
    payload: {
      item,
      quantity,
    },
    type: "ADD_ITEM",
  });
};
const addManyItems = (dispatch) => (newItems) => {
  dispatch({
    payload: {
      items: newItems,
    },
    type: "ADD_ITEMS",
  });
};
const removeFromOrder = (dispatch) => (removeIndex) => {
  dispatch({
    payload: {
      index: removeIndex,
    },
    type: "REMOVE_ITEM",
  });
};
const editItemAtIndex = (dispatch) => (data, index) => {
  dispatch({
    payload: {
      index,
      item: data,
    },
    type: "UPDATE_ITEM",
  });
};
const clearItems = (dispatch) => () => {
  dispatch({type: "CLEAR_ITEMS"});
};

export default (dispatch) => ({
  addManyItems: addManyItems(dispatch),
  addToOrder: addToOrder(dispatch),
  clearItems: clearItems(dispatch),
  editItemAtIndex: editItemAtIndex(dispatch),
  removeFromOrder: removeFromOrder(dispatch),
});
