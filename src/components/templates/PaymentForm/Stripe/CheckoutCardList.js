import React from "react";
import {Layout} from "components/elements";
import {useCell} from "hooks";
import {ThemeText, View, Button, Radio} from "components/elementsThemed";
import {Copy} from "utils";
import {PATRON_UPDATE_CARD} from "utils/api";
import {ReactComponent as Master} from "assets/art_mastercard.svg";
import {ReactComponent as Visa} from "assets/art_visa.svg";
import {ReactComponent as Discover} from "assets/art_discover.svg";
import {ReactComponent as AmericanExpress} from "assets/art_americanexpress.svg";
import {ReactComponent as OtherCard} from "assets/art_other.svg";
import {cardFormat, GET_DELETE_CARD_ROUTE} from "pages/Profile/utils";
import css from "./stripe.module.scss";

const {Flex} = Layout;

const displayLogo = (brand) => {
  switch (brand) {
    case "Visa":
      return <Visa />;
    case "MasterCard":
      return <Master />;
    case "American Express":
      return <AmericanExpress />;
    case "Discover":
      return <Discover />;
    default:
      return <OtherCard />;
  }
};
const CheckoutCardList = ({resource, cells, onSuccess, history}) => {
  const {views: cellViews, labelTextStyles, buttons} = useCell(cells.cards);

  const toDeleteCard = (cardId) => () =>
    history.push(GET_DELETE_CARD_ROUTE(cardId));

  const toUpdateCard = (cardId) => async () => {
    try {
      await PATRON_UPDATE_CARD(cardId, {
        isCateringEnabled: 1,
        isPrimary: true,
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  const DisplayCards = () => {
    return resource.map((card) => {
      const {mappedLast4, mappedBrand} = cardFormat(
        card.brand,
        card.last4,
        card.expMonth,
        card.expYear,
      );
      return (
        <View
          type={cellViews?.background}
          key={card.id}
          className={css["cardsOnFile-item"]}
          Component={Flex}
          direction="row"
          justify="between"
        >
          <Flex direction="row" grow="1" justify="start" align="center">
            {card.primaryCard ? (
              <Radio
                type={buttons.secondary}
                checked
                onChange={toUpdateCard(card.id)}
              />
            ) : (
              <Radio
                type={buttons.secondary}
                checked={false}
                onChange={toUpdateCard(card.id)}
              />
            )}
            {displayLogo(mappedBrand)}
            <ThemeText type={labelTextStyles.secondary} className={css.digits}>
              {mappedLast4}
            </ThemeText>
          </Flex>
          <Button
            type={buttons.primary}
            className={css.makePrimary}
            onClick={toDeleteCard(card.id)}
          >
            {Copy.PROFILE_STATIC.DELETE_CARD_BUTTON_TEXT}
          </Button>
        </View>
      );
    });
  };

  return <>{DisplayCards()}</>;
};

export {CheckoutCardList};
