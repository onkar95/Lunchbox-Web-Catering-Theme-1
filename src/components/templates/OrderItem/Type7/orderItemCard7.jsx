import React from "react";
import {Condition as If} from "components/elements";
import {
  View,
  ThemeButton as Button,
  ThemeText as Text,
} from "components/elementsThemed";
import {useCell} from "hooks";
import styles from "./orderItemCard7.module.scss";

const OrderItemCard = ({
  cardCellType,
  cardNotes,
  cardTitle,
  cardPrice,
  cardDesc,
  cardItems,
  cardImage,
  cardButtons,
}) => {
  const {labelTextStyles, views, buttons} = useCell(cardCellType);
  return (
    <View type={views.background} Component="li" className={styles.cartItem}>
      <div className={styles["cartItem-left"]}>
        <div className={styles["cartItem-left--content"]}>
          <div className={styles["cartItem-title"]}>
            <Text
              type={labelTextStyles.primary}
              className={styles["cartItem-name"]}
            >
              {cardTitle}
            </Text>
            <Text
              type={labelTextStyles.secondary}
              className={styles["cartItem-price"]}
            >
              {cardPrice}
            </Text>
          </div>
          <View type={views.secondary} className={styles["cartItem-desc"]}>
            {cardDesc && (
              <Text
                className={styles["cartItem-desc--content"]}
                type={labelTextStyles.tertiary}
              >
                {cardDesc}
              </Text>
            )}
            <div className={styles["cartItem-desc--mods"]}>
              <If is={cardItems.length}>
                {cardItems.map(({name, price}, idx) => (
                  <div key={idx}>
                    <Text type={labelTextStyles.tertiary}>
                      {name} {price}
                    </Text>
                  </div>
                ))}
              </If>
            </div>
            <If is={cardNotes}>
              <Text
                className={styles["cartItem-desc--notes"]}
                type={labelTextStyles.tertiary}
              >
                {`Note: ${cardNotes}`}
              </Text>
            </If>
          </View>
        </div>

        <If is={cardButtons.length}>
          <div className={styles["cartItem-left--buttons"]}>
            {cardButtons.map(({type, content, action}, index) => (
              <Button
                key={index}
                type={buttons[type]}
                className={styles["cartItem-left--buttons-button"]}
                onClick={action}
              >
                {content}
              </Button>
            ))}
          </div>
        </If>
      </div>

      <If is={cardImage}>
        <div className={styles["cartItem-right"]}>
          <div
            className={styles["cartItem-right--image"]}
            style={{
              backgroundImage: `url(${cardImage})`,
            }}
          />
        </div>
      </If>
    </View>
  );
};

OrderItemCard.displayName = "OrderItemCard7";

export default OrderItemCard;
