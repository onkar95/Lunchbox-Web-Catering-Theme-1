import React, {useMemo} from "react";
import {useMenuContext} from "components/providers/Menu/menu";
import {formatPrice} from "utils/helpers";
import ConditionalWrapper from "components/elements/Condition/conditionalWrapper";
import {config} from "utils";
import {populateMods, formatModifierPrice} from "./utils";
import css from "./cartItem.module.scss";

const mapModItem = (modItem) => ({
  name: modItem.name,
  price: formatModifierPrice(modItem.price, modItem.quantity),
});

// Backend only support invalidItems noe
// invalidGroups and invalidItems are always empty for order/validate

export default (Component) => (props) => {
  const {
    item,
    type,
    group,
    mods,
    price,
    edit,
    remove,
    notes,
    isValid,
    removable = true,
  } = props;

  const {itemsHash, groupsHash, groups} = useMenuContext();

  const entityInformationMap = {
    group: groupsHash[group],
    item: itemsHash[item],
    unavailable: () => {
      const cartItem = JSON.parse(localStorage.getItem("items") ?? "[]").find(
        (cartItem) => cartItem.item === item,
      );
      return {
        description: cartItem?.description || "",
        name: cartItem?.name || "item unavailable",
      };
    },
  };

  const entityInformation =
    entityInformationMap[isGroup ? "group" : "item"] ??
    entityInformationMap.unavailable();

  const {images = [], name = "", description = ""} = entityInformation;

  const modifiers = useMemo(() => {
    const populatedMods = populateMods(mods, itemsHash);
    return populatedMods.reduce((accu, {items = []}) => {
      accu.push(...items.map(mapModItem));
      return accu;
    }, []);
  }, [itemsHash, mods]);

  const isGroup =
    props.isGroup ||
    groups.findIndex((i) => i.subgroups.includes(group)) !== -1;

  const generateButtonActions = ({isValid, removable}) => {
    const buttonsActions = [];
    if (isValid) {
      buttonsActions.push({
        action: edit,
        content: "Modify",
        type: "primary",
      });
    }
    if (removable) {
      buttonsActions.push({
        action: remove,
        content: "Remove",
        type: "secondary",
      });
    }
    return buttonsActions;
  };

  const buttonsActions = generateButtonActions({
    isValid,
    removable,
  });
  const cardImage = images[0] ?? config?.images?.art_item_placeholder;

  return (
    <ConditionalWrapper
      condition={!isValid}
      wrapper={(children) => <div className={css.invalidItem}>{children}</div>}
    >
      <Component
        themeType={config?.theme?.checkout?.cart_item || "Type1"}
        isGroup={isGroup}
        actionButtons={buttonsActions}
        title={name}
        price={formatPrice(price)}
        description={description}
        items={modifiers}
        imageSrc={cardImage}
        notes={notes}
        cellType={type}
      />
    </ConditionalWrapper>
  );
};
