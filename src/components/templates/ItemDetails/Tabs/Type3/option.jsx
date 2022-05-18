import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {ThemeText, View} from "components/elementsThemed";
import {useCell} from "hooks";
import {ModifierItem} from "@lunchboxinc/lunchbox-components-v2/dist/templateComponents";
import styles from "./option.module.css";
import withOption from "../withOption";
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
    const {views, labelTextStyles} = useCell(type);

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
                  type={labelTextStyles.primary}
                  className={styles.name}
                >
                  {optionName}
                </ThemeText>
              </div>
            </Col>
            {error && (
              <div>
                <ThemeText type={labelTextStyles.tertiary}>{error}</ThemeText>
              </div>
            )}
          </Row>
        </View>
        <Row flex spacing={10} gutter={20} className={styles.items}>
          {items.map(({id, name, price, calories, images}) => {
            const quantity = selectedMods.filter((x) => x.item === id).length;
            const cellType = quantity
              ? optionItemTypes.selected
              : optionItemTypes.default;
            const imgSrc = images[0]
              ? images[0]
              : "";
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
                imgSrc={imgSrc}
              />
            );
          })}
        </Row>
      </>
    );
  },
);

export default withOption(Option);
