import React from "react";
import {Tabs2} from "components/fragments";
import {ThemeText} from "components/elementsThemed";

import Option from "./option";

const {Tabs, Tab} = Tabs2;

const findError = (errors, id) => {
  const match = errors.find((i) => i.optionId === id);
  if (match) {
    return match.message;
  }
  return null;
};

const StandardWeb = ({
  tabs,
  segment: {stateBackgroundColors, stateTextStyles},
  cells,
  errors,
  addToMods,
  removeMod,
  menuOptions,
  modifications,
}) => {
  const [activeKey, setActiveKey] = React.useState(
    tabs && tabs[0] ? tabs[0].name : undefined,
  );
  return (
    <Tabs
      activeKey={activeKey}
      onTabChange={setActiveKey}
      tabBackgrounds={{
        active: stateBackgroundColors.selected,
        default: stateBackgroundColors.unselected,
      }}
    >
      {tabs.map((i) => {
        const type =
          activeKey === i.name
            ? stateTextStyles.selected
            : stateTextStyles.unselected;
        return (
          <Tab key={i.name} tab={<ThemeText type={type}>{i.name}</ThemeText>}>
            {i.entities.map((option) => (
              <Option
                key={option.id}
                type={cells.group}
                optionItemType={cells.primary}
                {...menuOptions[option.id]}
                error={findError(errors, option.id)}
                selectedMods={modifications[option.id] || []}
                onAddMod={addToMods}
                onRemoveMod={removeMod}
              />
            ))}
          </Tab>
        );
      })}
    </Tabs>
  );
};

export default StandardWeb;
