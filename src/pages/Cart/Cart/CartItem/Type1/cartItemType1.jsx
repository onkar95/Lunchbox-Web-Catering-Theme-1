import React from "react";
import {Elements, ElementsThemed} from "components";
import {useMenuContext} from "components/providers/Menu/menu";
import {config} from "utils";
import styles from "./cartItemType1.module.css";

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
      className={styles["item-image"]}
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
        <View type={views.background} Component="li" className={styles.card}>
          <div className={styles.info}>
            <div className={styles.title}>
              <ThemeText type={labelTextStyles.primary} className={styles.name}>
                {name}
              </ThemeText>
              <ThemeText
                type={labelTextStyles.secondary}
                className={styles.price}
              >
                {price}
              </ThemeText>
            </div>
            <View type={views.secondary} className={styles.desc}>
              <ThemeText type={labelTextStyles.tertiary}>
                {description}
              </ThemeText>
              {filterMods(mods, optionsHash, itemsHash).map((mod, index) => {
                return (
                  <ThemeText
                    key={index}
                    type={labelTextStyles.secondary}
                    className={styles.mod}
                  >
                    {itemsHash[mod].name}
                  </ThemeText>
                );
              })}
            </View>
            <Condition is={editable}>
              <div className={styles.actions}>
                <ThemeButton
                  type={button}
                  className={styles["cart-btn"]}
                  onClick={remove}
                >
                  Remove
                </ThemeButton>
                <ThemeButton
                  type={button}
                  className={styles["cart-btn"]}
                  onClick={edit}
                >
                  Modify
                </ThemeButton>
              </div>
            </Condition>
          </div>
          <div className={styles.image}>{img}</div>
        </View>
      )}
    />
  );
};

export default CartItem;
