import React from "react";
import {Condition as If} from "components/elements";
import {
  View,
  ThemeButton as Button,
  ThemeText as Text,
} from "components/elementsThemed";
import {useCell} from "hooks";
import ClampLines from "react-clamp-lines";
import css from "./orderItemCard4.module.scss";

const OrderItemCard = ({
  cardCellType,
  cardNotes,
  cardTitle,
  cardPrice,
  cardItems,
  cardButtons,
}) => {
  const {labelTextStyles, views, buttons} = useCell(cardCellType);

  return (
    <View type={views.background} Component="li" className={css.orderItem}>
      <div className={css.info}>
        <div className={css.title}>
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
        <View type={views.secondary} className={css.desc}>
          <div className={css.mods}>
            <If is={cardItems.length}>
              {cardItems.map(({name: itemName, price: itemPrice}, idx) => (
                <div key={idx}>
                  <Text type={labelTextStyles.tertiary}>
                    {itemName} {itemPrice}
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

          <If is={cardButtons.length}>
            <div className={css.actions}>
              {cardButtons.map(({content, type, action}, index) => (
                <Button
                  key={index}
                  type={buttons[type]}
                  className={css["cart-btn"]}
                  onClick={action}
                >
                  {content}
                </Button>
              ))}
            </div>
          </If>
        </View>
      </div>
    </View>
  );
};

OrderItemCard.displayName = "OrderItemCard4";

export default OrderItemCard;
