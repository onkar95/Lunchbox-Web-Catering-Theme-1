import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {Condition} from "components/elements";
import {ThemeText, Cell, View} from "components/elementsThemed";
import {Card as CardComps} from "components/fragments";
import {helpers} from "utils";
import styles from "./index.module.css";

const {Card} = CardComps;
const {
  Grid: {Row, Col},
} = Lbc;

const StandardWeb = ({cells, name, description, price, calories}) => (
  <Cell
    type={cells.header}
    render={({views, labelTextStyles}) => (
      <View type={views.background} Component={Card} shadow={false}>
        <div className={styles.cardBody}>
          <ThemeText type={labelTextStyles.primary}>{name}</ThemeText>
        </div>
        <div className={styles.cardBody}>
          <ThemeText type={labelTextStyles.secondary} color="black">
            {description}
          </ThemeText>
        </div>
        <div className={styles.cardBody}>
          <Row gutter={15}>
            <Col xs="1-2">
              <Condition is={price}>
                <ThemeText type={labelTextStyles.tertiary}>
                  {helpers.formatPrice(price)}
                </ThemeText>
              </Condition>
            </Col>
            <Col xs="1-2" style={{textAlign: "right"}}>
              {calories && (
                <ThemeText
                  type={labelTextStyles.tertiary}
                >{`${calories} cal`}</ThemeText>
              )}
            </Col>
          </Row>
        </div>
      </View>
    )}
  />
);

export default StandardWeb;
