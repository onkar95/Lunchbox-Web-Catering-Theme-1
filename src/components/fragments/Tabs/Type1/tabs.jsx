import React, {Children} from "react";
import {withTheme, createGlobalStyle} from "styled-components";
import {Segment, ThemeText} from "components/elementsThemed";
import RcTab, {TabPane} from "rc-tabs";
import TabContent from "rc-tabs/lib/TabContent";
import InkTabBar from "rc-tabs/lib/InkTabBar";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";
import PropTypes from "prop-types";
import "rc-tabs/assets/index.css";
import "./rc-tab-overrides.css";

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
      type,
      activeKey = 0,
      onTabChange,
      children,
      tabBackgrounds,
      ...props
    }) => {
      const renderChildren = ({selected, unselected}) =>
        Children.map(children, (child) => {
          const isActive = activeKey === child.key;
          return (
            <TabPane
              key={child.key}
              tab={
                <ThemeText type={isActive ? selected : unselected}>
                  {child.props.title}
                </ThemeText>
              }
            >
              {child.props.children}
            </TabPane>
          );
        });
      return (
        <Segment
          type={type}
          render={({segment: {stateTextStyles, stateBackgroundColors}}) => (
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
                renderTabBar={() =>
                  props.scrolling ? (
                    <ScrollableInkTabBar styles={{height: "3px"}} />
                  ) : (
                    <InkTabBar
                      styles={{
                        color:
                          props.theme.colors[stateBackgroundColors.selected],
                        inkBar: {
                          backgroundColor:
                            props.theme.colors[stateBackgroundColors.selected],
                          height: "2px",
                        },
                      }}
                    />
                  )
                }
                renderTabContent={() => (
                  <TabContent animated style={{flexGrow: "1"}} />
                )}
              >
                {renderChildren(stateTextStyles, stateBackgroundColors)}
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
