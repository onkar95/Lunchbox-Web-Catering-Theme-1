/* eslint-disable import/prefer-default-export */
import {toObject, populate, sortGroups} from "../utils";

const mergeStateAndPayload = (state, payload) => ({
  array: [...state.array, ...payload],
  hash: {...state.hash, ...toObject(payload)},
});

export const upsellsMenuReducer = (state, {type, payload}) => {
  switch (type) {
    case "ADD": {
      const dedupedPayload = Object.entries(payload).reduce(
        (accu, [key, value]) => ({
          ...accu,
          [key]: value.filter(({id}) => !state[key].hash[id]),
        }),
        {
          groups: [],
          item: [],
          menus: [],
          options: [],
        },
      );

      const menusMapped = populate(dedupedPayload, "menus", "groups");
      const groupsMapped = sortGroups(
        populate(dedupedPayload, "groups", "items"),
      );
      const itemsMapped = populate(dedupedPayload, "items", "options");
      const optionsMapped = populate(dedupedPayload, "options", "items");
      return {
        ...state,
        groups: mergeStateAndPayload(state.groups, groupsMapped),
        items: mergeStateAndPayload(state.items, itemsMapped),
        menus: mergeStateAndPayload(state.menus, menusMapped),
        options: mergeStateAndPayload(state.options, optionsMapped),
      };
    }
    default:
      return state;
  }
};
