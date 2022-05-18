import React, {Children} from "react";
import {withTheme, createGlobalStyle} from "styled-components";
import {Segment, ThemeText, View} from "components/elementsThemed";
import RcTab, {TabPane} from "rc-tabs";
import TabContent from "rc-tabs/lib/TabContent";
import SaveRef from "rc-tabs/lib/SaveRef";
import TabBarTabsNode from "rc-tabs/lib/TabBarTabsNode";
import TabBarRootNode from "rc-tabs/lib/TabBarRootNode";
import PropTypes from "prop-types";
import "rc-tabs/assets/index.css";
import "./Type5-rc-tab-overrides.scss";

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

const Tabs = React.memo(
  withTheme(
    ({
      type,
      activeKey = 0,
      onTabChange,
      children,
      tabBackgrounds,
      ...props
    }) => {
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
                    border: `2px solid ${hash || "transparent"}`,
                    borderRadius: "25px",
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
          render={({
            segment: {stateTextStyles, stateBackgroundColors, view},
          }) => (
            <>
              <GlobalStyle
                theme={props.theme}
                backgrounds={{
                  active: stateBackgroundColors.selected,
                  default: stateBackgroundColors.unselected,
                }}
              />
              <RcTab
                tabBarPosition="top"
                onChange={(...args) => {
                  onTabChange(args[0].replace(".$", ""));
                }}
                activeKey={`.$${activeKey}`}
                {...props}
                renderTabBar={() => <CustomInkBar />}
                renderTabContent={() => (
                  <TabContent animated style={{flexGrow: "1"}} />
                )}
              >
                {renderChildren(stateTextStyles, stateBackgroundColors, view)}
              </RcTab>
            </>
          )}
        />
      );
    },
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
export default Tabs;
