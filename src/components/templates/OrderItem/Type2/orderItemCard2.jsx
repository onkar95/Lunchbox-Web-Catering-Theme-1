import React from "react";
import {Condition as If} from "components/elements";
import {
  View,
  ThemeButton as Button,
  ThemeText as Text,
} from "components/elementsThemed";
import {useCell} from "hooks";
import ClampLines from "react-clamp-lines";
import css from "./orderItemCard2.module.scss";

const OrderItemCard = ({
  cardCellType,
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
        <If is={cardDesc}>
          <View type={views.secondary} className={css.desc}>
            <Text type={labelTextStyles.tertiary}>
              <ClampLines
                id={1}
                buttons={false}
                text={cardDesc}
                lines={3}
                ellipsis="..."
              />
            </Text>
          </View>
        </If>
        <If is={cardItems.length}>
          {cardItems.map(({name, price}, idx) => (
            <Text key={idx} type={labelTextStyles.tertiary}>
              {name} {price}
            </Text>
          ))}
        </If>
        <View type={views.secondary} className={css.desc}>
          <If is={cardItems.length}>
            {cardItems.map(({name, price}, idx) => (
              <Text key={idx} type={labelTextStyles.tertiary}>
                {name} {price}
              </Text>
            ))}
          </If>
        </View>

        <If is={cardButtons.length}>
          <div className={css.actions}>
            {cardButtons.map(({type, content, action}, index) => (
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

OrderItemCard.displayName = "OrderItemCard2";

export default OrderItemCard;
