import React, {useState, useRef, Children} from "react";
import {useOnClickOutside} from "hooks";
import styles from "./dropdown.module.scss";

const Dropdown = ({trigger, children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const toggle = () => [setIsOpen(!isOpen)];
  const onClose = () => setIsOpen(false);

  useOnClickOutside(ref, () => setIsOpen(false));
  return (
    <div ref={ref} style={{position: "relative"}}>
      {React.cloneElement(trigger, {onClick: toggle})}
      {isOpen && (
        <div className={styles.container}>
          {typeof children === "function"
            ? Children.only(children({onClose}))
            : React.Children.map(children, (child) =>
                React.cloneElement(child, {
                  onClick: () => {
                    child.props.onClick();
                    onClose();
                  },
                }),
              )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
