import React from "react";
import {helpers, config} from "utils";

const isMultiSelectable = (min, max) => {
  if (max) {
    if (min < max && max > 1) {
      return true;
    }
    if (max !== 1 && min === max) {
      return true;
    }
  } else if (min > 1 || min === 0) {
    return true;
  }
  return max === null;
};

const withOption =
  (Component) =>
  ({
    error,
    errorRef,
    forwardRef,
    id,
    isSingleSelectionOnly,
    items,
    max,
    min,
    name,
    onAddMod,
    onRemoveMod,
    optionItemTypes,
    optionRef,
    prefix,
    selectedMods,
    type,
  }) => {
    const isOptionalSingle = isSingleSelectionOnly ? true : !min && max === 1;
    const isMultiSelect = !isSingleSelectionOnly && isMultiSelectable(min, max);

    const onSelect = (modId, price) => {
      onAddMod({modId, optionId: id, price});
    };
    const onDeselect = (modId) => {
      onRemoveMod({modId, optionId: id});
    };

    const isValidPrice = !!items[0]?.price;
    const isSamePrice = items.every((item) => item.price === items[0].price);
    const optionName =
      isValidPrice && isSamePrice
        ? `${name}  |  +${helpers.formatPrice(items[0].price)} each`
        : name;

    const isSameCalories = (items) =>
      items.every((item) => item.calories === items[0].calories);

    const modifierThemeType =
      config?.theme?.item_details?.modifier_items || "Type1";

    const returnProps = {
      error,
      errorRef,
      forwardRef,
      isMultiSelect,
      isOptionalSingle,
      isSameCalories,
      isSamePrice,
      isSingleSelectionOnly,
      items,
      modifierThemeType,
      onDeselect,
      onSelect,
      optionItemTypes,
      optionName,
      optionRef,
      prefix,
      selectedMods,
      type,
    };

    return <Component {...returnProps} />;
  };

export default withOption;
