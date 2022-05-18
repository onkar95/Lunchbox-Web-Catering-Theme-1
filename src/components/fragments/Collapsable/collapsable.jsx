import React from "react";
import PropTypes from "prop-types";
import styles from "./collapsable.module.css";

const Open = ({children}) => children;
const Close = ({children}) => children;

const Collapsable = React.memo(({onToggle, children, title, ...props}) => {
  const [isOpen, setIsOpen] = React.useState(props.isOpen);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    props.onToggle && props.onToggle(isOpen);
  }, [isOpen]);

  const open = React.Children.toArray(children).find((i) => i.type === Open);
  const close = React.Children.toArray(children).find((i) => i.type === Close);

  return (
    <>
      <div className={styles.container} role="button" onClick={toggle}>
        <span className={styles.title}>{title}</span>
        <span className={styles.toggle}>
          <i className={isOpen ? styles.down : styles.left} />
        </span>
      </div>
      <div className={styles.content}>{isOpen ? open : close}</div>
    </>
  );
});

Collapsable.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  title: PropTypes.node,
};

Collapsable.defaultProps = {
  children: null,
  isOpen: false,
  onToggle: undefined,
  title: null,
};

export {Collapsable, Close, Open};
export default Collapsable;
