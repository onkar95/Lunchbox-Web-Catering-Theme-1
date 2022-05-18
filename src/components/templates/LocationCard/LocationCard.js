import React from "react";
import {ThemeText, View} from "components/elementsThemed";
import {useCell} from "hooks";
import css from "./LocationCard.module.scss";

const LocationCard = React.memo(
  ({
    id,
    name,
    address,
    style,
    distanceInMiles,
    formattedPhone,
    onSelect,
    ...props
  }) => {
    const {views, labelTextStyles} = useCell(props.type);
    return (
      <View
        className={css["locationCard"]}
        type={views.background}
        innerRef={props.innerRef}
        onClick={onSelect}
      >
        <ThemeText type={labelTextStyles.primary}>{name}</ThemeText>
        <ThemeText type={labelTextStyles.secondary}>{`${address.street1} ${
          address.street2 || ""
        }  ${address.city}  ${address.state} ${address.zip}`}</ThemeText>
        <ThemeText type={labelTextStyles.secondary}>{formattedPhone}</ThemeText>
      </View>
    );
  },
);

export default LocationCard;
