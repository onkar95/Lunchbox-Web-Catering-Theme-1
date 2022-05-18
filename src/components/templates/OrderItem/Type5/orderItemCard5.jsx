import React from "react";
import {Condition as If} from "components/elements";
import {
  View,
  ThemeButton as Button,
  ThemeText as Text,
} from "components/elementsThemed";
import {useCell} from "hooks";
import ClampLines from "react-clamp-lines";
import css from "./orderItemCard5.module.scss";

const OrderItemCard = ({
  cardCellType,
  cardNotes,
  cardTitle,
  cardPrice,
  cardItems,
  cardImage,
  cardButtons,
}) => {
  const {labelTextStyles, views, buttons} = useCell(cardCellType);
  return (
    <View type={views.background} Component="li" className={css.cartItem}>
      <div className={css["cartItem-info"]}>
        <div className={css["cartItem-info-title"]}>
          <Text type={labelTextStyles.primary} className={css.name}>
            <ClampLines
              id={0}
              buttons={false}
              text={cardTitle}
              lines={1}
              ellipsis="..."
            />
          </Text>
          <Text type={labelTextStyles.secondary} className={css.price}>
            {cardPrice}
          </Text>
        </div>
        <View type={views.secondary} className={css["cartItem-info-desc"]}>
          <div className={css.mods}>
            <If is={cardItems.length}>
              {cardItems.map(({name, price}, idx) => (
                <div key={idx}>
                  <Text type={labelTextStyles.tertiary}>
                    {name} {price}
                  </Text>
                </div>
              ))}
            </If>

            <If is={cardNotes}>
              <Text
                type={labelTextStyles.tertiary}
              >{`Note: ${cardNotes}`}</Text>
            </If>
          </div>
        </View>

        <If is={cardButtons.length}>
          <div className={css["cartItem-info-actions"]}>
            {cardButtons.map(({type, content, action}, idx) => (
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
        <div className={css["cartItem-image"]}>
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

OrderItemCard.displayName = "OrderItemCard5";

export default OrderItemCard;
