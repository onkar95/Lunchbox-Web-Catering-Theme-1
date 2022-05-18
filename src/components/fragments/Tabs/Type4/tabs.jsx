import React, {Children} from "react";
import {withTheme} from "styled-components";
import {Segment, ThemeText, View} from "components/elementsThemed";
import RcTab, {TabPane} from "rc-tabs";
import TabContent from "rc-tabs/lib/TabContent";
import SaveRef from "rc-tabs/lib/SaveRef";
import TabBarTabsNode from "rc-tabs/lib/TabBarTabsNode";
import TabBarRootNode from "rc-tabs/lib/TabBarRootNode";
import PropTypes from "prop-types";
import "rc-tabs/assets/index.css";
import "./rc-tab-overrides.css";

const CustomInkBar = (props) => (
  <SaveRef>
    {(saveRef) => (
      <TabBarRootNode saveRef={saveRef} {...props}>
        <TabBarTabsNode
          onTabClick={props.onTabClick}
          saveRef={saveRef}
          {...props}
        />
      </TabBarRootNode>
    )}
  </SaveRef>
);

const Tabs = withTheme(
  ({type, activeKey = 0, onTabChange, children, ...props}) => {
    const renderChildren = (
      {selected, unselected},
      {unselected: backgroundUnselected, selected: backgroundSelected},
      view,
    ) =>
      Children.map(children, (child) => {
        const isActive = activeKey === child.key;
        const color = isActive ? backgroundSelected : backgroundUnselected;
        const hash = props.theme.colors[color];

        return (
          <TabPane
            key={child.key}
            tab={
              <View
                type={view}
                style={{
                  alignContent: "center",
                  backgroundColor: isActive ? hash : "white",
                  borderRadius: "50px",
                  display: "flex",
                  height: "30px",
                  justifyContent: "center",
                  margin: "0 auto",
                  textAlign: "center",
                  width: "30px",
                }}
              >
                <ThemeText type={isActive ? selected : unselected}>
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
      <Segment
        type={type}
        render={({segment: {stateTextStyles, stateBackgroundColors, view}}) => (
          <RcTab
            onChange={(...args) => {
              onTabChange(args[0].replace(".$", ""));
            }}
            tabBarPosition="top"
            {...props}
            activeKey={`.$${activeKey}`}
            renderTabBar={() => <CustomInkBar />}
            renderTabContent={() => (
              <TabContent animated style={{flexGrow: "1"}} />
            )}
          >
            {renderChildren(stateTextStyles, stateBackgroundColors, view)}
          </RcTab>
        )}
      />
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
