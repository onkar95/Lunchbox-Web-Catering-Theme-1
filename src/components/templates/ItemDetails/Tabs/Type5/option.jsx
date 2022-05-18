import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {ThemeText, View} from "components/elementsThemed";
import {useCell} from "hooks";
import {ModifierItem} from "@lunchboxinc/lunchbox-components-v2/dist/templateComponents";
import css from "./option.module.scss";
import withOption from "../withOption";
import withModifierItem from "../withModifierItem";

const {
  Grid: {Row, Col},
} = Lbc;

const Modifier = withModifierItem(ModifierItem);

const Option = React.memo(
  ({
    error,
    errorRef,
    isMultiSelect,
    isOptionalSingle,
    isSameCalories,
    isSamePrice,
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
      <div className={css.option} ref={optionRef}>
        <View type={views.background} className={css["option-content"]}>
          <Row spacing={15}>
            <Col>
              <div>
                <div className={css["option-line"]}>
                  <ThemeText
                    type={labelTextStyles.secondary}
                    className={css["option-lineText"]}
                  >
                    {optionName}
                  </ThemeText>
                </div>
              </div>
            </Col>
            <div ref={errorRef} className={css["option-error"]}>
              {error && (
                <ThemeText type={labelTextStyles.tertiary}>{error}</ThemeText>
              )}
            </div>
          </Row>
        </View>

        <Row flex spacing={10} gutter={20} className={css["option-items"]}>
          {items.map(({id, name, price, calories, images}) => {
            const quantity = selectedMods.filter((x) => x.item === id).length;
            const cellType = quantity
              ? optionItemTypes.selected
              : optionItemTypes.default;
            const imgSrc = images[0] ? images[0] : "";
            return (
              <Modifier
                key={id}
                themeType={modifierThemeType}
                cellType={cellType}
                id={id}
                name={name}
                price={isSamePrice ? 0 : price}
                calories={isSameCalories ? 0 : calories}
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
      </div>
    );
  },
);

Option.displayName = "OptionType5";

export default withOption(Option);
