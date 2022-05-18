import React from "react";
import {Condition as If} from "components/elements";
import {
  View,
  ThemeButton as Button,
  ThemeText as Text,
} from "components/elementsThemed";
import {useCell} from "hooks";
import css from "./orderItemCard0.module.scss";

const OrderItemCard = ({
  cardCellType,
  cardNotes,
  cardTitle,
  cardPrice,
  cardDesc,
  cardItems,
  cardButtons,
}) => {
  const {labelTextStyles, views, buttons} = useCell(cardCellType);

  return (
    <View Component="li" className={css.cartItem}>
      <div className={css["cartItem-container"]}>
        <div className={css["cartItem-title"]}>
          <Text type={labelTextStyles.primary} className={css["cartItem-name"]}>
            {cardTitle}
          </Text>
          <Text
            type={labelTextStyles.secondary}
            className={css["cartItem-price"]}
          >
            {cardPrice}
          </Text>
        </div>
        <View type={views.secondary} className={css["cartItem-desc"]}>
          {cardDesc && (
            <Text
              className={css["cartItem-desc--content"]}
              type={labelTextStyles.tertiary}
            >
              {cardDesc}
            </Text>
          )}
          <div className={css["cartItem-desc--mods"]}>
            <If is={cardItems.length}>
              {cardItems.map(({name, price}, idx) => (
                <Text key={idx} type={labelTextStyles.tertiary}>
                  {name} {price}
                </Text>
              ))}
            </If>
          </div>
          <If is={cardNotes}>
            <Text
              className={css["cartItem-desc--notes"]}
              type={labelTextStyles.tertiary}
            >
              Note: {cardNotes}
            </Text>
          </If>
        </View>
        <If is={cardButtons.length}>
          <div className={css["cartItem-actions"]}>
            {cardButtons.map(({action, content, type}, idx) => (
              <Button
                key={idx}
                type={buttons[type]}
                className={css["cartItem-btn"]}
                onClick={action}
              >
                {content}
              </Button>
            ))}
          </div>
        </If>
      </div>
    </View>
  );
};

OrderItemCard.displayName = "OrderItemCard0";

export default OrderItemCard;
