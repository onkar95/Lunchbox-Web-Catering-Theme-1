import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {ThemeText, View, Cell} from "components/elementsThemed";
import {helpers, Copy} from "utils";
import styles from "./index.module.scss";

const {
  Grid: {Row, Col},
} = Lbc;

const Item = ({items, selected, types, onSelect, error}) => {
  const onClick = (id) => () => {
    onSelect(id);
  };

  return (
    <div className={styles.container}>
      <Cell
        type={types.group}
        render={({views, labelTextStyles}) => (
          <View type={views.background} className={styles.option}>
            <Row spacing={15}>
              <Col>
                <ThemeText type={labelTextStyles.secondary}>
                  {Copy.ITEM_DETAILS_STATIC.SELECT_TEXT}
                </ThemeText>
              </Col>
              {error && (
                <div>
                  <ThemeText type={labelTextStyles.tertiary}>
                    {Copy.ITEM_DETAILS_STATIC.SELECTION_EMPTY_ERROR}
                  </ThemeText>
                </div>
              )}
            </Row>
          </View>
        )}
      />
      <Row gutter={15}>
        {items.map((i) => (
          <Col key={i.id} xs="1-2" sm="1-3">
            <Cell
              type={i.id === selected ? types.selected : types.default}
              render={({labelTextStyles, views}) => (
                <View
                  type={views.background}
                  className={styles.item}
                  onClick={onClick(i.id)}
                >
                  <div className={styles.name}>
                    <ThemeText type={labelTextStyles.primary}>
                      {i.name}
                    </ThemeText>
                  </div>
                  <div className={styles.desc}>
                    <ThemeText type={labelTextStyles.secondary}>
                      {i.description}
                    </ThemeText>
                  </div>
                  <div className={styles.price}>
                    <ThemeText type={labelTextStyles.secondary}>
                      {helpers.formatPrice(i.price)}
                    </ThemeText>
                  </div>
                </View>
              )}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default React.memo(Item);
