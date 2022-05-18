/* eslint-disable import/prefer-default-export */
import {config} from "utils";
import {
  toObject,
  populate,
  sortGroups,
  sortNestedEntityByPriority,
  populateSubgroups,
} from "../utils";

export const menuReducer = (state, {type, payload}) => {
  switch (type) {
    case "ADD": {
      /** This replaces http with https for images paths in each entity.
       *  It runs before the payload structure is populated
       *  so that all nested children have the correct prefix.
      */
      payload.menus = payload.menus.map((menu) => (
        {
          ...menu, 
          images: menu.images.map((image) => image.replace("http://", "https://"))
        }
      ));
      payload.groups = payload.groups.map((group) => (
        {
          ...group, 
          images: group.images.map((image) => image.replace("http://", "https://"))
        }
      ));
      payload.items = payload.items.map((item) => (
        {
          ...item, 
          images: item.images.map((image) => image.replace("http://", "https://"))
        }
      ));


      payload.menus = populate(payload, "menus", "groups");
      payload.groups = sortGroups(populate(payload, "groups", "items"));
      payload.groups = populateSubgroups(payload.groups);
      payload.items = populate(payload, "items", "options");
      payload.options = populate(payload, "options", "items");

      const groupsAsObject = toObject(payload.groups);
      const itemsAsObject = toObject(payload.items);
      const optionsAsObject = toObject(payload.options);

      if (config.flatten_subgroups) {
        payload.menus = payload.menus.map((i) => {
          const flattenSubgroups = i.groups
            .reduce((accu, x) => x.subgroups, [])
            .map((x) => groupsAsObject[x])
            .filter((x) => x);
          let groups = [...i.groups, ...flattenSubgroups];
          groups = groups.filter((x) => {
            if (!x.items || !x.items.length) {
              return false;
            }
            return true;
          });
          return {
            ...i,
            groups,
          };
        });
      }

      payload.menus = payload.menus
        .sort((a, b) => {
          const priorityA = a.priority || 0;
          const priorityB = b.priority || 0;
          return priorityB - priorityA;
        })
        .map((i) => ({
          ...i,
          groups: sortNestedEntityByPriority(i.groups, groupsAsObject),
        }));
      payload.groups = payload.groups.map((i) => ({
        ...i,
        items: sortNestedEntityByPriority(i.items, itemsAsObject),
        subgroups: sortNestedEntityByPriority(i.subgroups, groupsAsObject),
      }));
      payload.items = payload.items.map((i) => ({
        ...i,
        options: sortNestedEntityByPriority(i.options, optionsAsObject),
      }));
      payload.options = payload.options.map((i) => ({
        ...i,
        items: sortNestedEntityByPriority(i.items, itemsAsObject),
      }));

      const t = {
        ...state,
        groups: {
          array: payload.groups,
          hash: toObject(payload.groups),
        },
        items: {
          array: payload.items,
          hash: toObject(payload.items),
        },
        menus: {
          array: payload.menus,
          hash: toObject(payload.menus),
        },
        options: {
          array: payload.options,
          hash: toObject(payload.options),
        },
      };

      return t;
    }
    default:
      return state;
  }
};
