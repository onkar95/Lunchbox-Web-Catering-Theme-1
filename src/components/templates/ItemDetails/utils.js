import _cloneDeep from "lodash/cloneDeep";

let mod = ({optionId, items}) => ({
  items: items.map(optionItem),
  option: optionId,
});

let optionItem = ({index, price, itemId, mods}) => ({
  index,
  item: itemId,
  mods: mods.map(mod),
  price,
});

const modsReducer = (state, {type, payload}) => {
  switch (type) {
    case "ADD_MOD": {
      // add to the current mod list for this optionId, if not use empty array
      const newModList = [...(state[payload.optionId] || []), payload.modId];

      return {
        ...state,
        [payload.optionId]: newModList,
      };
    }
    case "REMOVE_MOD": {
      /* Filter out the mod from the current mod list for this optionId,
            remove the option key if mod array is empty */
      const removeIndex = state[payload.optionId].findIndex(
        (i) => i === payload.modId,
      );
      const newModList = state[payload.optionId].filter(
        (i, index) => index !== removeIndex,
      );
      const newState = {
        ...state,
      };

      if (newModList.length) {
        newState[payload.optionId] = newModList;
      } else {
        delete newState[payload.optionId];
      }
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

// Recusively map modifier options
const mapModifications = (mods) =>
  Object.entries(mods).reduce((accu, i) => {
    accu.push({
      items: i[1].map((x) => ({
        item: x.item,
        mods: mapModifications(x.mods),
      })),
      option: i[0],
    });
    return accu;
  }, []);

// Recusively flatten modifier options
const mergeModifications = (mods) =>
  Object.values(mods).reduce((accu, value = []) => {
    return [
      ...accu,
      ...value.map((i) => i.item),
      // ...value
      //   .map(({ mods: nestedMods }) => mergeModifications(nestedMods))
      //   .flat()
    ];
  }, []);

const sortOptions = (optionA = {}, optionB = {}) => {
  if (optionA === null) optionA = {};
  if (optionB === null) optionB = {};
  let weightA = 0;
  let weightB = 0;

  if (optionA.min) {
    weightA -= 1;
  } else {
    weightA += 1;
  }

  if (optionB.min) {
    weightB -= 1;
  } else {
    weightB += 1;
  }

  if (optionA.min && optionB.min) {
    if (optionB.min < optionA.min) {
      weightB += 1;
    } else if (optionB.min > optionA.min) {
      weightA += 1;
    }
  }

  if (optionA.max) {
    weightA -= 1;
  } else {
    weightA += 1;
  }
  if (optionB.max) {
    weightB -= 1;
  } else {
    weightB += 1;
  }

  if (optionA.max && optionB.max) {
    if (optionB.max < optionA.max) {
      weightB += 1;
    } else if (optionB.max > optionA.max) {
      weightA += 1;
    }
  }
  return {
    weightA,
    weightB,
  };
};

const mapItemTabs = (options = [], optionsHash, HARDCODES) => {
  let tabs = options.map((i) => ({entities: [i], name: i.name}));

  if (HARDCODES.optionsTabs && HARDCODES.optionsTabs.length) {
    tabs = HARDCODES.optionsTabs
      .map((tab) => {
        const entities = options
          .reduce((accu, option) => {
            const formatedName = option.name.toLowerCase().trim();
            // Find all options that match the hardcodes defined by the client
            const isAnOption = tab.optionNames.filter((optionName) =>
              formatedName.includes(optionName.toLowerCase()),
            ).length;
            if (tab.type === 0) {
              !isAnOption && accu.push(option.id);
            } else {
              isAnOption && accu.push(option.id);
            }
            return accu;
          }, [])
          .reduce((accu, optionId) => {
            // Filter out all optionItems that match diet if diet is selected
            const newOptions = _cloneDeep(optionsHash[optionId]);

            return [...accu, newOptions];
          }, []);

        return {
          entities: entities.filter((i) => i.items.length),
          name: tab.tabName,
        };
      })
      .filter((i) => i.entities.length);
  }

  tabs = tabs.map((i) => ({
    ...i,
    entities: i.entities.sort((optionA, optionB) => {
      const {weightA = 0, weightB = 0} = sortOptions(optionA, optionB);
      return weightA - weightB;
    }),
  }));

  return tabs;
};

const isRequiredOption = (option) => {
  return option.min && option.min !== 0;
};

const onlyRequiredEntities = (accu, i) => {
  const onlyRequiredEntities = i.entities.filter(isRequiredOption);
  if (onlyRequiredEntities.length) {
    accu.push({...i, entities: onlyRequiredEntities});
  }
  return accu;
};

const mergeUniqueItems = (value) =>
  value.reduce(
    (accu, i, originalIndex) => ({
      ...accu,
      [i.item]: [...(accu[i.item] || []), {...i, originalIndex}],
    }),
    {},
  );

const generateSource = (prevSource, option, index) => {
  return `${prevSource ? `${prevSource}.` : ""}${option}.${index}`;
};

const recursiveErrorChecking = (
  itemOptions,
  modifications,
  optionsHash,
  itemsHash,
  errors = [],
  source = "",
) => {
  const newErrors = itemOptions.reduce((accu, option) => {
    if (option.min) {
      if (
        !modifications[option.id] ||
        !modifications[option.id].length ||
        modifications[option.id].length < option.min
      ) {
        accu.push({
          message: `You must select at least ${option.min}`,
          optionId: option.id,
          source,
        });
      }
    }

    if (
      option.max &&
      modifications[option.id] &&
      modifications[option.id].length > option.max
    ) {
      accu.push({
        message: `You cannot select more than ${option.max}`,
        optionId: option.id,
        source,
      });
    }

    if (modifications[option.id] && modifications[option.id].length) {
      modifications[option.id].forEach((i, idx) => {
        const nextSource = generateSource(source, option.id, idx);
        const nestedErrors = recursiveErrorChecking(
          itemsHash[i.item].options,
          i.mods,
          optionsHash,
          itemsHash,
          [],
          nextSource,
        );
        accu = [...accu, ...nestedErrors];
      });
    }
    return accu;
  }, []);
  return [...errors, ...newErrors];
};

export {
  modsReducer,
  mapModifications,
  mergeModifications,
  mapItemTabs,
  isRequiredOption,
  onlyRequiredEntities,
  mergeUniqueItems,
  recursiveErrorChecking,
  generateSource,
};
export default {
  generateSource,
  isRequiredOption,
  mapItemTabs,
  mapModifications,
  mergeModifications,
  mergeUniqueItems,
  modsReducer,
  onlyRequiredEntities,
  recursiveErrorChecking,
};
