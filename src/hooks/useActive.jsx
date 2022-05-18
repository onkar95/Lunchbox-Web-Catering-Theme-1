import {useState} from "react";

const useActive = (initState) => {
  const [isActive, setIsActive] = useState(initState);

  const toggle = () => setIsActive((prevState) => !prevState);
  const activate = () => setIsActive(true);
  const deactivate = () => setIsActive(false);

  return {
    activate,
    deactivate,
    isActive,
    toggle,
  };
};

export default useActive;
