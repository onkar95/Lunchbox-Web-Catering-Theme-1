import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {ThemeText, View, Cell, ThemeButton} from "components/elementsThemed";
import {helpers} from "utils";
import styles from "./item.module.css";

const {
  Grid: {Col},
} = Lbc;

const Item = ({
  images = [],
  type,
  name,
  description,
  price,
  quantity,
  multiSelect,
  checked,
  ...props
}) => {
  const onClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (!checked) {
      props.onSelect(props.id, props.price);
    } else if (multiSelect) {
      props.onSelect(props.id, props.price);
    } else {
      props.onDeselect(props.id);
    }
  };

  const increment = () => {
    props.onSelect(props.id, props.price);
  };
  const decrement = () => {
    props.onDeselect(props.id);
  };
  const style = {};

  if (images[0]) {
    style.backgroundImage = `url(${images[0]})`;
  }
  return (
    <Col xs="1-2" sm="1-3">
      <Cell
        type={type}
        render={({labelTextStyles, views, button}) => (
          <View
            type={views.background}
            className={`${styles.item}`}
            onClick={!quantity ? onClick : null}
            style={style}
          >
            <div className={styles.name}>
              <ThemeText type={labelTextStyles.primary}>{name}</ThemeText>
            </div>
            <div className={styles.desc}>
              <ThemeText type={labelTextStyles.secondary}>
                {description}
              </ThemeText>
            </div>
            <div className={styles.price}>
              {price ? (
                <ThemeText type={labelTextStyles.secondary}>
                  {helpers.formatPrice(price)}
                </ThemeText>
              ) : null}
            </div>
            {quantity !== 0 && multiSelect && (
              <div className={styles.selectors}>
                <ThemeButton
                  type={button}
                  className={styles["quantity-btn"]}
                  onClick={decrement}
                >
                  -
                </ThemeButton>
                <View type={views.secondary} className={styles.quantity}>
                  <ThemeText type={labelTextStyles.tertiary}>
                    {quantity}
                  </ThemeText>
                </View>
                <ThemeButton
                  type={button}
                  className={styles["quantity-btn"]}
                  onClick={increment}
                >
                  +
                </ThemeButton>
              </div>
            )}
          </View>
        )}
      />
    </Col>
  );
};

export default React.memo(Item);
