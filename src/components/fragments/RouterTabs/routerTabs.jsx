import React from "react";
import {MemoryRouter, Route} from "react-router-dom";
import {PoseGroup} from "react-pose";
import {Nav, NavItem} from "./routerNav";
import RouterContainer from "./routerContainer";
// import styles from './routerTabs.module.css';

const RouterTabs = ({children}) => {
  const [activeTab] = React.useState(0);
  const navNames = React.Children.map(children, (child) => {
    return child.props.name;
  });
  return (
    <MemoryRouter
      initialEntries={[`/${navNames[activeTab]}`]}
      initialIndex={activeTab}
    >
      <div>
        <Route
          render={({location}) => (
            <>
              <Nav>
                {navNames.map((i) => (
                  <NavItem to={`/${i}`} active={activeTab === i}>
                    {i}
                  </NavItem>
                ))}
              </Nav>
              <PoseGroup>
                <RouterContainer key={location.key}>{children}</RouterContainer>
              </PoseGroup>
            </>
          )}
        />
      </div>
    </MemoryRouter>
  );
};

export default React.memo(RouterTabs);
