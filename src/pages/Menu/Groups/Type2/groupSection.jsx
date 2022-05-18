import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import ItemSelector from "pages/Menu/Items";
import {ElementsThemed} from "components";
import {useMenuContext} from "components/providers/Menu/menu";
import {helpers} from "utils";
import styles from "./index.module.scss";

const {
  Grid: {Row, Col},
} = Lbc;

const {ThemeText, Cell, View} = ElementsThemed;
const {formatPrice} = helpers;

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
    ...subgroups.map((i) => {
      const prices = i.items.map((item) => item.price);
      const priceRange = [Math.min(...prices), Math.max(...prices)];

      return (
        <Col key={i.id} className="menu-item" xs="1" sm="1-2" md="1-3" xl="1-4">
          <ItemSelector
            isViewOnly={isViewOnly}
            isGroup
            type={itemType}
            {...i}
            price={formatPrice(priceRange)}
            onAdd={(item, quantity) =>
              onAdd({group: i.id, isGroup: true, ...item}, quantity)
            }
          />
        </Col>
      );
    }),
    ...items.map((i) => {
      const getPriceRange = (item) => {
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

      const price = i.price || getPriceRange(i);

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
          <View type={views.background} className={styles["group-info"]}>
            <ThemeText
              type={labelTextStyles.primary}
              className={styles["group-name"]}
            >
              {name}
            </ThemeText>
            <ThemeText
              type={labelTextStyles.secondary}
              className={styles["group-description"]}
            >
              {description}
            </ThemeText>
          </View>

          <div className={styles["group-items"]}>
            <Row className={styles.grid} flex gutter={30}>
              {itemComps}
            </Row>
          </div>
        </View>
      )}
    />
  );
};

export default Group;
