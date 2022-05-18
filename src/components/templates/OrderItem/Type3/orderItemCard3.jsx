import React from "react";
import {Layout, Condition as If} from "components/elements";
import {
  View,
  ThemeButton as Button,
  ThemeText as Text,
} from "components/elementsThemed";
import {useCell} from "hooks";
import ClampLines from "react-clamp-lines";
import css from "./orderItemCard3.module.scss";

const {Flex} = Layout;

const OrderItemCard = ({
  cardCellType,
  cardTitle,
  cardPrice,
  cardDesc,
  cardImage,
  cardButtons,
}) => {
  const {labelTextStyles, views, buttons} = useCell(cardCellType);

  return (
    <View type={views.background} Component="li" className={css.card}>
      <div className={css.info}>
        <View type={views.secondary} className={css.content}>
          <div className={css.title}>
            <Text type={labelTextStyles.primary} className={css.name}>
              {cardTitle}
            </Text>
          </div>
          <If is={cardDesc}>
            <div className={css.desc}>
              <Text type={labelTextStyles.tertiary}>
                <ClampLines
                  id={1}
                  buttons={false}
                  text={cardDesc}
                  lines={3}
                  ellipsis="..."
                />
              </Text>
            </div>
          </If>
        </View>

        <Flex direction="row" justify="between" className={css.actions}>
          <View type={views.secondary} className={css["actions-cell"]}>
            <Text type={labelTextStyles.secondary} className={css.price}>
              {cardPrice}
            </Text>
          </View>

          <If is={cardButtons.length}>
            <View type={views.secondary} className={css["actions-cell"]}>
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
            </View>
          </If>
        </Flex>
      </div>
      <If is={cardImage}>
        <div className={css.image}>
          {/* <Button
          type={buttons.secondary}
          className={css["cart-remove-btn"]}
          onClick={remove}
        >
          <Image
            className={css["cart-remove-btn-img"]}
            mediaName="button_price_clear"
            mediaType="svg"
            alt="remove item"
          />
        </Button>

 */}
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
OrderItemCard.displayName = "OrderItemCard3";
export default OrderItemCard;
