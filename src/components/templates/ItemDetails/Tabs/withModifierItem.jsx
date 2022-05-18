import React from "react";
import {config, helpers} from "utils";

const withModifierItem = (Component) => (props) => {
  const {
    id,
    price,
    multiSelect,
    checked,
    onSelect,
    onDeselect,
    isDefault,
    themeType,
    cellType,
    name,
    calories,
    isOptionalSingle,
    isSingleSelect,
    quantity,
    imgSrc,
  } = props;

  const onClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (!checked) {
      onSelect(id, price);
    } else if (multiSelect) {
      onSelect(id, price);
    } else if (
      config.theme.item_details.is_default_modifier_unselectable ||
      !isDefault
    ) {
      onDeselect(id);
    }
  };

  const increment = () => {
    onSelect(id, price);
  };
  const decrement = () => {
    onDeselect(id);
  };

  const returnProps = {
    calories,
    cellType,
    checked,
    decrement,
    id,
    imgSrc,
    increment,
    isOptionalSingle,
    isSingleSelect,
    multiSelect,
    name,
    onClick,
    price: helpers.formatPrice(price),
    quantity,
    themeType,
  };

  return <Component {...returnProps} />;
};

export default withModifierItem;
