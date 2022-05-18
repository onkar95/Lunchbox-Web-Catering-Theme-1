/* eslint-disable react/destructuring-assignment */

import {useReducer} from "react";
import {findLastIndex} from "lodash";
import {useMenuContext} from "components/providers/Menu/menu";

// let mod = ({ optionId, items }) => ({
//   option: optionId,
//   items: items.map(optionItem)
// });

const modItem = (itemId, mods = {}) => ({
  item: itemId,
  mods,
});

const modsReducer = (state, {type, payload}) => {
  switch (type) {
    case "ADD_MOD": {
      // add to the current mod list for this optionId, if not use empty array
      const newModList = [
        ...(state[payload.optionId] || []),
        modItem(payload.modItemId, payload.mod),
      ];
      return {
        ...state,
        [payload.optionId]: newModList,
      };
    }
    case "REMOVE_MOD": {
      /* Filter out the mod from the current mod list for this optionId,
            remove the option key if mod array is empty */
      const removeIndex = findLastIndex(
        state[payload.optionId],
        (i) => i.item === payload.modItemId,
      );

      const newModList = state[payload.optionId].filter(
        (i, index) => index !== removeIndex,
      );
      const newState = {...state};

      if (newModList.length) {
        newState[payload.optionId] = newModList;
      } else {
        delete newState[payload.optionId];
      }
      return newState;
    }
    case "EDIT_MOD": {
      const {optionId} = payload;
      const updateIndex = payload.itemIndex;

      const newState = {...state};
      // let newNestedMod = { ...newState[optionId][updateIndex].mods }

      newState[optionId][updateIndex].mods = payload.mods;
      return newState;
    }
    case "CLEAR_MODS": {
      return {};
    }
    default: {
      return state;
    }
  }
};

// const init = mods => {
//   return mods;
// };

const useModification = (mods) => {
  const {optionsHash} = useMenuContext();
  const [modifications, dispatch] = useReducer(modsReducer, mods);

  const addToMods = ({optionId, modId}) => {
    const {max = 1} = optionsHash[optionId];

    // Remove first modification for this option user if selecting more than the max allowed
    if (modifications[optionId] && modifications[optionId].length === max) {
      dispatch({
        payload: {
          modItemId: modifications[optionId][0].item,
          optionId,
        },
        type: "REMOVE_MOD",
      });
    }
    dispatch({
      payload: {
        modItemId: modId,
        optionId,
      },
      type: "ADD_MOD",
    });
  };

  const removeMod = ({optionId, modId}) => {
    dispatch({
      payload: {
        modItemId: modId,
        optionId,
      },
      type: "REMOVE_MOD",
    });
  };

  const updateMod = ({optionId, itemIndex, mods}) => {
    dispatch({
      payload: {
        itemIndex,
        mods,
        optionId,
      },
      type: "EDIT_MOD",
    });
  };

  const reset = () => {
    dispatch({
      type: "CLEAR_MODS",
    });
  };

  // useEffect(() => {
  //   onChange && onChange(modifications);
  // }, [modifications, onChange]);
  return {
    addToMods,
    modifications,
    removeMod,
    reset,
    updateMod,
  };
};

export default useModification;
