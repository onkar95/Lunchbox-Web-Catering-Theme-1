import React from "react";
import {withTheme, createGlobalStyle} from "styled-components";
import RcTab, {TabPane} from "rc-tabs";
import TabContent from "rc-tabs/lib/TabContent";
import InkTabBar from "rc-tabs/lib/InkTabBar";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";
import PropTypes from "prop-types";
import "rc-tabs/assets/index.css";
import "./rc-tab-overrides.scss";

const GlobalStyle = createGlobalStyle`
  .rc-tabs-tab-active.rc-tabs-tab:only-child {
    border-bottom-color: ${(props) =>
      props.theme.colors[props.backgrounds.active]}};
  }

  ${(props) => {
    if (props.backgrounds) {
      return `

        .rc-tabs-tab-active.rc-tabs-tab {
          background-color: ${(props) =>
            props.theme.colors[props.backgrounds.active]}
        }

        .rc-tabs-tab {
          background-color: ${(props) =>
            props.theme.colors[props.backgrounds.default]}
        }
      `;
    }
  }}

`;

const Tabs = React.memo(
  withTheme(
    ({
      activeKey = 0,
      onTabChange,
      children,
      tabBackgrounds,
      animated,
      ...props
    }) => (
      <>
        <GlobalStyle theme={props.theme} backgrounds={tabBackgrounds} />
        <RcTab
          onChange={onTabChange}
          tabBarPosition="top"
          activeKey={activeKey}
          {...props}
          renderTabBar={() =>
            props.scrolling ? (
              <ScrollableInkTabBar
                styles={{
                  height: "3px",
                }}
              />
            ) : (
              <InkTabBar
                styles={{
                  color: props.theme.colors[tabBackgrounds.active],
                  inkBar: {
                    backgroundColor: props.theme.colors[tabBackgrounds.active],
                    height: "2px",
                  },
                }}
              />
            )
          }
          renderTabContent={() => (
            <TabContent animated={animated} style={{flexGrow: "1"}} />
          )}
        >
          {children}
        </RcTab>
      </>
    ),
  ),
);

Tabs.propTypes = {
  activeTab: PropTypes.any,
  onTabChange: PropTypes.func,
  scrolling: PropTypes.bool,
};
Tabs.defaultProps = {
  activeTab: null,
  onTabChange: undefined,
  scrolling: false,
};

export {Tabs, TabPane as Tab};
export default {
  Tab: TabPane,
  Tabs,
};
