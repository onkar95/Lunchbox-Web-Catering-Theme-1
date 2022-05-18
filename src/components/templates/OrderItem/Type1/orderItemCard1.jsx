import React from "react";
import {Condition as If} from "components/elements";
import {
  View,
  ThemeButton as Button,
  ThemeText as Text,
} from "components/elementsThemed";
import {useCell} from "hooks";
import css from "./orderItemCard1.module.scss";

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
    <View type={views.background} Component="li" className={css.card}>
      <div className={css.info}>
        <div className={css.title}>
          <Text type={labelTextStyles.primary} className={css.name}>
            {cardTitle}
          </Text>
          <Text type={labelTextStyles.secondary} className={css.price}>
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
          <div className={css.actions}>
            {cardButtons.map(({action, content, type}, idx) => (
              <Button
                key={idx}
                type={buttons[type]}
                className={css["cart-btn"]}
                onClick={action}
              >
                {content}
              </Button>
            ))}
          </div>
        </If>
      </div>
      <If is={cardImage}>
        <div className={css.image}>
          <div
            className={css["item-image"]}
            style={{
              backgroundImage: `url(${cardImage})`,
            }}
          />
        </div>
      </If>
    </View>
  );
};

OrderItemCard.displayName = "OrderItemCard1";

export default OrderItemCard;
