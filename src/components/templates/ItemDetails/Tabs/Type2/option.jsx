import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {ThemeText, View} from "components/elementsThemed";
import {useCell} from "hooks";
import {ModifierItem} from "@lunchboxinc/lunchbox-components-v2/dist/templateComponents";
import withOption from "../withOption";
import styles from "./option.module.scss";
import withModifierItem from "../withModifierItem";

const Modifier = withModifierItem(ModifierItem);

const {
  Grid: {Row, Col},
} = Lbc;

const Option = React.memo(
  ({
    error,
    errorRef,
    isMultiSelect,
    isOptionalSingle,
    isSingleSelectionOnly,
    items,
    modifierThemeType,
    onDeselect,
    onSelect,
    optionItemTypes,
    optionName,
    optionRef,
    selectedMods,
    type,
  }) => {
    const {labelTextStyles, views} = useCell(type);
    return (
      <>
        <View
          type={views.background}
          className={styles.option}
          innerRef={optionRef}
        >
          <Row spacing={15}>
            <Col>
              <div ref={errorRef}>
                <ThemeText
                  type={labelTextStyles.secondary}
                  className={styles.name}
                >
                  {optionName}
                </ThemeText>
              </div>
              {error && (
                <div>
                  <ThemeText type={labelTextStyles.tertiary}>{error}</ThemeText>
                </div>
              )}
            </Col>
          </Row>
        </View>
        <Row className={styles.modifierItems} flex spacing={15} gutter={20}>
          {items.map(({id, name, price, calories}) => {
            const quantity = selectedMods.filter((x) => x.item === id).length;
            const cellType = quantity
              ? optionItemTypes.selected
              : optionItemTypes.default;

            return (
              <Modifier
                key={id}
                themeType={modifierThemeType}
                cellType={cellType}
                id={id}
                name={name}
                price={price}
                calories={calories}
                multiSelect={isMultiSelect}
                isOptionalSingle={isOptionalSingle}
                isSingleSelect={isSingleSelectionOnly}
                quantity={quantity}
                checked={quantity}
                onSelect={onSelect}
                onDeselect={onDeselect}
              />
            );
          })}
        </Row>
      </>
    );
  },
);

export default withOption(Option);
