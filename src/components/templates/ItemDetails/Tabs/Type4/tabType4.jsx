import React, {useRef, useEffect} from "react";
import styles from "./index.module.scss";
import Option from "./option";

const findError = (errors, id) => {
  const match = errors.find((i) => i.optionId === id);
  if (match) {
    return match.message;
  }
  return null;
};

const Type4 = ({
  tabs,
  cells,
  errors,
  addToMods,
  removeMod,
  menuOptions,
  modifications,
  prefix,
}) => {
  const errorRefs = useRef({});

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

export default Type4;
