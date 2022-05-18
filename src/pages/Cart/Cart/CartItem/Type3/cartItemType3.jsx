import React from "react";
import {Condition as If} from "components/elements";
import {Cell, View, ThemeButton, ThemeText} from "components/elementsThemed";
import styles from "./cartItemType3.module.css";

const CartItem = ({
  remove,
  edit,
  price,
  type,
  notes,
  editable = true,
  modifiers,
  entityInformation = {description: "", name: ""},
}) => {
  const {name = "", description = ""} = entityInformation;

  return (
    <Cell
      type={type}
      render={({labelTextStyles, views, buttons}) => (
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
              <If is={modifiers.length}>
                {modifiers.map(({name: modName, price: modPrice}, idx) => (
                  <div key={idx}>
                    <ThemeText type={labelTextStyles.tertiary}>
                      {modName} {modPrice}
                    </ThemeText>
                  </div>
                ))}
              </If>
              <If is={!modifiers.length}>
                <ThemeText type={labelTextStyles.tertiary}>
                  {description}
                </ThemeText>
              </If>
              <If is={notes}>
                <ThemeText type={labelTextStyles.tertiary}>
                  {`Note: ${notes}`}
                </ThemeText>
              </If>
            </View>
            <If is={editable}>
              <div className={styles.actions}>
                <ThemeButton
                  type={buttons.remove}
                  className={styles["cart-btn"]}
                  onClick={remove}
                >
                  Remove
                </ThemeButton>
                <ThemeButton
                  type={buttons.modify}
                  className={styles["cart-btn"]}
                  onClick={edit}
                >
                  Modify
                </ThemeButton>
              </div>
            </If>
          </div>
        </View>
      )}
    />
  );
};

export default CartItem;
