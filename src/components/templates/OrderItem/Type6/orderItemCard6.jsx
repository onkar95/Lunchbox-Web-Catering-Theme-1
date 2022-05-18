import React from "react";
import {Condition as If} from "components/elements";
import {
  View,
  ThemeButton as Button,
  ThemeText as Text,
} from "components/elementsThemed";
import {useCell} from "hooks";
import ClampLines from "react-clamp-lines";
import css from "./orderItemCard6.module.scss";

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
    <View type={views.background} Component="li" className={css.cartItem}>
      <div className={css["cartItem-info"]}>
        <div className={css["cartItem-title"]}>
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
        <View type={views.secondary} className={css["cartItem-desc"]}>
          <div className={css["cartItem-mods"]}>
            <If is={cardItems.length}>
              {cardItems.map(({name: itemName, price: itemPrice}, idx) => (
                <div key={idx}>
                  <Text type={labelTextStyles.tertiary}>
                    {itemName} {itemPrice}
                  </Text>
                </div>
              ))}
            </If>
            <If is={!cardItems.length}>
              <Text type={labelTextStyles.tertiary}>{cardDesc}</Text>
            </If>
            <If is={cardNotes}>
              <Text
                type={labelTextStyles.tertiary}
              >{`Note: ${cardNotes}`}</Text>
            </If>
          </div>
        </View>
        <If is={cardButtons.length}>
          <div className={css["cartItem-actions"]}>
            {cardButtons.map(({content, type, action}, index) => (
              <Button
                key={index}
                type={buttons[type]}
                className={css["cartItem-actions-btn"]}
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

const OrderItemCard6 = OrderItemCard;
OrderItemCard6.displayName = "OrderItemCard6";

export default OrderItemCard6;
