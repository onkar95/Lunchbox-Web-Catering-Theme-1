import React, {useState, useEffect, useRef} from "react";
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
  parent,
  prefix,
  cells,
  errors,
  scrollToErrors,
  addToMods,
  removeMod,
  menuOptions,
  modifications,
}) => {
  const [activeKey, setActiveKey] = useState(
    tabs && tabs[0] ? tabs[0].name : undefined,
  );
  const errorRefs = useRef([...Array(10)].map(() => React.createRef()));
  useEffect(() => {
    if ((errors && errors.length === 0) || !scrollToErrors) {
      return;
    }
    for (const errorRef of errorRefs.current) {
      if (errorRef.current !== null) {
        document.getElementById("itemDetailsContainer").scrollTo({
          behavior: "smooth",
          top:
            (parent.current ? parent.current.offsetTop : 0) +
            errorRef.current.offsetTop,
        });
        break;
      }
    }
  }, [errors, errors.length, parent, scrollToErrors]);

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
          <Tab
            key={i.name}
            scrolling
            tab={<ThemeText type={type}>{i.name}</ThemeText>}
          >
            {i.entities.map((option, index) => (
              <Option
                key={option.id}
                prefix={prefix}
                forwardRef={errorRefs.current[index]}
                type={cells.group}
                optionItemTypes={{
                  default: cells.primary,
                  selected: cells.primarySelected,
                }}
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
