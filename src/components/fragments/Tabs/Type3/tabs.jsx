import React, {Children} from "react";
import {useSegment} from "hooks";
import {withTheme, createGlobalStyle} from "styled-components";
import {ThemeText, View} from "components/elementsThemed";
import RcTab, {TabPane} from "rc-tabs";
import TabContent from "rc-tabs/lib/TabContent";
import SaveRef from "rc-tabs/lib/SaveRef";
import TabBarTabsNode from "rc-tabs/lib/TabBarTabsNode";
import TabBarRootNode from "rc-tabs/lib/TabBarRootNode";
import PropTypes from "prop-types";
import InkTabBarNode from "./InkTabBarNode";

import "rc-tabs/assets/index.css";
import "./rc-tab-overrides.css";

const GlobalStyle = createGlobalStyle`
  .rc-tabs-tab-active.rc-tabs-tab:only-child {
    border-bottom-color: ${(props) =>
      props.theme.colors[props.backgrounds.active]}};
  }
`;

const CustomInkBar = (props) => (
  <SaveRef>
    {(saveRef, getRef) => (
      <TabBarRootNode saveRef={saveRef} {...props} prefixCls="tabs-type3">
        <TabBarTabsNode
          onTabClick={props.onTabClick}
          saveRef={saveRef}
          {...props}
        />
        <InkTabBarNode saveRef={saveRef} getRef={getRef} {...props} />
      </TabBarRootNode>
    )}
  </SaveRef>
);

const Tabs = withTheme(
  ({type, activeKey = 0, onTabChange, children, ...props}) => {
    const {
      segment: {stateTextStyles, stateBackgroundColors, view},
    } = useSegment(type);

    const renderChildren = Children.map(children, (child) => {
      const isActive = activeKey === child.key;
      return (
        <TabPane
          key={child.key}
          tab={
            <View type={view}>
              <ThemeText
                type={
                  isActive
                    ? stateTextStyles.selected
                    : stateTextStyles.unselected
                }
              >
                {child.props.title}
              </ThemeText>
            </View>
          }
        >
          {child.props.children}
        </TabPane>
      );
    });

    return (
      <>
        <GlobalStyle
          theme={props.theme}
          backgrounds={{
            active: stateBackgroundColors.selected,
            default: stateBackgroundColors.unselected,
          }}
        />
        <RcTab
          onChange={(...args) => {
            onTabChange(args[0].replace(".$", ""));
          }}
          tabBarPosition="top"
          {...props}
          activeKey={`.$${activeKey}`}
          renderTabBar={() => (
            <CustomInkBar
              styles={{
                inkBar: {
                  backgroundColor:
                    props.theme.colors[stateBackgroundColors.selected],
                },
              }}
            />
          )}
          renderTabContent={() => (
            <TabContent animated style={{flexGrow: "1"}} />
          )}
        >
          {renderChildren}
        </RcTab>
      </>
    );
  },
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
export default Tabs;
