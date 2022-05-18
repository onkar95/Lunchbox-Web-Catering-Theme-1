import React from "react";
import Styled from "styled-components";
import {ThemeText, View, Cell, Radio} from "components/elementsThemed";
import {helpers} from "utils";
import styles from "./item.module.css";

const Item = Styled((props) => {
  const onClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (props.checked) {
      props.onDeselect(props.id);
    } else {
      props.onSelect(props.id, props.price);
    }
  };

  return (
    <Cell
      type={props.type}
      render={({button, labelTextStyles, view}) => (
        <View
          type={view}
          Component="li"
          className={`${styles.item} ${props.className}`}
        >
          <div className={styles.name} onClick={onClick}>
            <ThemeText type={labelTextStyles.primary}>{props.name}</ThemeText>
          </div>
          <div className={styles.price}>
            {props.price ? (
              <ThemeText type={labelTextStyles.secondary}>
                {helpers.formatPrice(props.price)}
              </ThemeText>
            ) : null}
            &nbsp; &nbsp;
            <Radio
              type={button}
              className={styles.radio}
              value={props.checked}
              onChange={onClick}
            />
          </div>
        </View>
      )}
    />
  );
})`
  border-bottom-color: ${(props) => props.theme.colors.alternateGray}
`;

export default React.memo(Item);
