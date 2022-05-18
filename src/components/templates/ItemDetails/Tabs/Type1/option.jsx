import React from "react";
import {Condition as If} from "components/elements";
import {ThemeText, View} from "components/elementsThemed";
import {useCell} from "hooks";
import {ModifierItem} from "@lunchboxinc/lunchbox-components-v2/dist/templateComponents";
import withOption from "../withOption";
import styles from "./option.module.scss";
import withModifierItem from "../withModifierItem";

const Modifier = withModifierItem(ModifierItem);

const Option = React.memo(
  ({
    error,
    forwardRef,
    isMultiSelect,
    isOptionalSingle,
    isSingleSelectionOnly,
    items,
    modifierThemeType,
    onDeselect,
    onSelect,
    optionItemTypes,
    optionName,
    prefix,
    selectedMods,
    type,
  }) => {
    const {labelTextStyles, views} = useCell(type);
    return (
      <View type={views} Component="ul" className={styles.option}>
        <div className={styles.title}>
          <ThemeText type={labelTextStyles.primary}>
            <If is={prefix}>
              <>
                {prefix}
                <br />
              </>
            </If>
            {optionName}
          </ThemeText>
          <If is={error}>
            <div ref={forwardRef}>
              <ThemeText type={labelTextStyles.tertiary}>{error}</ThemeText>
            </div>
          </If>
        </div>
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
      </View>
    );
  },
);

export default withOption(Option);
