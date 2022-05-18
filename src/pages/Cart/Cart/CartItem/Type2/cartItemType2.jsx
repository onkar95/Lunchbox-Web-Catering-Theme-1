import React from "react";
import {Elements, ElementsThemed} from "components";
import {useMenuContext} from "components/providers/Menu/menu";
import {config, helpers} from "utils";
import css from "./cartItemType2.module.css";

const {Condition} = Elements;
const {Cell, View, ThemeButton, ThemeText} = ElementsThemed;

const filterMods = (mods, optionsHash, itemsHash) => {
  return mods
    .filter((i) => optionsHash[i.option])
    .map((mod) => mod.items.filter((i) => itemsHash[i]))
    .flat();
};

const CartItem = (props) => {
  const {remove, edit, price, type, item, group, mods, editable = true} = props;
  const {itemsHash, groupsHash, optionsHash, groups} = useMenuContext();
  const isGroup = groups.findIndex((i) => i.subgroups.includes(group)) !== -1;
  const {images: groupImages = [], name: groupName} = groupsHash[group];
  const {
    images: itemImages = [],
    name: itemName,
    description: itemDescription,
  } = itemsHash[item];
  const name = isGroup ? `${groupName}-${itemName}` : itemName;
  const image = isGroup ? groupImages[0] : itemImages[0];
  const description = itemDescription;
  const img = (
    <div
      className={css["item-image"]}
      style={{
        backgroundImage: `url(${
          image ?? config?.images?.art_item_placeholder
        })`,
      }}
    />
  );
  return (
    <Cell
      type={type}
      render={({labelTextStyles, views, button}) => (
        <View type={views.background} Component="li" className={css.card}>
          <div className={css.info}>
            <div className={css.title}>
              <ThemeText type={labelTextStyles.primary} className={css.name}>
                {name}
              </ThemeText>
              <ThemeText type={labelTextStyles.secondary} className={css.price}>
                {helpers.formatPrice(price)}
              </ThemeText>
            </div>
            <View type={views.secondary} className={css.desc}>
              <ThemeText type={labelTextStyles.tertiary}>
                {description}
              </ThemeText>
              {filterMods(mods, optionsHash, itemsHash).map((mod, index) => (
                <>
                  <ThemeText
                    key={index}
                    type={labelTextStyles.secondary}
                    className={css.mod}
                  >
                    {itemsHash[mod].name}
                  </ThemeText>
                  &nbsp;
                </>
              ))}
            </View>
            <Condition is={editable}>
              <div className={css.actions}>
                <ThemeButton
                  type={button}
                  className={css["cart-btn"]}
                  onClick={remove}
                >
                  Remove
                </ThemeButton>
                <ThemeButton
                  type={button}
                  className={css["cart-btn"]}
                  onClick={edit}
                >
                  Modify
                </ThemeButton>
              </div>
            </Condition>
          </div>
          <div className={css.image}>{img}</div>
        </View>
      )}
    />
  );
};

export default CartItem;
