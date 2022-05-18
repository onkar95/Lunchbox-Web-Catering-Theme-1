import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import ItemSelector from "pages/Menu/Items";
import {ThemeText, Cell, View} from "components/elementsThemed";

import {useMenuContext} from "components/providers/Menu/menu";
import {helpers} from "utils";
import styles from "./index.module.scss";

const {
  Grid: {Row, Col},
} = Lbc;

const {formatPrice} = helpers;

const priceRange = (items) => {
  const prices = items.map((item) => item.price);
  const minPrice = formatPrice(Math.min(...prices));
  const maxPrice = formatPrice(Math.max(...prices));
  return `${minPrice}-${maxPrice}`;
};

const getPriceRange = (item, optionsHash) => {
  const requiredOptions = item.options
    .map((option) => optionsHash[option])
    .filter((option) => option && option.min !== 0);
  const priceRange = requiredOptions.reduce(
    (acc, cur) => {
      const prices = cur.items.map((i) => i.price);
      return [acc[0] + Math.min(...prices), acc[1] + Math.max(...prices)];
    },
    [0, 0],
  );
  return priceRange;
};

const Group = ({
  id,
  name,
  description,
  items,
  onAdd,
  type,
  itemType,
  subgroups,
  isViewOnly,
}) => {
  const {optionsHash} = useMenuContext();
  const itemComps = [
    ...subgroups.map((i) => (
      <Col key={i.id} className="menu-item" xs="1" sm="1-2" md="1-3" xl="1-4">
        <ItemSelector
          type={itemType}
          isViewOnly={isViewOnly}
          isGroup
          {...i}
          price={priceRange(i.items)}
          onAdd={(item, quantity) =>
            onAdd({group: i.id, isGroup: true, ...item}, quantity)
          }
        />
      </Col>
    )),
    ...items.map((i) => {
      const price = i.price || getPriceRange(i, optionsHash);
      return (
        <Col key={i.id} className="menu-item" xs="1" sm="1-2" md="1-3" xl="1-4">
          <ItemSelector
            isViewOnly={isViewOnly}
            type={itemType}
            {...i}
            price={formatPrice(price)}
            onAdd={(item, quantity) => {
              onAdd({group: id, ...item, isGroup: false}, quantity);
            }}
          />
        </Col>
      );
    }),
  ];

  return (
    <Cell
      type={type}
      render={({labelTextStyles, views}) => (
        <View type={views.background} className={styles.group}>
          <Row>
            <Col
              className={styles["group-info"]}
              xs="1"
              sm={{offset: "1-8", span: "3-4"}}
              md={{offset: "1-4", span: "1-2"}}
            >
              <ThemeText
                type={labelTextStyles.primary}
                className={styles["group-title"]}
              >
                {name}
              </ThemeText>
              <ThemeText
                type={labelTextStyles.secondary}
                className={styles["group-description"]}
              >
                {description}
              </ThemeText>
            </Col>
          </Row>
          <div className={styles["group-items"]}>
            <Row className={styles.grid} flex gutter={20}>
              {itemComps}
            </Row>
          </div>
        </View>
      )}
    />
  );
};

export default Group;
