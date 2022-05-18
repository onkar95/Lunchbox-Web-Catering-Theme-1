import React from "react";
import {ThemeText, Cell, View} from "components/elementsThemed";
import Item from "./item";
import styles from "./itemDetailGroupType3.module.css";

const Option = React.memo(
  ({
    onAddMod,
    onRemoveMod,
    selectedMods,
    error,
    type,
    optionItemType,
    ...props
  }) => {
    const onSelect = (modId, price) => {
      onAddMod({modId, optionId: props.id, price});
    };
    const onDeselect = (modId) => {
      onRemoveMod({modId, optionId: props.id});
    };

    return (
      <Cell
        type={type}
        render={({labelTextStyles, views}) => (
          <View type={views} Component="ul" className={styles.option}>
            <div className={styles.title}>
              <ThemeText type={labelTextStyles.primary}>{props.name}</ThemeText>
              {error && (
                <div>
                  <ThemeText type={labelTextStyles.tertiary}>{error}</ThemeText>
                </div>
              )}
            </div>
            {props.items.map((i) => (
              <Item
                key={i.id}
                type={optionItemType}
                {...i}
                checked={selectedMods.includes(i.id)}
                onSelect={onSelect}
                onDeselect={onDeselect}
              />
            ))}
          </View>
        )}
      />
    );
  },
);

export default Option;
