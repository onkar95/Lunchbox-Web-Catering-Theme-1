import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {Layout, Condition as If} from "components/elements";
import {ThemeText, View} from "components/elementsThemed";
import {useCell} from "hooks";
import {ModifierItem} from "@lunchboxinc/lunchbox-components-v2/dist/templateComponents";
import css from "./option.module.scss";
import withOption from "../withOption";
import withModifierItem from "../withModifierItem";

const Modifier = withModifierItem(ModifierItem);

const {
  Grid: {Row, Col},
} = Lbc;
const {Flex} = Layout;

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
          className={css.option}
          innerRef={optionRef}
        >
          <Row>
            <Col>
              <div ref={errorRef}>
                <ThemeText type={labelTextStyles.primary} className={css.name}>
                  {optionName}
                </ThemeText>
              </div>
            </Col>
            <If is={error}>
              <ThemeText type={labelTextStyles.secondary}>{error}</ThemeText>
            </If>
          </Row>
        </View>
        <Flex>
          <ul className={css.list}>
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
          </ul>
        </Flex>
      </>
    );
  },
);

export default withOption(Option);
