import React, {useEffect, useRef} from "react";
import styles from "./index.module.css";
import Option from "./option";

const findError = (errors, id) => {
  const match = errors.find((i) => i.optionId === id);
  if (match) {
    return match.message;
  }
  return null;
};

const StandardStickysWeb = ({
  tabs,
  prefix,
  cells,
  errors,
  addToMods,
  removeMod,
  menuOptions,
  modifications,
}) => {
  const errorRefs = useRef({});

  // used to scroll to any menu option that has invalid number of selection(s).
  useEffect(() => {
    if (errors && errors.length > 0) {
      const errorOptionId = errors[0].optionId;
      const firstErrorRef = errorRefs.current[errorOptionId];
      const el = document.getElementById("itemDetailsContainer");

      if (firstErrorRef.node !== null) {
        el.scrollTo({
          behavior: "smooth",
          top: firstErrorRef.node.offsetTop - 100,
        });
      }
    }
  }, [errors]);
  return (
    <div className={styles.container}>
      {tabs.map((i) =>
        i.entities.map((option) => (
          <Option
            key={option.id}
            prefix={prefix}
            optionRef={() => null}
            errorRef={(node) => {
              errorRefs.current[option.id] = {
                node,
                optionId: option.id,
              };
            }}
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
        )),
      )}
    </div>
  );
};

export default StandardStickysWeb;
