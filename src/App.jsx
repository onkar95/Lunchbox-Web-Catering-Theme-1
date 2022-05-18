import React, {useEffect} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {ThemeProvider} from "styled-components";
import {UserAgentProvider} from "use-user-agent";
import {GlobalConfig} from "components/providers";
import {Fragments, Providers} from "components";
import Routes from "Routes";
import {constants, helpers, config} from "utils";
import {version} from "PackageData";
import {ThemeStore} from "@lunchboxinc/lunchbox-components-v2/dist/configProvider";
// import themeData from "../clients/fleishers/theme.json";

const {Template, Patron, Order, Menu, Notifications} = Providers;
const {Loader, Sift} = Fragments;

const matchesPathname = (pathname) => {
  if (pathname.includes("/location")) {
    return true;
  }
  return false;
};

const App = () => {
  useEffect(() => {
    const currentVersion = localStorage.getItem("version");
    const newVersion = version;

    if (currentVersion !== newVersion) {
      localStorage.removeItem("order");
      localStorage.removeItem("items");
    }

    localStorage.setItem("version", version);
  }, []);

  const currentConfigId = localStorage.getItem("configId");
  const newConfigId = config.id;
  if (currentConfigId && newConfigId !== currentConfigId) {
    localStorage.clear();
  }
  localStorage.setItem("configId", newConfigId);

  return (
    <Template.TemplateStore>
      {({
        fetching,
        theme: {
          colors,
          fonts,
          elements: {buttons},
        },
      }) =>
        fetching ? (
          <Loader />
        ) : (
          <ThemeStore
            userTheme={config.directory}
            env={
              process.env.BUILD_ENV === "local"
                ? "development"
                : process.env.BUILD_ENV
            }
            project="catering"
            // readLocal
            // localData={themeData}
            // use local theme when in developing mode
          >
            <UserAgentProvider userAgent={window.navigator.userAgent}>
              <Notifications.NotificationStore>
                <ThemeProvider theme={{buttons, colors, fonts}}>
                  <Patron.PatronStore>
                    {({patron}) => (
                      <Router>
                        <Sift
                          siftBeaconKey={constants.SIFT_BEACON_KEY}
                          sessionId={constants.SESSION_ID}
                          userId={helpers.getPropValue(patron, "id")}
                        />
                        <Route
                          render={({location}) => (
                            <GlobalConfig.Provider>
                              <Order.OrderStore
                                persist
                                applyDefaultDiningOption={
                                  !matchesPathname(location.pathname)
                                }
                              >
                                {(orderContext) => (
                                  <Menu.MenuStore
                                    location={orderContext.location}
                                    orderType={orderContext.order.orderType}
                                  >
                                    {(menuContext) => (
                                      <Routes
                                        order={orderContext}
                                        menu={menuContext}
                                      />
                                    )}
                                  </Menu.MenuStore>
                                )}
                              </Order.OrderStore>
                            </GlobalConfig.Provider>
                          )}
                        />
                      </Router>
                    )}
                  </Patron.PatronStore>
                </ThemeProvider>
              </Notifications.NotificationStore>
            </UserAgentProvider>
          </ThemeStore>
        )}
    </Template.TemplateStore>
  );
};
export default App;
