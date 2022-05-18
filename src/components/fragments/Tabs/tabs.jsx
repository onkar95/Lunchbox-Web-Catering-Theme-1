import React, {forwardRef} from "react";
import Styled from "styled-components";
import Posed, {PoseGroup} from "react-pose";
import PropTypes from "prop-types";
import styles from "./tabs.module.scss";
import {Headings} from "../../elements";

const {H3} = Headings;

const TabStyled = Styled.li`
  background-color: ${(props) => props.theme.colors.baseWhite};
  color: ${(props) =>
    props.active
      ? props.theme.colors.accentLight
      : props.theme.colors.baseBlack} !important;
  border-bottom-color: ${(props) =>
    props.active
      ? props.theme.colors.accentLight
      : props.theme.colors.alternateGray};
`;

// eslint-disable-next-line react/prop-types
const TabsContainer = ({children, ...props}) => (
  <ul className={styles["tab-container"]} {...props}>
    {children}
  </ul>
);

// eslint-disable-next-line react/prop-types
const TabContentsContainer = ({children, ...props}) => (
  <div className={styles["tab-content-container"]} {...props}>
    {children}
  </div>
);

// eslint-disable-next-line react/prop-types
const TabsContent = forwardRef(({children}, innerRef) => (
  <div
    ref={innerRef}
    className={styles["tab-content-container"]}
    htmltype="button"
    role="button"
  >
    <div className="panel-body">{children}</div>
  </div>
));
const Tab = Posed(TabsContent)({
  before: {
    x: (props) => (props.direction ? "100%" : "-100%"),
    y: "0%",
  },
  enter: {
    transition: {duration: 200},
    x: "0%",
    y: "0%",
  },
  exit: {
    transition: {duration: 200},
    x: (props) => (props.direction ? "100%" : "-100%"),
    y: "0%",
  },
});

Tab.propTypes = {
  active: PropTypes.bool,

  children: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  name: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
};

Tab.defaultProps = {
  active: false,
  children: null,
};

const Tabs = ({activeTab = 0, onTabChange, children}) => {
  const [active, setActive] = React.useState(activeTab);
  const [prevActive, setPrevActive] = React.useState(activeTab);

  const onClickTab = (nextTab) => {
    if (nextTab !== active) {
      setActive(nextTab);
      setPrevActive(active);
      typeof onTabChange === "function" && onTabChange(active, nextTab);
    }
  };

  return (
    <>
      <TabsContainer>
        {React.Children.map(children, (child, i) => (
          <TabStyled
            className={styles.tab}
            active={active === i}
            onClick={() => onClickTab(i)}
          >
            <H3>{child.props.name}</H3>
          </TabStyled>
        ))}
      </TabsContainer>
      <TabContentsContainer>
        <PoseGroup>
          {React.Children.map(children, (child, i) => {
            if (active === i) {
              return React.cloneElement(child, {
                direction: active > prevActive ? 1 : 0,
              });
            }
            return null;
          })}
        </PoseGroup>
      </TabContentsContainer>
    </>
  );
};

Tabs.propTypes = {
  activeTab: PropTypes.number,
  children: PropTypes.arrayOf(PropTypes.instanceOf(Tab)).isRequired,
  onTabChange: PropTypes.func,
};
Tabs.defaultProps = {
  activeTab: null,
  onTabChange: undefined,
};

export {Tabs, Tab};
export default {
  Tab,
  Tabs,
};
